import Contact from "../db/models/Contact.js";

export const getContacts = () => {
  return Contact.find();
};
export const getContactById = (_id) => Contact.findOne(_id);
export const addContact = (data) => {
  return Contact.create(data);
};
export const updateContact = (filter, data) =>
  Contact.findByIdAndUpdate(filter, data);

export const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body);
};
export const removeContact = (id) => {
  return Contact.findByIdAndDelete(id);
};
