import express from "express";
import { z } from "zod";

import * as storageService from "../../services/storage";

import { User } from "../../../shared/types/models";
import * as RouteTypes from "../../../shared/types/api/storage";

const router: express.Router = express.Router();

router.post(
	"/file",
	(
		req: express.Request<unknown, RouteTypes.FileResponse, RouteTypes.FileRequestBody>,
		res: express.Response<RouteTypes.FileResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			// Ensure the route is there
			const parsedQuery = z
				.object({
					folderPath: z.string(),
					fileName: z.string(),
				})
				.required()
				.safeParse(req.query);

			if (!parsedQuery.success && "error" in parsedQuery) return res.status(400).send("invalid-parameters");

			const filePath = storageService.getFile(
				(req.user as User).userID,
				parsedQuery.data.folderPath,
				parsedQuery.data.fileName
			);
			if (filePath == "no-file") return res.send(filePath);
			else return res.sendFile(filePath);
		} catch (error: unknown) {
			res.status(500).send("server-error");
		}
	}
);

router.post(
	"/get-folder-contents",
	(
		req: express.Request<unknown, RouteTypes.GetFolderContentsResponse, RouteTypes.GetFolderContentsRequestBody>,
		res: express.Response<RouteTypes.GetFolderContentsResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			// Ensure the route is there
			const parsedQuery = z
				.object({
					folderPath: z.string(),
				})
				.required()
				.safeParse(req.query);

			if (!parsedQuery.success && "error" in parsedQuery) return res.status(400).send("invalid-parameters");

			const results = storageService.getFolderContents((req.user as User).userID, parsedQuery.data.folderPath);
			res.send(results);
		} catch (err: unknown) {
			res.status(500).send("server-error");
		}
	}
);

router.post(
	"/create-folder",
	(
		req: express.Request<unknown, RouteTypes.CreateFolderResponse, RouteTypes.CreateFolderRequestBody>,
		res: express.Response<RouteTypes.CreateFolderResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			// Ensure the route is there
			const parsedQuery = z
				.object({
					folderPath: z.string(),
				})
				.required()
				.safeParse(req.query);

			if (!parsedQuery.success && "error" in parsedQuery) return res.status(400).send("invalid-parameters");

			const results = storageService.createFolder((req.user as User).userID, parsedQuery.data.folderPath);
			res.send(results);
		} catch (err: unknown) {
			res.status(500).send("server-error");
		}
	}
);

router.post("/upload", (req, res) => {});

router.post("/delete", (req, res) => {});

router.post(
	"/permanent-delete",
	(
		req: express.Request<
			unknown,
			RouteTypes.PermanentDeleteFileOrFolderResponse,
			RouteTypes.PermanentDeleteFileOrFolderRequestBody
		>,
		res: express.Response<RouteTypes.PermanentDeleteFileOrFolderResponse>
	) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		try {
			// Ensure the route is there
			const parsedQuery = z
				.object({
					filePath: z.string(),
				})
				.required()
				.safeParse(req.query);

			if (!parsedQuery.success && "error" in parsedQuery) return res.status(400).send("invalid-parameters");

			const results = storageService.permanentDeleteFileOrFolder(
				(req.user as User).userID,
				parsedQuery.data.filePath
			);
			res.send(results);
		} catch (err: unknown) {
			res.status(500).send("server-error");
		}
	}
);

router.post("/rename", (req, res) => {});

router.post("/share", (req, res) => {});

module.exports = router;
