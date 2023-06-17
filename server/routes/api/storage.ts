import express from 'express'
import { z } from "zod"

import { createFolder, getFile, getFolderContents, permanentDeleteFileOrFolder } from '../../services/storage'

import { User } from '../../../shared/types/models';
import { FileRequestBody, FileResponse, GetFolderContentsRequestBody, GetFolderContentsResponse, CreateFolderRequestBody, CreateFolderResponse, PermanentDeleteFileOrFolderRequestBody, PermanentDeleteFileOrFolderResponse } from "../../../shared/types/api/storage"

const router: express.Router = express.Router();

router.post("/file", (req: express.Request<unknown, FileResponse, FileRequestBody>, res: express.Response<FileResponse>) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        // Ensure the route is there
        const parsedQuery = z
            .object({
                folderPath: z.string(),
                fileName: z.string()
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.status(400).send("invalid-parameters");

        const filePath = getFile((req.user as User).userID, parsedQuery.data.folderPath, parsedQuery.data.fileName)
        if (filePath == "no-file") return res.send(filePath)
        else return res.sendFile(filePath)
    } catch (error: unknown) {
        res.status(500).send("server-error")
    }
})

router.post("/get-folder-contents", (req: express.Request<unknown, GetFolderContentsResponse, GetFolderContentsRequestBody>, res: express.Response<GetFolderContentsResponse>) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        // Ensure the route is there
        const parsedQuery = z
            .object({
                folderPath: z.string(),
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.status(400).send("invalid-parameters");

        const results = getFolderContents((req.user as User).userID, parsedQuery.data.folderPath)
        res.send(results)
    } catch (err: unknown) {
        res.status(500).send("server-error")
    }
})

router.post("/create-folder", (req: express.Request<unknown, CreateFolderResponse, CreateFolderRequestBody>, res: express.Response<CreateFolderResponse>) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        // Ensure the route is there
        const parsedQuery = z
            .object({
                folderPath: z.string(),
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.status(400).send("invalid-parameters");

        const results = createFolder((req.user as User).userID, parsedQuery.data.folderPath)
        res.send(results)
    } catch (err: unknown) {
        res.status(500).send("server-error")
    }
})

router.post("/upload", (req, res) => {

})

router.post("/delete", (req, res) => {

})

router.post("/permanent-delete", (req: express.Request<unknown, PermanentDeleteFileOrFolderResponse, PermanentDeleteFileOrFolderRequestBody>, res: express.Response<PermanentDeleteFileOrFolderResponse>) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        // Ensure the route is there
        const parsedQuery = z
            .object({
                filePath: z.string(),
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.status(400).send("invalid-parameters");

        const results = permanentDeleteFileOrFolder((req.user as User).userID, parsedQuery.data.filePath)
        res.send(results)
    } catch (err: unknown) {
        res.status(500).send("server-error")
    }
})

router.post("/rename", (req, res) => {

})

router.post("/share", (req, res) => {

})

module.exports = router;