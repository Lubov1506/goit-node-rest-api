import HttpError from "../utils/HttpError.js";
const validateBody = schema => {
  const func = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      console.log(err.message);
      next(HttpError(400, err.message));
    }
  };

  return func;
};
export default validateBody;
