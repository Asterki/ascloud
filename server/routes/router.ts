import chalk from "chalk";
import { app } from "../index";

try {
    require("./middleware/app")
    // require("./middleware/helmet")
    console.log(`${chalk.cyanBright("info ")} - Middleware loaded`);

    app.use("/api/accounts", require("./api/accounts"))
    console.log(`${chalk.cyanBright("info ")} - Routes loaded`);
} catch (err: unknown) {
    console.log(`${chalk.redBright("error ")} - There was an error loading the routes`);
    console.log(err);
}

export { app };
