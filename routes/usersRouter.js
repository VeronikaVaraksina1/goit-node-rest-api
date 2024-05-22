import express from "express";

import { authenticate } from "../helpers/authenticate.js";
import { update } from "../helpers/upload.js";
import { getAvatar, updateAvatar, verify } from "../controllers/usersControllers.js";


const usersRouter = express.Router();

usersRouter.get("/avatar", authenticate, getAvatar);
usersRouter.patch("/avatar", authenticate, update.single("avatar"), updateAvatar);

usersRouter.get("/verify/:verificationToken", verify);

export default usersRouter;