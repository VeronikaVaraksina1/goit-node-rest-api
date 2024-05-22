import fs from "fs/promises";
import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import path from "path";

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

  export const verify = async (req, res, next) => {
    const { verificationToken } = req.params;

    try {
      const user = await User.findOne({ verificationToken });

      if (!user) {
        throw HttpError(404, "User not found");
      }
  
      await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null})
      
      res.status(200).json({message: "Email confirm successfully"});
    } catch (error) {
      next(error);
    }
  }