import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../utils/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";
import { createContactSchema } from "../validation/contactsSchemas.js";

const getAllContacts = async (req, res, next) => {
  const contacts = await contactsServices.getContacts();
  res.json({
    status: 200,
    message: "Contacts get successfully",
    contacts,
  });
};

const getOneContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const contact = await contactsServices.getContactById({ _id });
  if (!contact) {
    throw HttpError(404, `Const with id ${_id} not found`);
  }
  res.status(200).json({
    status: 201,
    message: `Contact got successfully`,
    contact,
  });
};

const deleteContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const removedContact = await contactsServices.removeContact({ _id });
  if (!removedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    status: 201,
    message: `Contact deleted successfully`,
    removedContact,
  });
};

const createContact = async (req, res, next) => {
  const data = await contactsServices.addContact(req.body);
  res.status(201).json({
    status: 201,
    message: `Contact create successfully`,
    data,
  });
};

const updateContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const updatedContact = await contactsServices.updateContact(
    { _id },
    req.body
  );
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    status: 201,
    message: `Contact was updated successfully`,
    updatedContact,
  });
};
const updateStatusContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const updatedContact = await contactsServices.updateStatusContact(
    { _id },
    req.body
  );
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    status: 201,
    message: `Contact-status was updated successfully`,
    updatedContact,
  });
};
export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
