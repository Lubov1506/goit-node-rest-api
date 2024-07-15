import { Router } from "express";
import userController from "../controllers/userControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validation/userSchemas.js";
import { validateAuthBody } from "../middlewares/validateAuthBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const userRouter = Router();
userRouter.post(
  "/register",
  isEmptyBody,
  validateAuthBody(userRegisterSchema),
  userController.register
);
userRouter.post(
  "/login",
  isEmptyBody,
  validateAuthBody(userLoginSchema),
  userController.login
);

userRouter.post("/logout", authenticate, userController.logout);
userRouter.get("/current", authenticate, userController.getCurrentUser);

export default userRouter;
