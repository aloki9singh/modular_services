import HealthCheckRoute from "@routes/health-check";
import App from "@app";
import AdminAuthRoute from "@routes/admin/auth.route";
import UrlRoute from "@routes/url.route";
import LogRoute from "@routes/log.route";
import EventRoutes from "@routes/EventRoutes";
import AuthRoutes from "@routes/AuthRoutes";
import OtpRoute from "@routes/otp.route";

const app = new App([
	new AuthRoutes(),
	new EventRoutes(),
	new AdminAuthRoute(),
	new HealthCheckRoute(),
	new LogRoute(),
	new UrlRoute(),
	new OtpRoute(),
]);
app.listen();
