import HttpError from "../utils/HttpError.js";
import jwt from "jsonwebtoken";
import { findUser } from "../services/userServices.js";
import "dotenv/config";
const { JWT_SECRET } = process.env;
console.log(JWT_SECRET);

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return next(HttpError(401, "Authorization header not found"));
  }
  console.log(authorization);
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await findUser({ _id: id });
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};
