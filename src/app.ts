import express from 'express';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import { connect, set } from 'mongoose';
import env from './configs/env';
import { Routes } from './interfaces/routes.interface';
import session from 'express-session';
import passport from 'passport';
import ConnectMongoDBSession from 'connect-mongodb-session';
import passportConfig from './configs/passport';
import morgan from "morgan";

const MongoDBSession = ConnectMongoDBSession(session);
passportConfig(passport);

class App {
	public app: express.Application;
	public env: string;
	public port: string | number;
	private store: ConnectMongoDBSession.MongoDBStore;

	constructor(routes: Routes[]) {
		this.app = express();
		this.env = env.NODE_ENV || 'development';
		this.port = env.PORT || 3000;
		this.store = new MongoDBSession({ uri: env.MONGODB_URI, collection: 'adminSessions' });
		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`App listening on the port ${this.port}`);
		});
	}

	public getServer() {
		return this.app;
	}

	private connectToDatabase() {
		if (this.env !== 'production') {
			set('debug', false);
		}

		connect(env.MONGODB_URI)
			.then(() => {
				console.log('Connected to DB');
			})
			.catch(error => {
				console.error(error);
			});
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach(route => {
			this.app.use('/', route.router);
		});
	}
	private initializeMiddlewares() {
		this.setupCORS();
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(express.json({ limit: '1mb' }));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(passport.initialize());
		this.app.use(
			session({
				secret: env.SESSION_SECRET,
				resave: false,
				saveUninitialized: false,
				store: this.store,
				name: env.AUTH_COOKIE_NAME,
				cookie: {
					domain: env.COOKIE_DOMAIN,
					maxAge: 1000 * 60 * 60 * 24 * 30,
					sameSite: 'lax',
					secure: this.env === 'production',
					httpOnly: true,
				},
			}),
		);
		this.app.use(passport.session());
		this.app.use(morgan('dev'));
	}
	private setupCORS() {
		const origins: boolean | string | RegExp | (boolean | string | RegExp)[] = [];
		if (['development'].includes(env.NODE_ENV)) {
			origins.push(/localhost:/);
		}
		const corsOrigins = env.CORS_ORIGINS.split(',');
		if (corsOrigins.length > 0) {
			origins.push(
				...corsOrigins.map(corsOrigin => {
					return corsOrigin.trim();
				}),
			);
		}
		this.app.use(
			cors({
				origin: origins,
				credentials: true,
			}),
		);
	}
}

export default App;
