import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: {
		success: false,
		error: "Rate limit exceeded. Please try again later.",
	},
});

const otpMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	otpLimiter(req, res, (err) => {
		if (err) {
			return res.status(429).json({ success: false, error: err.message });
		} else {
			next();
		}
	});
};

export default otpMiddleware;
