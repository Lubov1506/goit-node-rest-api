import { Router } from "express";
import userController from "../controllers/userControllers.js";
import validateBody from "../decorators/validateBody.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validation/userSchemas.js";

const userRouter = Router();
userRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userRegisterSchema),
  userController.register
);
userRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userLoginSchema),
  userController.login
);
export default userRouter;
