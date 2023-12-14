import express, { Router } from 'express';
import OtpController  from '../controllers/otp.controller';
import otpMiddleware from '../middlewares/otp';

class OtpRoute {
  public path = '/api/otp';
  public router: Router = express.Router();
  private otpController: OtpController = new OtpController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/generate`, otpMiddleware, this.otpController.generateOtp);
    this.router.post(`${this.path}/verify`, this.otpController.verifyOtp);
  }
}

export default OtpRoute;