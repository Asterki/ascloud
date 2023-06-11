import path from 'path'
import { z } from "zod"
import fs from 'fs-extra'
import { mkdirp } from 'mkdirp';

// Function made to normalize the file paths
const addTrailingSlash = (filePath: string): string => {
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.endsWith(path.sep)) return normalizedPath + path.sep;
    return normalizedPath;
}

const getFile = (userID: string, filePath: string): string | "no-file" => {
    // Ensure the file is there
    const fileFound = addTrailingSlash(path.join(__dirname, `../../../storage/${userID}/files/${filePath}`))
    const stats = fs.statSync(fileFound);

    if (stats.isFile()) {
        return filePath
    } else {
        return "no-file"
    }
}

const getFolderContents = (userID: string, folderPath: string): Array<{ isDirectory: boolean, fileName: string, fileSize: number }> | "no-folder" => {
    const folderFound = addTrailingSlash(path.join(__dirname, `../../../storage/${userID}/files/${folderPath}`)); // Get the route

    // Get the information about that folder path
    const stats = fs.statSync(folderFound);
    const results: Array<{ isDirectory: boolean, fileName: string, fileSize: number }> = [] // Generate the array of the files in that folder

    if (stats.isDirectory()) { // Check if the folder exists
        fs.readdirSync(folderFound).forEach(file => {
            // Get information about every file in the folder
            const fileStat = fs.statSync(`${folderFound}${file}`)
            results.push({ fileName: file, fileSize: fileStat.size, isDirectory: fileStat.isDirectory() }) // Add it to the results array
        });
    } else {
        return "no-folder"
    }

    return results;
}

// * Note: the folder path should be an absolute one, not a relative one
const createFolder = (userID: string, folderPath: string): "done" | "folder-exists" | "invalid-name" => {
    const folderNameRegex = /^[^\\/:*?"<>|]+$/;
    if (!folderNameRegex.test(folderPath)) return "invalid-name"

    const folderFound = addTrailingSlash(path.join(__dirname, `../../../storage/${userID}/files/${folderPath}`)); // Get the route
    // Get the information about that folder path
    const stats = fs.statSync(folderFound);

    if (stats.isDirectory()) { // Check if the folder exists
        return "folder-exists"
    } else {
        mkdirp(folderFound)
    }

    return "done"
}

const upload = (userID: string, filePath: string): "done" | "file-exists" | "invalid-name" | "too-big" => {
    return "done"
}

const deleteFileOrFolder = (userID: string, filePath: string): "done" | "no-file" => {
    // Ensure the file is there
    const fileFound = addTrailingSlash(path.join(__dirname, `../../../storage/${userID}/files/${filePath}`))
    const stats = fs.statSync(fileFound);

    if (stats.isFile()) {
        fs.moveSync(fileFound, `../../../storage/${userID}/bin/`)
        return "done"
    } else {
        return "no-file"
    }
}

const permanentDeleteFileOrFolder = (userID: string, filePath: string): "done" | "no-file" => {
    // Ensure the file is there
    const fileFound = addTrailingSlash(path.join(__dirname, `../../../storage/${userID}/files/${filePath}`))
    const stats = fs.statSync(fileFound);

    if (stats.isFile()) {
        fs.unlinkSync(fileFound);
        return "done"
    } else {
        return "no-file"
    }
}

const renameFileOrFolder = () => { }

const shareFileOrFolder = () => { }

export { getFile, getFolderContents, createFolder, upload, deleteFileOrFolder, permanentDeleteFileOrFolder, renameFileOrFolder, shareFileOrFolder } 