import express from "express";

import { getAllContacts, getOneContact, deleteContact, createContact, updateContact, updateFavorite } from "../controllers/contactsControllers.js";
import { createContactSchema, updateContactSchema, patchContactSchema } from "../schemas/contactsSchemas.js";

import { validateBody } from "../helpers/validateBody.js";
import { isValidId } from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), isValidId, updateContact);

contactsRouter.patch("/:id/favorite", validateBody(patchContactSchema), isValidId, updateFavorite);

export default contactsRouter;
