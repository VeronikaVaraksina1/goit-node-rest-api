import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const contact = await Contact.findOne({_id: id, owner: req.user.id});
    
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
    const contact = await Contact.findOne({_id: id, owner: req.user.id});

    if (!contact) {
      throw HttpError(404);
    }

    const removedContact = await Contact.findByIdAndDelete(id);

    return res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = {...req.body, owner: req.user.id};

  try {
    const newContact = await Contact.create(contact);

    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const contact = await Contact.findOne({_id: id, owner: req.user.id});

    if (!contact) {
      throw HttpError(404);
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

export const updateFavorite = async (req, res, next) => {
  const { id } = req.params;

  try {    
    const contact = await Contact.findOne({_id: id, owner: req.user.id});

    if (!contact) {
      throw HttpError(404);
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