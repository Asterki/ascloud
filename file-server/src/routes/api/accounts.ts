import express from "express";
import { z } from "zod";

import * as accountsService from "../../services/accounts";

const router: express.Router = express.Router();

// TFA Related
router.post("/user-folders", async (req: express.Request, res: express.Response) => {
	try {
		// Ensure the route is there
		const parsedBody = z
			.object({
				userID: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("missing-parameters");

		const result = accountsService.createUserFolders(parsedBody.data.userID);
		return res.send(result);
	} catch (error: unknown) {
		res.status(500).send("server-error");
	}
});

module.exports = router;
