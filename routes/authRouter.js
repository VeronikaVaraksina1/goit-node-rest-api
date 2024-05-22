import express from "express";

import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/usersSchemas.js";
import { authenticate } from "../helpers/authenticate.js";
import { currentUser, login, logout, register } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.get("/logout", authenticate, logout);
authRouter.get("/current", authenticate, currentUser);

export default authRouter;