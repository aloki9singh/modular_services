"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventController", {
    enumerable: true,
    get: function() {
        return EventController;
    }
});
const _CalendarService = require("../services/CalendarService");
const _authcontroller = require("./auth.controller");
let EventController = class EventController {
    static async scheduleEvent(req, res) {
        try {
            const eventData = req.body;
            const tokens = req.session.tokens;
            if (!_authcontroller.AuthController.tokenn) throw new Error("User not authenticated. Please log in first..!!");
            if (eventData.summary == "" || eventData.location == "" || eventData.attendees.length == 0) {
                throw new Error("summary or location or attendees is empty");
            }
            const response = await _CalendarService.CalendarService.insertEvent(eventData);
            res.status(201).send({
                msg: "Event created successfully"
            });
        } catch (error) {
            console.error("Error creating event:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
    static async listEvent(req, res) {
        try {
            const tokens = req.session.tokens;
            if (!_authcontroller.AuthController.tokenn) throw new Error("User not authenticated. Please log in first..!!");
            const response = await _CalendarService.CalendarService.listEvents(_authcontroller.AuthController.userEmail);
            res.send(response);
        } catch (error) {
            console.error("Error listing event:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
    static async updateEvent(req, res) {
        try {
            const eventId = req.params.eventId;
            const updatedEventData = req.body;
            console.log(updatedEventData);
            const tokens = req.session.tokens;
            if (!_authcontroller.AuthController.tokenn) throw new Error("User not authenticated. Please log in first..!!");
            if (updatedEventData.summary == "" || updatedEventData.location == "" || updatedEventData.attendees.length == 0) {
                throw new Error("summary or location or attendees is empty");
            }
            const response = await _CalendarService.CalendarService.updateEvent(eventId, updatedEventData);
            res.send({
                msg: "Event updated successfully",
                updatedEvent: response
            });
        } catch (error) {
            console.error("Error updating event:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
    static async deleteEvent(req, res) {
        try {
            const eventId = req.params.eventId;
            if (!_authcontroller.AuthController.tokenn) throw new Error("User not authenticated. Please log in first..!!");
            const response = await _CalendarService.CalendarService.deleteEvent(eventId);
            res.send({
                msg: "Event deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting event:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
};

//# sourceMappingURL=EventController.js.map