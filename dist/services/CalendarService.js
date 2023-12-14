"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarService", {
    enumerable: true,
    get: function() {
        return CalendarService;
    }
});
const _googleapis = require("googleapis");
const _dayjs = _interop_require_default(require("dayjs"));
const _uuid = require("uuid");
const _authcontroller = require("../controllers/auth.controller");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
let CalendarService = class CalendarService {
    static async insertEvent(eventData) {
        const oAuth2Client = new _googleapis.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
        oAuth2Client.setCredentials(_authcontroller.AuthController.tokenn);
        const startDateTime = (0, _dayjs.default)(eventData.startDateTime).toISOString();
        const endDateTime = (0, _dayjs.default)(eventData.endDateTime).toISOString();
        console.log(startDateTime, endDateTime);
        const isLink = (location)=>{
            const linkRegex = /^(http|https):\/\/[^ "]+$/;
            return linkRegex.test(location);
        };
        const response = await CalendarService.calendar.events.insert({
            calendarId: "primary",
            auth: oAuth2Client,
            conferenceDataVersion: 1,
            sendNotifications: true,
            requestBody: _object_spread({
                summary: eventData.summary,
                description: eventData.description,
                start: {
                    dateTime: startDateTime,
                    timeZone: "Asia/Kolkata"
                },
                end: {
                    dateTime: endDateTime,
                    timeZone: "Asia/Kolkata"
                },
                attendees: eventData.attendees
            }, isLink(eventData.location) ? {
                location: eventData.location
            } : {
                location: eventData.location,
                conferenceData: {
                    createRequest: {
                        requestId: (0, _uuid.v4)()
                    }
                }
            })
        });
        return response.data;
    }
    static async listEvents(userEmail) {
        const oAuth2Client = new _googleapis.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
        oAuth2Client.setCredentials(_authcontroller.AuthController.tokenn);
        try {
            const response = await CalendarService.calendar.events.list({
                calendarId: "primary",
                auth: oAuth2Client,
                timeMin: new Date().toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: "startTime"
            });
            const events = (await response).data.items || [];
            const eventDetails = [];
            events.forEach((event)=>{
                const start = event.start.dateTime || event.start.date;
                const eventObject = {
                    summary: event.summary || "",
                    description: event.description || "",
                    start,
                    end: event.end.dateTime || event.end.date,
                    attendees: event.attendees || [],
                    meetLink: event.conferenceData || "",
                    location: event.location || "",
                    eventId: event.id
                };
                eventDetails.push(eventObject);
            });
            console.log(eventDetails);
            console.log("End of the function");
            return eventDetails;
        } catch (error) {
            console.error("Error fetching events:", error.message);
            throw error;
        }
    }
    static async updateEvent(eventId, updatedEvent) {
        const oAuth2Client = new _googleapis.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
        const startDateTime = (0, _dayjs.default)(updatedEvent.startDateTime).toISOString();
        const endDateTime = (0, _dayjs.default)(updatedEvent.endDateTime).toISOString();
        oAuth2Client.setCredentials(_authcontroller.AuthController.tokenn);
        const response = await CalendarService.calendar.events.update({
            auth: oAuth2Client,
            calendarId: "primary",
            eventId: eventId,
            conferenceDataVersion: 1,
            sendNotifications: true,
            requestBody: {
                summary: updatedEvent.summary,
                description: updatedEvent.description,
                location: updatedEvent.location,
                start: {
                    dateTime: startDateTime,
                    timeZone: "Asia/Kolkata"
                },
                end: {
                    dateTime: endDateTime,
                    timeZone: "Asia/Kolkata"
                },
                conferenceData: {
                    createRequest: {
                        requestId: (0, _uuid.v4)()
                    }
                },
                attendees: updatedEvent.attendees
            }
        });
        console.log(response.data);
        return response.data;
    }
    static async deleteEvent(eventId) {
        const oAuth2Client = new _googleapis.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
        oAuth2Client.setCredentials(_authcontroller.AuthController.tokenn);
        const response1 = await CalendarService.calendar.events.get({
            auth: oAuth2Client,
            calendarId: "primary",
            eventId: eventId
        });
        const response = await CalendarService.calendar.events.delete({
            auth: oAuth2Client,
            calendarId: "primary",
            sendNotifications: true,
            eventId: eventId
        });
        return response1.data;
    }
};
_define_property(CalendarService, "calendar", _googleapis.google.calendar({
    version: "v3"
}));

//# sourceMappingURL=CalendarService.js.map