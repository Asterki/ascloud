import expressSession from "express-session";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";

import { app, config } from "../";

import UserModel from "../models/user";

import type { User } from "../../../shared/types/models";
import { Document } from "mongoose";

// Cookie session
const sessionStore = mongoStore.create({
	mongoUrl: config.mongoURI,
});

app.use(
	expressSession({
		secret: config.sessions.secret,
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			secure: config.sessions.cookieSecure,
			maxAge: config.sessions.cookieMaxAge,
		},
	})
);

app.use(cookieParser(config.sessions.secret));
app.use(passport.initialize());
app.use(passport.session());

// For authentication on each request
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

const createUserFolder = () => {};

export { createUserFolder };
