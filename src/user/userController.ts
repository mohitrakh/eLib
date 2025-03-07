import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModal from "./userModal";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  let newUser;

  try {
    const user = await UserModal.findOne({ email });

    if (user) {
      const error = createHttpError(400, "Email already exists.");
      return next(error);
    }
    const hashedPass = await bcrypt.hash(password, 10);
    newUser = await UserModal.create({ name, email, password: hashedPass });
  } catch (error) {
    return next(createHttpError(500, "Error while creating a user"));
  }

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ msg: "User created", user: newUser, token });
  } catch (error) {
    return next(createHttpError(500, "Error while generating token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  let user;
  try {
    user = await UserModal.findOne({ email });

    if (!user) {
      const error = createHttpError(404, "User not found");
      return next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = createHttpError(401, "Invalid credentials");
      return next(error);
    }

    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ msg: "User logged in", user: user, token });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while logging user a user"));
  }
};

export { createUser, loginUser };
