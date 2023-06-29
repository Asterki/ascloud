import expressSession from "express-session";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import fs from "fs-extra";

import { app, config } from "../";

import UserModel from "../models/user";

import { Document } from "mongoose";
import { User } from "../../../shared/types/models";

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

// #region Users related
const storageRoot = process.env.NODE_ENV == "development" ? "../../storage" : "../../../../storage";
const createUserFolders = async (userID: string) => {
	// Check if the userID provided is from an actual user
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	if (!user) return "no-user";

	const userFolderRoot = path.join(__dirname, storageRoot, userID);

	// Ensure the folder is not yet there
	const stats = fs.statSync(userFolderRoot);
	if (stats.isDirectory()) {
		return "folder-exists";
	} else {
		fs.mkdirpSync(path.join(userFolderRoot, "/files"));
		fs.mkdirpSync(path.join(userFolderRoot, "/temp"));
		fs.mkdirpSync(path.join(userFolderRoot, "/shared"));
		fs.mkdirpSync(path.join(userFolderRoot, "/bin"));

		return "done";
	}
};

export { createUserFolders };
