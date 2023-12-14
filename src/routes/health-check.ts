import { Router } from 'express';
import HealthCheckController from '@controllers/healthCheck.controller';
import { Routes } from '@interfaces/routes.interface';

class HealthCheckRoute implements Routes {
	public path = '/health-check';
	public router = Router();
	public healthCheckController = new HealthCheckController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, this.healthCheckController.get);
	}
}

export default HealthCheckRoute;
