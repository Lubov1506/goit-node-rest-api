import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contactsSchemas.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../decorators/validateBody.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();
contactsRouter.use(authenticate);
contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);
contactsRouter.patch(
  "/:id/favorite",
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateStatusContact
);

export default contactsRouter;
