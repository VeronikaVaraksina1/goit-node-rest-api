import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import gravatar from "gravatar";
import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import path from "path";

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    await User.create({ ...req.body, password: passwordHash, avatarURL });

    return res.status(201).json({ user: {email, subscription: "starter"} })

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });


    if (!user) {
      console.log("Email");
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      console.log("Password");
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user._id, name: user.name };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(201).json({token: token, user: {email, subscription: user.subscription}})

  } catch (error) {
    next(error);
  }
}

export const logout = async (req, res, next) => {
  try { 
    const user = await User.findOneAndUpdate({ _id: req.user.id }, { token: null });

    if (!user) {
      throw HttpError(401, "Not authorized")
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export const currentUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw HttpError(401, "Not authorized")
  }

  res.status(200).json({email: user.email, subscription: user.subscription});
}

export const updateAvatar = async (req, res, next) => {
  try {
    const publicDir = path.resolve("public/avatars", req.file.filename);

    await fs.rename(req.file.path, publicDir);

    const avatar = await Jimp.read(publicDir);
    await avatar.resize(250, 250).writeAsync(publicDir);

    const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: `/avatars/${req.file.filename}` }, { new: true });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (!user.avatarURL) {
      throw HttpError(404, "Avatar not found");
    }

    res.sendFile(path.resolve('public/avatars', user.avatarURL));
  } catch (error) {
    next(error);
  }
}