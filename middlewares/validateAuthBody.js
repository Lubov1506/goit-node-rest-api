import HttpError from "../utils/HttpError.js";

export const validateAuthBody = schema => {
  const func = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      console.log(err.message);
      next(HttpError(400, "Помилка від Joi або іншої бібліотеки валідації"));
    }
  };

  return func;
};
