// Import necessary modules and types from Express
import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { Routes } from "@interfaces/routes.interface";

// Class definition for AuthRoutes implementing the Routes interface
class AuthRoutes implements Routes {
	// Define the base path for these routes
	public path = "/";

	// Create an Express Router instance
	public router = Router();

	// Create an instance of AuthController for handling authentication-related routes
	public authController = new AuthController();

	// Constructor to initialize routes
	constructor() {
		this.initializeRoutes();
	}

	// Method to initialize authentication-related routes
	private initializeRoutes() {
		// Route to initiate the authentication process
		// this.router.get(`${this.path}`, AuthController.authenticateUser);
		this.router.get(`${this.path}`, AuthController.authenticateUser);

		// Route to handle the OAuth callback after user authorization
		this.router.get(
			`${this.path}google/redirect`,
			AuthController.handleOAuthCallback,
		);
	}
}

// Export the AuthRoutes class
export default AuthRoutes;
