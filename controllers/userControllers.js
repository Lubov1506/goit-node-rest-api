import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../utils/HttpError.js";
import * as userServices from "../services/userServices.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });
  console.log(email, user);
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
  const token = "111-222-333";
  res.json({
    token,
  });
};
export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
