import chalk from "chalk";
import { app } from "../index";

try {
	require("./middleware/app");
	// require("./middleware/helmet")
	console.log(`- ${chalk.cyan("info ")} - Middleware loaded`);

	// app.use("/api/test", require("./api/test"));
	app.use("/api/storage", require("./api/storage"));
	console.log(`- ${chalk.cyan("info ")} - Routes loaded`);
} catch (err: unknown) {
	console.log(`- ${chalk.redBright("error ")} - There was an error loading the routes`);
	console.log(err);
}

export { app };
