import { cleanEnv, num, port, str } from "envalid";
import { config } from "dotenv";

const validateEnv = () => {
	const env = config({
		path: `.env.${process.env.NODE_ENV}.local`,
	}).parsed;
	const cleanedEnv = cleanEnv(env, {
		NODE_ENV: str(),
		PORT: port(),
		MONGODB_URI: str(),
		OPENAI_API_KEY: str(),
		COOKIE_DOMAIN: str(),
		SESSION_SECRET: str(),
		AUTH_COOKIE_NAME: str(),
		CORS_ORIGINS: str(),
	});
	return cleanedEnv;
};
console.log("Validating env...");
const env = validateEnv();
console.log("Validated env: It's all good!");

export default env;
