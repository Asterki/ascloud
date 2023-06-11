import express from 'express'
import { z } from "zod"

import { getFile, getFolderContents } from '../../services/storage'

import { User } from '../../../shared/types/models';

const router: express.Router = express.Router();

router.get("/file/", (req, res) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.redirect("/")

    try {
        // Ensure the route is there
        const parsedQuery = z
            .object({
                folderPath: z.string(),
                fileName: z.string()
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.redirect("/")

        const filePath = getFile((req.user as User).userID, parsedQuery.data.folderPath, parsedQuery.data.fileName)
        if (filePath == "no-file") return res.send(filePath)
        else return res.sendFile(filePath)
    } catch (error: unknown) {
        console.log(error);
        
        res.send("server-error")
    }
})

router.post("/get-folder-contents", (req, res) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        // Ensure the route is there
        const parsedQuery = z
            .object({
                folderPath: z.string(),
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.redirect("/")

        const results = getFolderContents((req.user as User).userID, parsedQuery.data.folderPath)
        res.send(results)
    } catch (err: unknown) {
        res.status(500).send("server-error")
    }
})

router.post("/create-folder", (req, res) => {

})

router.post("/upload", (req, res) => {

})

router.post("/delete", (req, res) => {

})

router.post("/permanent-delete", (req, res) => {

})

router.post("/rename", (req, res) => {

})

router.post("/share", (req, res) => {

})

module.exports = router;