import bcrypt from "bcrypt";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({email});

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: passwordHash,
    }

    await User.create(newUser);

    return res.status(201).json({ user: {email} })

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({email});

    if (user === null) {
      console.log("Email");
      throw HttpError(401, "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res.status(401).json({ message: "Email or password is incorrect" });
    }

    res.send({token: "Token"})

  } catch (error) {
    next(error);
  }
}