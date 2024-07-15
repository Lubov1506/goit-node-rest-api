import Contact from "../db/models/Contact.js";

export const getContacts = async (query = {}) => {
  const { filter = {}, fields = {}, settings = {} } = query;
  const { page, limit } = settings;
  const skip = (page - 1) * limit;
  const data = await Contact.find(filter, fields, { skip, limit });
  const total = await Contact.countDocuments(filter);

  return {
    data,
    total,
  };
};
export const getContactById = filter => Contact.findOne(filter);

export const addContact = data => {
  return Contact.create(data);
};
export const updateContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body);
};
export const removeContact = filter => {
  return Contact.findByIdAndDelete(filter);
};
