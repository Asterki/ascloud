import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import expressSession from "express-session";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passportLocal from "passport-local";
import passport from "passport";
import express from "express";
import speakeasy from "speakeasy";
import { mkdirp } from "mkdirp";
import path from "path";

import { app } from "../";

import UserModel from "../models/user";

import type { User } from "../../shared/types/models";
import { Document } from "mongoose";

const sessionStore = mongoStore.create({
	mongoUrl: process.env.MONGODB_URI as string,
});

// Cookie session
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			secure: (process.env.COOKIE_SECURE as string) == "true",
			maxAge: parseInt(process.env.COOKIE_MAX_AGE as string) || 604800000,
		},
	})
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

// Auth Strategy
passport.use(
	new passportLocal.Strategy(
		{
			usernameField: "usernameOrEmail",
			passwordField: "password",
			passReqToCallback: true,
			session: true,
		},
		async (req: express.Request, _email: string, _password: string, done) => {
			try {
				const user: (User & Document) | null = await UserModel.findOne({
					$or: [{ "email.value": req.body.usernameOrEmail }, { username: req.body.usernameOrEmail }],
				});
				if (!user) return done(null, false, { message: "invalid-credentials" });

				// Verify password and TFA code
				if (!bcrypt.compareSync(req.body.password, user.password))
					return done(null, false, { message: "invalid-credentials" });
				if (user.tfa.secret !== "") {
					if (!req.body.tfaCode) return done(null, false, { message: "requires-tfa" });

					const verified = speakeasy.totp.verify({
						secret: user.tfa.secret,
						encoding: "base32",
						token: req.body.tfaCode,
					});

					if (verified == false) return done(null, false, { message: "invalid-tfa-code" });
				}

				return done(null, user);
			} catch (err: unknown) {
				return done(err);
			}
		}
	)
);

// For authentication on each request
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

const registerUser = async (email: string, username: string, password: string) => {
	// Validate if either the email and the username are in use
	const userFound: (User & Document) | null = await UserModel.findOne({
		$or: [{ username: username.toLowerCase() }, { email: email }],
	});
	if (userFound) return "username-email-in-use";

	// Create the user object
	const userID = uuidv4();
	const user: User & Document = new UserModel({
		userID: userID,
		created: Date.now(),

		email: { value: email, verified: false },
		username: username.toLowerCase(),

		password: bcrypt.hashSync(password, 10),
		tfa: {
			secret: "",
		},
	} as User);

	// Create the user folders
	mkdirp.sync(path.join(__dirname, `../../storage/${userID}/files`));
	mkdirp.sync(path.join(__dirname, `../../storage/${userID}/temp`));
	mkdirp.sync(path.join(__dirname, `../../storage/${userID}/shared`));
	mkdirp.sync(path.join(__dirname, `../../storage/${userID}/bin`));

	// Save the user
	user.save();
	return user;
};

const deleteUser = async (
	user: User,
	password: string,
	tfaCode: string
): Promise<"requires-tfa" | "invalid-password" | "invalid-tfa" | "done"> => {
	// Comparing password and tfa
	if (!bcrypt.compareSync(password, user.password)) return "invalid-password";
	if (user.tfa.secret !== "") {
		if (!tfaCode) return "requires-tfa";

		const verified = speakeasy.totp.verify({
			secret: user.tfa.secret,
			encoding: "base32",
			token: tfaCode,
		});

		if (verified == false) return "invalid-tfa";
	}

	await UserModel.deleteOne({ userID: user.userID });
	return "done";
};

export { registerUser, deleteUser };
