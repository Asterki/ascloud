import express from "express";
import next from "next";
import http from "http";
import nodemailer from "nodemailer";

import chalk from "chalk";
import path from "path";
import dotenv from "dotenv";

const dev = process.env.NODE_ENV == "development";
import config from "../../shared/config";

dotenv.config({ path: path.join(__dirname, dev ? "../.env.local" : "../.env.production") });

// Declare the servers that we're gonna use
const app = express();
const nextApp = next({ dev: dev });
const server = http.createServer(app);

nextApp.prepare().then(() => {
	const handle = nextApp.getRequestHandler();

	// Load all the configuration
	require("./services/databases");
	require("./services/accounts");
	require("./routes/router");

	app.get("*", (req: express.Request, res: express.Response) => {
		handle(req, res);
	});

	// Start the main server
	server.listen(config.mainServer.port, () => {
		console.log(
			`- ${chalk.magenta("event")} - Server running in ${dev ? "development" : "production"} mode at ${
				config.mainServer.port
			}`
		);
	});
});

// Email Client
const emailTransporter = nodemailer.createTransport({
	service: config.emailClient.service,
	auth: {
		user: config.emailClient.user,
		pass: config.emailClient.pass,
	},
});

export { app, nextApp, server, emailTransporter, config };
