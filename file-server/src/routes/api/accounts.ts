import express from "express";

import * as accountsService from "../../services/accounts";

const router: express.Router = express.Router();

// TFA Related
router.post("/create-user-folder", async (req: express.Request, res: express.Response) => {
	console.log(req.isAuthenticated());
});

module.exports = router;
