// import AdminUserModel from '@models/admin';
import { PassportStatic } from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/user.model';
import { UserDocument } from '../interfaces/user';

export default function (passport: PassportStatic) {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
			const user: any = await UserModel.findOne({ email: email });
			if (!user) {
				return done('Email not found', false);
			}
			//match password
			if (bcrypt.compareSync(password, user.password) === false) {
				return done(`Email or password is incorrect: ${password}`, false);
			}
			return done(null, user);
		}),
	);

	passport.serializeUser(function (user: UserDocument, done) {
		return done(null, user._id);
	});

	passport.deserializeUser(async function (id: string, done) {
		try {
			const user = await UserModel.findOne({ _id: id });
			return done(null, user);
		} catch (err) {
			return done(err, false);
		}
	});
}
