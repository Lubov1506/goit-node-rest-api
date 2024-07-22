import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../utils/HttpError.js";
import * as userServices from "../services/userServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validSubscriptions } from "../constants/user-constants.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await userServices.register({
    ...req.body,
    password: hashPassword,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await userServices.updateUser({ _id: id }, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const user = await userServices.updateUser({ _id }, { token: "" });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  res.status(204).send();
};
const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};
export const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  if (!validSubscriptions.includes(subscription)) {
    return next(HttpError(400, "Invalid subscription value"));
  }

  try {
    const updatedUser = await userServices.updateUser(
      { _id },
      { subscription }
    );
    if (!updatedUser) {
      throw HttpError(404, "User not found");
    }
    res.status(200).json({
      message: "Subscription updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(HttpError(500, error.message));
  }
};
export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
};
