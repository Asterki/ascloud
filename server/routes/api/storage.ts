import express from 'express'
import path from 'path'
import { z } from "zod"
import fs, { stat } from 'fs'

import { User } from '../../../shared/types/models';

const router: express.Router = express.Router();

const addTrailingSlash = (filePath: string): string => {
    const normalizedPath = path.normalize(filePath);
  
    if (!normalizedPath.endsWith(path.sep)) {
      return normalizedPath + path.sep;
    }
  
    return normalizedPath;
  }

router.get("/file/", (req, res) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.redirect("/")

    try {
        const parsedQuery = z
            .object({
                filePath: z.string(),
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.redirect("/")

        const filePath = addTrailingSlash(path.join(__dirname, `../../../storage/${(req.user as User).userID}/files/${parsedQuery.data.filePath}`))

        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            res.sendFile(filePath)
        } else {
            res.send("no-file")
        }
    } catch (error: unknown) {
        res.send("server-error")
    }
})

router.post("/get-folder-contents", (req, res) => {
    if (!req.isAuthenticated() || req.user == undefined) return res.status(403).send("unauthorized");

    try {
        const parsedQuery = z
            .object({
                folderPath: z.string(),
            })
            .required()
            .safeParse(req.query);

        if (!parsedQuery.success && 'error' in parsedQuery) return res.redirect("/")
        const folderPath = addTrailingSlash(path.join(__dirname, `../../../storage/${(req.user as User).userID}/files/${parsedQuery.data.folderPath}`));

        const stats = fs.statSync(folderPath);
        const results: Array<{ isDirectory: boolean, fileName: string, fileSize: number }> = []

        if (stats.isDirectory()) {
            fs.readdirSync(folderPath).forEach(file => {
                const fileStat = fs.statSync(`${folderPath}${file}`)
                results.push({ fileName: file, fileSize: fileStat.size, isDirectory: fileStat.isDirectory() })
            });
        } else {
            res.send("no-folder")
        }

        res.send(results)
    } catch (err: unknown) {
        res.status(500).send("server-error")
    }
})

module.exports = router;