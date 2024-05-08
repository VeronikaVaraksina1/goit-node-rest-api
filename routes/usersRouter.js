import express from "express";

import { validateBody } from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/usersSchemas.js";
import { login, register } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerUserSchema), register);
usersRouter.post("/login", validateBody(loginUserSchema), login);

export default usersRouter;