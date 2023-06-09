import express from "express";

import { z } from "zod"
import validator from "validator"

import { registerUser } from "../../services/accounts";

const router: express.Router = express.Router();

router.post("/register", async (req: express.Request, res: express.Response) => {
    try {
        // Validate fields
        const parsedBody = z
            .object({
                username: z
                    .string()
                    .min(3)
                    .max(16)
                    .refine((username) => {
                        return validator.isAlphanumeric(username, "en-GB", {
                            ignore: "._",
                        });
                    }),
                email: z.string().refine(validator.isEmail),
                password: z.string().min(6).max(256),
            })
            .required()
            .safeParse(req.body);

        if (!parsedBody.success && 'error' in parsedBody) return res.status(400).send("invalid-parameters");

        // Create the user
        const { email, password, username } = parsedBody.data
        const result = await registerUser(email, username, password)
        if (result == "username-email-in-use") return res.send(result)

        // Login the user
        req.logIn(result, (err: unknown) => {
            if (err) throw err;
            return res.send("done");
        });
    } catch (err: unknown) {
        res.status(500).send("server-error")
    }

})

module.exports = router;