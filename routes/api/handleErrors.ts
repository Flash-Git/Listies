import { Response } from "express";
import { validationResult } from "express-validator";
import { Request } from "express-validator/src/base";

const handleErrors = (req: Request, res: Response) => {
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
