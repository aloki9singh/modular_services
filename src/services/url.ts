import URL from "../models/url.model";
import { v4 as uuidv4 } from "uuid";

//Finding existing URLs
const findExistingURL = async (original_url: string) => {
	return await URL.findOne({ original_url });
};

//Generating Unique ShortID
const generateUniqueShortID = (): string => {
	const uuid = uuidv4();
	const base64 = Buffer.from(uuid).toString("base64");
	const shortID = base64
		.replace(/[+/=-_*&^%$#@!`~:;"',|<.>?]/g, "")
		.substring(0, 6);
	return shortID;
};

//Creating new Expiration Dates
const getExpirationDate = (expiration_date: string | undefined | null) => {
	if (expiration_date) {
		// Set expiration_date to the end of the day
		const date = new Date(expiration_date);
		date.setHours(23, 59, 59, 999);
		return date;
	}
	return null;
};

//Creating New url in database
const createNewURL = (
	original_url: string,
	short_id: string,
	expirationDate: string | undefined | null | Date,
	title: string | undefined,
	description: string | undefined,
) => {
	// Check if the URL has expired
	const isExpired = expirationDate && new Date(expirationDate) < new Date();

	const SHORT_URL_DOMAIN: string = process.env.SHORT_URL_DOMAIN;
	const short_url = `${SHORT_URL_DOMAIN}/${short_id}`;
  
	return new URL({
		original_url,
		short_id,
		short_url,
		starting_date: Date.now(),
		expiration_date: isExpired
			? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
			: expirationDate
			  ? new Date(expirationDate)
			  : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Set default to 1 year if not provided
		title,
		description,
		status: isExpired ? "expired" : "active",
	});
};

export {
	findExistingURL,
	generateUniqueShortID,
	getExpirationDate,
	createNewURL,
};
