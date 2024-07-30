import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../utils/HttpError.js";
import * as userServices from "../services/userServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validSubscriptions } from "../constants/user-constants.js";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "node:path";
import fs from "fs";
import { nanoid } from "nanoid";
import sendEmail from "../utils/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const newUser = await userServices.register({
    ...req.body,
    password: hashPassword,
    avatarURL: gravatar.url(email),
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};
const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await authServices.findUser({ verificationCode });
  if (!user) {
    throw HttpError(400, "User not found or already verify");
  }

  await userServices.updateUser(
    { _id: user._id },
    { verify: true, verificationCode: "" }
  );

  res.json({
    message: "Email verify success",
  });
};
const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email already verify");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email resend success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

const updateSubscription = async (req, res, next) => {
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

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "No file uploaded");
    }

    const { path: oldPath, filename } = req.file;

    if (!oldPath || !filename) {
      throw HttpError(400, "File path or filename is missing");
    }

    const img = await jimp.read(oldPath);
    await img.resize(250, 250);

    const newPath = path.join(avatarsPath, filename);
    await img.writeAsync(newPath);

    const avatar = path.join("avatars", filename);
    const { _id: owner } = req.user;
    const updatedUser = await userServices.updateAvatar({
      filter: owner,
      data: { avatarURL: avatar },
    });

    if (!updatedUser) {
      throw HttpError(404, "User not found");
    }

    res.status(201).json({
      status: 201,
      message: `Avatar updated successfully`,
      updatedUser,
    });
  } catch (error) {
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path);
    }
    next(error);
  }
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
};
