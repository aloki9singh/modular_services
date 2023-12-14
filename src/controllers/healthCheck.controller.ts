import { Request, Response } from 'express';
class HealthCheckController {
	public async get(req: Request, res: Response) {
		const ip = req.headers['x-forwarded-for'] || req.ip;
		res.send({
			status: 'OK',
			message: 'Hello World..!',
			ip,
		});
	}
}
export default HealthCheckController;
