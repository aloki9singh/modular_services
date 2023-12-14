// Import necessary modules and types from Express
import express, { Router } from "express";
import { AuthenticationMiddleware } from "../middlewares/AuthenticationMiddleware";
import { EventController } from "../controllers/EventController";
import { Routes } from "@interfaces/routes.interface";

// Class definition for EventRoutes implementing the Routes interface
class EventRoutes implements Routes {
	// Define the base path for these routes
	public path = "/event";

	// Create an Express Router instance
	public router = Router();

	// Create an instance of EventController for handling event-related routes
	public eventController = new EventController();

	// Constructor to initialize routes
	constructor() {
		this.initializeRoutes();
	}

	// Method to initialize event-related routes
	private initializeRoutes() {
		// Route to schedule a new event
		this.router.post(
			`${this.path}/schedule_event`,
			AuthenticationMiddleware.isAuthenticated, // Middleware to ensure user is authenticated
			EventController.scheduleEvent,
		);

		// Route to list events for a specific user
		this.router.get(
			`${this.path}/list-events/:email`,
			AuthenticationMiddleware.isAuthenticated, // Middleware to ensure user is authenticated
			EventController.listEvent,
		);

		// Route to update an existing event
		this.router.post(
			`${this.path}/update-event/:eventId`,
			AuthenticationMiddleware.isAuthenticated, // Middleware to ensure user is authenticated
			EventController.updateEvent,
		);

		// Route to delete an existing event
		this.router.get(
			`${this.path}/delete-event/:eventId`,
			AuthenticationMiddleware.isAuthenticated, // Middleware to ensure user is authenticated
			EventController.deleteEvent,
		);

		// this.router.get(
		// 	`${this.path}/tests`,
		// 	EventController.test,
		// );
	}
}

// Export the EventRoutes class
export default EventRoutes;
