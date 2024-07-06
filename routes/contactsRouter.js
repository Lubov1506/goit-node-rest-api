import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contactsSchemas.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../decorators/validateBody.js";
createContactSchema;
const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);
contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateContactSchema),
  contactsControllers.updateStatusContact
);

export default contactsRouter;
