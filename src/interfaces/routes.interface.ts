import { Router } from 'express';

export interface Routes {
	path?: string;
	router: Router;
}

export interface AdminUserRoutes extends Routes {
	path: string;
	router: Router;
	adminUserRouter: Router;
}
