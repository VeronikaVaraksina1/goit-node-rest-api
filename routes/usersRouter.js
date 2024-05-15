import express from "express";

import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/usersSchemas.js";
import { login, register, logout, currentUser, updateAvatar, getAvatar } from "../controllers/usersControllers.js";
import { authenticate } from "../helpers/authenticate.js";
import { update } from "../helpers/upload.js";
const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerUserSchema), register);
usersRouter.post("/login", validateBody(loginUserSchema), login);
usersRouter.get("/logout", authenticate, logout);
usersRouter.get("/current", authenticate, currentUser);
usersRouter.patch("/avatar", authenticate, update.single("avatar"), updateAvatar);
usersRouter.get("/avatar", authenticate, update.single("avatar"), getAvatar);

export default usersRouter;