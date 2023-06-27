import multer from "multer";
import express from "express";

import path from "path";
import fs from "fs-extra";

import { User } from "../../../shared/types/models";

// * Storages
const tempStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		const fullPath = path.join(__dirname, `${storageRoot}/${(req.user as User).userID}/temp/`);
		cb(null, fullPath);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});
const tempUpload = multer({ storage: tempStorage });

const storageRoot = process.env.NODE_ENV == "development" ? "../../storage" : "../../../../storage";

// * Service Methods
// #region
// Function made to normalize the file paths
const addTrailingSlash = (filePath: string): string => {
	const normalizedPath = path.normalize(filePath);
	if (!normalizedPath.endsWith(path.sep)) return normalizedPath + path.sep;
	return normalizedPath;
};

const getFile = (userID: string, folderPath: string, fileName: string): string | "no-file" => {
	// Ensure the file is there
	const fileFound = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath, fileName);
	if (!fileFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-file"; // no path traversal attacks today guys

	const stats = fs.statSync(fileFound);
	if (stats.isFile()) {
		return fileFound;
	} else {
		return "no-file";
	}
};

const getFolderContents = (
	userID: string,
	folderPath: string
): Array<{ isDirectory: boolean; fileName: string; fileSize: number }> | "no-folder" => {
	const folderFound = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath); // Get the route
	if (!folderFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-folder";

	// Get the information about that folder path
	const stats = fs.statSync(folderFound);
	const results: Array<{
		isDirectory: boolean;
		fileName: string;
		fileSize: number;
	}> = []; // Generate the array of the files in that folder

	if (stats.isDirectory()) {
		// Check if the folder exists
		fs.readdirSync(folderFound).forEach((file) => {
			// Get information about every file in the folder
			const fileStat = fs.statSync(path.join(folderFound, file));
			results.push({
				fileName: file,
				fileSize: fileStat.size,
				isDirectory: fileStat.isDirectory(),
			}); // Add it to the results array
		});
	} else {
		return "no-folder";
	}

	return results;
};

// * Note: the folder path should be an absolute one, not a relative one
const createFolder = (userID: string, folderPath: string): "done" | "folder-exists" | "invalid-name" => {
	const folderNameRegex = /^[^\\/:*?"<>|]+$/;
	if (!folderNameRegex.test(folderPath)) return "invalid-name";

	const folderFound = addTrailingSlash(path.join(__dirname, `${storageRoot}/${userID}/files${folderPath}`)); // Get the route
	if (!folderFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "invalid-name";

	// Get the information about that folder path
	const stats = fs.statSync(folderFound);

	if (stats.isDirectory()) {
		// Check if the folder exists
		return "folder-exists";
	} else {
		fs.mkdirpSync(folderFound);
	}

	return "done";
};

const upload = async (req: express.Request, res: express.Response, filePath: string, fileName: string) => {
	// Check if the file name is already in use
	if (fs.existsSync(path.join(filePath, fileName))) return "file-exists";

	// Check if the destination folder exists
	if (!fs.existsSync(filePath)) return "invalid-folder";

	// Upload the file to the temp folder
	tempUpload.single("file")(req, res, () => {});

	// Once it's done, move it to the main folder
	fs.renameSync(
		path.join(__dirname, `${storageRoot}/${(req.user as User).userID}/temp/${fileName}`),
		path.join(filePath, fileName)
	);

	return "done";
};

const deleteFileOrFolder = (userID: string, filePath: string): "done" | "no-file" => {
	// Ensure the file is there
	const fileFound = addTrailingSlash(path.join(__dirname, `${storageRoot}/${userID}/files/${filePath}`));
	if (!fileFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-file";

	const stats = fs.statSync(fileFound);

	if (stats.isFile()) {
		fs.moveSync(fileFound, `${storageRoot}/${userID}/bin/`);
		return "done";
	} else {
		return "no-file";
	}
};

const permanentDeleteFileOrFolder = (userID: string, filePath: string): "done" | "no-file" => {
	// Ensure the file is there
	const fileFound = path.join(__dirname, `${storageRoot}/${userID}/files/${filePath}`);
	if (!fileFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-file";

	const stats = fs.statSync(fileFound);

	if (stats.isFile()) {
		fs.unlinkSync(fileFound);
		return "done";
	} else {
		return "no-file";
	}
};

const renameFileOrFolder = () => {};

const shareFileOrFolder = () => {};
// #endregion

export {
	getFile,
	getFolderContents,
	createFolder,
	upload,
	deleteFileOrFolder,
	permanentDeleteFileOrFolder,
	renameFileOrFolder,
	shareFileOrFolder,
	tempUpload,
};
