import express, { Request, Response } from "express";
import { isExpired, check_expire } from "../middlewares/url";
import UrlController from "../controllers/url.controller";
import { Routes } from "../interfaces/routes.interface";

class UrlRoute implements Routes {
	public router = express.Router();
	public path = "/";
	public urlController = new UrlController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//POST: create short urls
		this.router.post(
			`${this.path}short`,
			check_expire,
			this.urlController.shortenURL,
		);

		//GET: get all urls created by app_id
		this.router.get(
			`${this.path}appid`,
			this.urlController.getShortUrlsByAppId,
		);

		//DELETE: deletes the short url by short_id
		this.router.delete(
			`${this.path}delete/:shortId`,
			this.urlController.deleteShortUrl,
		);

		//PUT: updates short url by short_id
		this.router.put(
			`${this.path}update/:shortId`,
			this.urlController.updateURL,
		);
		
		//GET: redirect to original url
		this.router.get(
			`${this.path}:shortId`,
			isExpired,
			this.urlController.redirectToOriginalURL,
		);
	}
}

export default UrlRoute;
