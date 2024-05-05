import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";
import { createContactSchema, updateContactSchema, patchContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      throw HttpError(404);
    }

    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const removedContact = await Contact.findByIdAndDelete(id);

    if (!removedContact) {
      throw HttpError(404);
    }

    return res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const newContact = await Contact.create(req.body);
    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const { error } = updateContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const patchContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!Object.keys(req.body).includes('favorite')) {
      throw HttpError(400, "Body must have a 'favorite' field");
    }

    const { error } = patchContactSchema.validate(req.body);
    

    if (error) {
      throw HttpError(400, error.message);
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};