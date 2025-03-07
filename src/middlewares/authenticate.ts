import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    const error = createHttpError(401, "Unauthorized");
    return next(error);
  }

  const jwtToken = token.split(" ")[1];
  if (!jwtToken) {
    const error = createHttpError(401, "Unauthorized");
    return next(error);
  }
  const decoded = verify(jwtToken, config.jwtSecret as string);
  console.log("Authenticating", decoded);
  //   req.userId = decoded.sub;
  next();
};

export default authenticate;
