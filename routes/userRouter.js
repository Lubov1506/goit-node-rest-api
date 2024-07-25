import { Router } from "express";
import userController from "../controllers/userControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validation/userSchemas.js";
import { validateAuthBody } from "../middlewares/validateAuthBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

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
userRouter.patch(
  "/",
  authenticate,
  isEmptyBody,
  userController.updateSubscription
);
userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  userController.updateAvatar
);
export default userRouter;
