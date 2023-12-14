import AuthController from '@controllers/auth.controller';
import { ensureAdminAuth } from '@middlewares/auth';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class AuthRoute implements Routes {
	public path = '/admin/auth';
	public router = Router();
	public authController = new AuthController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/signin`, this.authController.login);
		this.router.get(`${this.path}/signout`, this.authController.signout);

		this.router.get(`${this.path}/me`, ensureAdminAuth);
		this.router.post(`${this.path}/register`);
	}
}
export default AuthRoute;
