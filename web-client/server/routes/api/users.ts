import express from "express";

import { z } from "zod";

import * as userService from "../../services/users";

import { User } from "../../../shared/types/models";
import * as RouteTypes from "../../../shared/types/api/users";

const router: express.Router = express.Router();

// TFA Related
router.post("/tfa", async (req, res: express.Response<RouteTypes.ActivateTFAResponse>) => {
	if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

	try {
		const parsedBody = z
			.object({
				tfaToken: z.string(),
				tfaCode: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("invalid-parameters");

		const result = await userService.activateTFA(
			(req.user as User).userID,
			parsedBody.data.tfaToken,
			parsedBody.data.tfaCode
		);
		return res.status(200).send(result);
	} catch (err: unknown) {
		res.status(500).send("server-error");
	}
});

router.delete("/tfa", async (req, res: express.Response<RouteTypes.DeactivateTFAResponse>) => {
	if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

	try {
		const parsedBody = z
			.object({
				password: z.string(),
				tfaCode: z.string().optional(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("invalid-parameters");

		const result = await userService.deactivateTFA((req.user as User).userID, parsedBody.data.password);
		return res.status(200).send(result);
	} catch (err: unknown) {
		res.status(500).send("server-error");
	}
});

module.exports = router;
