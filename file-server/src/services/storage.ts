import multer from "multer";
import express from "express";

import path from "path";
import fs from "fs-extra";

import { User } from "../../../shared/types/models";

// * Storages
const tempStorage = multer.diskStorage({
	destination: (req, _file, cb) => {
		const fullPath = path.join(__dirname, `${storageRoot}/${(req.user as User).userID}/temp/`);
		cb(null, fullPath);
	},
	filename: (_req, file, cb) => {
		cb(null, file.originalname);
	},
});
const tempUpload = multer({ storage: tempStorage });

const storageRoot = process.env.NODE_ENV == "development" ? "../../storage" : "../../../../storage";

// Function made to normalize the file paths
const addTrailingSlash = (filePath: string): string => {
	const normalizedPath = path.normalize(filePath);
	if (!normalizedPath.endsWith(path.sep)) return normalizedPath + path.sep;
	return normalizedPath;
};

// * File Service Methods
// #region
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

const uploadFile = async (req: express.Request, res: express.Response, filePath: string, fileName: string) => {
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

const deleteFile = async (userID: string, folderPath: string, fileName: string) => {
	const fileFound = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath, fileName);
	if (!fileFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-file";

	const stats = fs.statSync(fileFound);
	if (stats.isFile()) {
		const dateDeleted = new Date(Date.now());
		fs.renameSync(
			fileFound,
			path.join(
				__dirname,
				`${storageRoot}/${userID}/bin/${fileName} - ${dateDeleted.toLocaleDateString().split("/").join("-")}`
			)
		);
		return "done";
	} else {
		return "no-file";
	}
};

const renameFile = async (userID: string, folderPath: string, fileName: string, newName: string) => {
	const fileFound = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath, fileName);
	if (!fileFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-file";

	const stats = fs.statSync(fileFound);
	if (stats.isFile()) {
		// Check if the new name is already in use
		const newPath = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath, newName);

		const isNameInUse = fs.statSync(newPath).isFile();
		if (isNameInUse) return "name-in-use";

		fs.renameSync(fileFound, newPath);
		return "done";
	} else {
		return "no-file";
	}
};
// #endregion

// * Folder Service Methods
// #region
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

const createFolder = (userID: string, folderPath: string, folderName: string) => {
	const folderNameRegex = /^[^\\/:*?"<>|]+$/;
	if (!folderNameRegex.test(folderName)) return "invalid-name";

	const folderFound = path.join(__dirname, `${storageRoot}/${userID}/files${folderPath}`, folderName); // Get the route
	if (!folderFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "invalid-name";

	// Get the information about that folder path

	// Check if the folder exists
	if (fs.existsSync(folderFound)) {
		const stats = fs.statSync(folderFound);
		if (stats.isDirectory()) return "folder-exists";
	} else {
		fs.mkdirpSync(folderFound);
		return "done";
	}
};

const deleteFolder = (userID: string, folderPath: string, folderName: string) => {
	const folderFound = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath, folderName);
	if (!folderFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-folder";

	const stats = fs.statSync(folderFound);
	if (stats.isDirectory()) {
		const dateDeleted = new Date(Date.now());
		fs.renameSync(
			folderFound,
			`${storageRoot}/${userID}/bin/${folderName} - ${dateDeleted.toLocaleDateString().split("/").join("-")}`
		);
		return "done";
	} else {
		return "no-folder";
	}
};

const renameFolder = (userID: string, folderPath: string, newName: string) => {
	const fileFound = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath);
	if (!fileFound.startsWith(path.join(__dirname, `${storageRoot}/${userID}/files`))) return "no-folder";

	const stats = fs.statSync(fileFound);
	if (stats.isDirectory()) {
		// Check if the new name is already in use
		const newPath = path.join(__dirname, `${storageRoot}/${userID}/files`, folderPath, newName);

		const isNameInUse = fs.statSync(newPath).isDirectory();
		if (isNameInUse) return "name-in-use";

		fs.renameSync(fileFound, newPath);
		return "done";
	} else {
		return "no-folder";
	}
};
// #endregion

// * Sharing Service Methods
// #region
const shareFile = (userID: string, folderPath: string, fileName: string) => {};

const deleteSharedFile = (userID: string, fileID: string) => {};
// #endregion

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

export {
	getFile,
	uploadFile,
	deleteFile,
	renameFile,
	getFolderContents,
	createFolder,
	deleteFolder,
	renameFolder,
	tempUpload,
};
