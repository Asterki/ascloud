import expressSession from "express-session";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";

import { app } from "../";

import UserModel from "../models/user";

import type { User } from "../../../shared/types/models";
import { Document } from "mongoose";

// Cookie session
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: true,
		store: mongoStore.create({
			mongoUrl: process.env.MONGODB_URI as string,
		}),
		cookie: {
			secure: (process.env.COOKIE_SECURE as string) == "true",
			maxAge: parseInt(process.env.COOKIE_MAX_AGE as string) || 604800000,
		},
	})
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

// For authentication on each request
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

const createUserFolder = () => {}