import { Router } from 'express';
import LogController from '../controllers/log.controller';
import { Routes } from '../interfaces/routes.interface';

class LogRoute implements Routes{
  public path = '/log';
  public router = Router();
  public logController = new LogController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // To get the all information of shorten url
    this.router.get(`${this.path}/:short_id`, this.logController.getURLAnalytics);

   // To get the all visitors information i.e ip address and time 
    this.router.get(`${this.path}/visitors/:short_id`, this.logController.getAllVisitors);
  }
}

export default LogRoute;
