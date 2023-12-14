"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = _interop_require_default(require("supertest"));
const _app = _interop_require_default(require("../app"));
const _EventRoutes = _interop_require_default(require("../routes/EventRoutes"));
const _authcontroller = require("../controllers/auth.controller");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let eventId;
describe('URL Routes', ()=>{
    let app;
    var userTestStatus = [
        {
            summary: "",
            description: "Test case 11",
            startDateTime: "2023-12-30T13:45:00.000Z",
            endDateTime: "2023-12-30T14:45:00.000Z",
            location: "Delhi",
            attendees: [
                {
                    email: "rajgupta74434@gmail.com"
                }
            ]
        },
        {
            summary: "Test case 12",
            description: "Test case 12",
            startDateTime: "",
            endDateTime: "2023-12-30T15:45:00.000Z",
            location: "Delhi",
            attendees: [
                {
                    email: "rajgupta74434@gmail.com"
                }
            ]
        },
        {
            summary: "Test case 13",
            description: "Test case 13",
            startDateTime: "2023-12-30T05:45:00.000Z",
            endDateTime: "",
            location: "Delhi",
            attendees: [
                {
                    email: "rajgupta74434@gmail.com"
                }
            ]
        },
        {
            summary: "Test case 14",
            description: "Test case 14",
            startDateTime: "2023-12-30T08:45:00.000Z",
            endDateTime: "2023-12-30T09:45:00.000Z",
            location: "",
            attendees: [
                {
                    email: "rajgupta74434@gmail.com"
                }
            ]
        },
        {
            summary: "Test case 15",
            description: "Test case 15",
            startDateTime: "2023-12-30T10:45:00.000Z",
            endDateTime: "2023-12-30T11:45:00.000Z",
            location: "Delhi",
            attendees: []
        }
    ];
    beforeAll(()=>{
        app = new _app.default([
            new _EventRoutes.default()
        ]);
        _authcontroller.AuthController.tokenn;
    });
    describe('Get /tests', ()=>{
        describe('POST /schedule_event', ()=>{
            it('should create a event ', async ()=>{
                const response = await (0, _supertest.default)(app.getServer()).post('/event/schedule_event').send({
                    summary: "Test case 4",
                    description: "Test case 4",
                    startDateTime: "2023-12-30T11:45:00.000Z",
                    endDateTime: "2023-12-30T12:45:00.000Z",
                    location: "Delhi",
                    attendees: [
                        {
                            email: "rajgupta74434@gmail.com"
                        },
                        {
                            email: "officialsiddharthbisht@gmail.com"
                        }
                    ]
                });
                expect(response.status).toBe(201);
            }, 10000);
            it('should create a event with out description and in location we have link of zoom', async ()=>{
                const response = await (0, _supertest.default)(app.getServer()).post('/event/schedule_event').send({
                    summary: "Test case 5",
                    description: "",
                    startDateTime: "2023-12-30T11:45:00.000Z",
                    endDateTime: "2023-12-30T12:45:00.000Z",
                    location: "https://zoom-lecture-recordings.s3.ap-south-1.amazonaws.com/82140017955/gai201_b30_daily_lectures_1698040260000",
                    attendees: [
                        {
                            email: "rajgupta74434@gmail.com"
                        }
                    ]
                });
                expect(response.status).toBe(201);
            }, 10000);
            userTestStatus.forEach((input, index)=>{
                it(`should not create a event with  ${index}  and gives 500 response code `, async ()=>{
                    const response = await (0, _supertest.default)(app.getServer()).post('/event/schedule_event').send(input);
                    expect(response.status).toBe(500);
                    console.log("yes");
                }, 20000);
            });
        });
        describe('GET /list-events/:email', ()=>{
            it('should show list of events', async ()=>{
                const response = await (0, _supertest.default)(app.getServer()).get('/event/list-events/email');
                eventId = response._body[0].eventId;
                expect(response.status).toBe(200);
            }, 10000);
        });
        describe('UPDATE event/update-event/:eventId', ()=>{
            it('should update the event', async ()=>{
                const response = await (0, _supertest.default)(app.getServer()).post(`/event/update-event/${eventId}`).send({
                    summary: "Test case updated",
                    description: "Test case updated",
                    startDateTime: "2023-12-30T11:45:00.000Z",
                    endDateTime: "2023-12-30T12:45:00.000Z",
                    location: "Delhi",
                    attendees: [
                        {
                            email: "rajgupta74434@gmail.com"
                        }
                    ]
                });
                expect(response.status).toBe(200);
            }, 10000);
            it('should not update event because wrong eventId is sent', async ()=>{
                const response = await (0, _supertest.default)(app.getServer()).post(`/event/update-event/000`).send({
                    summary: "Test case updated",
                    description: "Test case updated",
                    startDateTime: "2023-12-30T11:45:00.000Z",
                    endDateTime: "2023-12-30T12:45:00.000Z",
                    location: "Delhi",
                    attendees: [
                        {
                            email: "rajgupta74434@gmail.com"
                        }
                    ]
                });
                expect(response.status).toBe(500);
            }, 10000);
            userTestStatus.forEach((input, index)=>{
                it(`should not create a event with  ${index} index test case  and gives 500 response code `, async ()=>{
                    const response = await (0, _supertest.default)(app.getServer()).post(`/event/update-event/${eventId}`).send(input);
                    expect(response.status).toBe(500);
                }, 20000);
            });
        });
        describe('DELETE event/delete-event/:eventId', ()=>{
            it('should delete the event', async ()=>{
                const response = await (0, _supertest.default)(app.getServer()).get(`/event/delete-event/${eventId}`);
                expect(response.status).toBe(200);
            }, 10000);
            it('should not delete any event because wrong event id is sent', async ()=>{
                const response = await (0, _supertest.default)(app.getServer()).get(`/event/delete-event/000}`);
                expect(response.status).toBe(500);
            }, 10000);
        });
    });
});

//# sourceMappingURL=calendar.spec.js.map