import { NextFunction, Request, Response } from 'express';

export async function ensureAuth(req: Request, res: Response, next: NextFunction) {
	// check if user is authenticated
	if(req.isAuthenticated()) {
		return next();
	}
	return res.status(401).send({ message: 'Unauthorized', reason: 'You are not logged in' });
}

export async function ensureAdminAuth(req: Request, res: Response, next: NextFunction) {
	
	// check if user is authenticated and is admin
	// if (!req.isAuthenticated()) {
	// 	return res.status(401).send({ message: 'Unauthorized', reason: 'You do not have client id and/or api key' });
	// }
	next();
}
