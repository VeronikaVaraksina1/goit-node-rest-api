import express from "express";

import { authenticate } from "../helpers/authenticate.js";
import { update } from "../helpers/upload.js";
import { getAvatar, resendVerificationEmail, updateAvatar, verify } from "../controllers/usersControllers.js";
import { validateBody } from "../helpers/validateBody.js";
import { verifyUserSchema } from "../schemas/usersSchemas.js";


const usersRouter = express.Router();

usersRouter.get("/avatar", authenticate, getAvatar);
usersRouter.patch("/avatar", authenticate, update.single("avatar"), updateAvatar);

usersRouter.get("/verify/:verificationToken", verify);
usersRouter.post("/verify", validateBody(verifyUserSchema), resendVerificationEmail);

export default usersRouter;