import express from "express";
import http from "http";

import chalk from "chalk";
import path from "path";
import dotenv from "dotenv";

const dev = process.env.NODE_ENV == "development";

dotenv.config({ path: path.join(__dirname, dev ? "../.env.local" : "../.env.production") });

// Declare the servers that we're gonna use
const app = express();
const server = http.createServer(app);

// Load all the configuration
require("./services/databases");
require("./services/accounts");
require("./services/storage");
require("./routes/router");

// Start the files server
server.listen(process.env.PORT, () => {
	console.log(
		`- ${chalk.magenta("event")} - Server running in ${dev ? "development" : "production"} mode at ${
			process.env.PORT
		}`
	);
});

export { app, server };
