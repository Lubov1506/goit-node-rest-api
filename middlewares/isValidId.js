import { isValidObjectId } from "mongoose";
import HttpError from "../utils/HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} can't be an id`));
  }
  next();
};
export default isValidId;
