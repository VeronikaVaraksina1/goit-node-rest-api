import express from "express";

import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/usersSchemas.js";
import { login, register, logout, currentUser } from "../controllers/usersControllers.js";
import { authenticate } from "../helpers/authenticate.js";
const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerUserSchema), register);
usersRouter.post("/login", validateBody(loginUserSchema), login);
usersRouter.get("/logout", authenticate, logout);
usersRouter.get("/current", authenticate, currentUser);

export default usersRouter;