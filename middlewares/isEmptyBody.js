import HttpError from "../utils/HttpError.js";
export const isEmptyBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400, "Body can't be empty!"));
  }
  next();
};
