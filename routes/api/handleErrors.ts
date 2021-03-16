import { validationResult } from "express-validator";

const handleErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().map((e) => {
      res.status(400).send(e);
    });
    return true;
  }
  return false;
};

export default handleErrors;
