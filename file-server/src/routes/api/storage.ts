import express from "express";
import { z } from "zod";

import path from "path";
import multer from "multer";

import * as storageService from "../../../../file-server/src/services/storage";

import { User } from "../../../../shared/types/models";
import * as RouteTypes from "../../../../shared/types/api/storage";

const router: express.Router = express.Router();

// #region File related
// Download a file
router.get("/file", (req, res: express.Response<RouteTypes.FileResponse>) => {
	if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

	try {
		// Ensure the route is there
		const parsedBody = z
			.object({
				folderPath: z.string(),
				fileName: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("missing-parameters");

		const filePath = storageService.getFile(
			(req.user as User).userID,
			parsedBody.data.folderPath,
			parsedBody.data.fileName
		);
		if (filePath == "no-file") return res.send(filePath);
		else return res.sendFile(filePath);
	} catch (error: unknown) {
		res.status(500).send("server-error");
	}
});

// Upload a file
router.post(
	"/file",
	storageService.tempUpload.fields([{ name: "file", maxCount: 1 }, { name: "folderPath" }, { name: "fileName" }]),
	async (req, res: express.Response<RouteTypes.UploadFileResponse>) => {
		if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

		if (!(req.files as any).file.length) return res.status(400).send("missing-parameters");

		try {
			// Body data schema
			const parsedBody = z
				.object({
					folderPath: z.string(),
				})
				.required()
				.safeParse(req.body);

			if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("missing-parameters");
			const { folderPath } = parsedBody.data;

			// Avoid path traversal attacks
			const filePath = path.join(__dirname, `../../../storage/${(req.user as User).userID}/files/`, folderPath);
			if (!filePath.startsWith(path.join(__dirname, `../../../storage/${(req.user as User).userID}/files`)))
				return res.status(400).send("invalid-parameters");

			// @ts-ignore
			const result = await storageService.upload(req, res, filePath, req.files.file[0].originalname);
			res.send(result);
		} catch (err: unknown) {
			res.status(500).send("server-error");
		}
	}
);

// Delete a file
router.delete("/file", async (req, res: express.Response<RouteTypes.DeleteFileResponse>) => {
	if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

	try {
		// Ensure the route is there
		const parsedBody = z
			.object({
				folderPath: z.string(),
				fileName: z.string(),
			})
			.required()
			.safeParse(req.query);

		if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("missing-parameters");

		const results = await storageService.deleteFile(
			(req.user as User).userID,
			parsedBody.data.folderPath,
			parsedBody.data.fileName
		);
		res.send(results);
	} catch (err: unknown) {
		res.status(500).send("server-error");
	}
});

// Rename a file
router.patch("/file", (req, res) => {
	return res.status(501);
});
// #endregion

// #region Folder related
// Get folder contents
router.get("/folder", (req, res: express.Response<RouteTypes.GetFolderContentsResponse>) => {
	if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

	try {
		// Ensure the route is there
		const parsedBody = z
			.object({
				folderPath: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("missing-parameters");

		const results = storageService.getFolderContents((req.user as User).userID, parsedBody.data.folderPath);
		res.send(results);
	} catch (err: unknown) {
		res.status(500).send("server-error");
	}
});

// Create folder
router.post("/folder", (req, res: express.Response<RouteTypes.CreateFolderResponse>) => {
	if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

	try {
		// Ensure the route is there
		const parsedBody = z
			.object({
				folderPath: z.string(),
			})
			.required()
			.safeParse(req.query);

		if (!parsedBody.success && "error" in parsedBody) return res.status(400).send("missing-parameters");

		const results = storageService.createFolder((req.user as User).userID, parsedBody.data.folderPath);
		res.send(results);
	} catch (err: unknown) {
		res.status(500).send("server-error");
	}
});

// Delete folder
router.delete("/folder", (req, RouteTypes) => {});
// #endregion

router.post("/delete", (req, res) => {});

router.post("/rename", (req, res) => {});

router.post("/share", (req, res) => {});

module.exports = router;
