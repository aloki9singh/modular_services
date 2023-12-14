import { Request, Response } from "express";
import Log from "../models/log.model";
import URL from "../models/url.model";
import { calculateUniqueVisitors } from "../services/calculateUniqueVisitors";

class LogController {
	public async getURLAnalytics(req: Request, res: Response): Promise<void> {
		try {
			const { short_id } = req.params;

			const urlDetails = await URL.findOne({ short_id });

			if (!urlDetails) {
				res.status(404).json({ error: "URL not found"});
				return;
			}

			// Fetch access logs for this URL
			const accessLogs = await Log.find({ url_id: urlDetails._id });

			// Assuming you have a function to calculate unique visitors
			const uniqueVisitors = calculateUniqueVisitors(accessLogs);

			const analyticsData = {
				original_url: urlDetails.original_url,
				short_id: urlDetails.short_id,
				expiration_date: urlDetails.expiration_date,
				starting_date: urlDetails.starting_date,
				title: urlDetails.title,
				description: urlDetails.description,
				status: urlDetails.status,
				short_url: urlDetails.short_url,
				stats: {
					total_visitors: accessLogs.length,
					unique_visitors: uniqueVisitors,
				},
			};

			res.json({
				url_details: analyticsData,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}

	public async getAllVisitors(req: Request, res: Response): Promise<void> {
		try {
			const { short_id } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = 6; // Number of visitors per page

			const urlDetails = await URL.findOne({ short_id });

			if (!urlDetails) {
				res.status(404).json({ error: "URL not found" });
				return;
			}

			const skip = (page - 1) * limit;

			const accessLogs = await Log.find({ url_id: urlDetails._id })
				.skip(skip)
				.limit(limit);
			res.json(accessLogs);
			
			return;
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default LogController;
