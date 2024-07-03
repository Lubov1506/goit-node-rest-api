import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";

const getAllContacts = async (req, res, next) => {
  const contacts = await contactsServices.listContacts();
  res.json({
    status: 200,
    message: "Contacts get successfully",
    contacts,
  });
};

const getOneContact = async (req, res, next) => {
  const contact = await contactsServices.getContactById(req.params.id);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
};

const deleteContact = async (req, res, next) => {
  const removedContact = await contactsServices.removeContact(req.params.id);
  if (!removedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(removedContact);
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsServices.addContact(name, email, phone);
  res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const updatedContact = await contactsServices.updateContact(id, req.body);
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(updatedContact);
};
export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
