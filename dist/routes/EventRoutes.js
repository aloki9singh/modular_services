"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _express = require("express");
const _AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const _EventController = require("../controllers/EventController");
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
let EventRoutes = class EventRoutes {
    initializeRoutes() {
        this.router.post(`${this.path}/schedule_event`, _AuthenticationMiddleware.AuthenticationMiddleware.isAuthenticated, _EventController.EventController.scheduleEvent);
        this.router.get(`${this.path}/list-events/:email`, _AuthenticationMiddleware.AuthenticationMiddleware.isAuthenticated, _EventController.EventController.listEvent);
        this.router.post(`${this.path}/update-event/:eventId`, _AuthenticationMiddleware.AuthenticationMiddleware.isAuthenticated, _EventController.EventController.updateEvent);
        this.router.get(`${this.path}/delete-event/:eventId`, _AuthenticationMiddleware.AuthenticationMiddleware.isAuthenticated, _EventController.EventController.deleteEvent);
    }
    constructor(){
        _define_property(this, "path", "/event");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "eventController", new _EventController.EventController());
        this.initializeRoutes();
    }
};
const _default = EventRoutes;

//# sourceMappingURL=EventRoutes.js.map