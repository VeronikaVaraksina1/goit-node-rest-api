import fs from "fs/promises";
import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import path from "path";
import { sendMail } from "../helpers/verifyEmail.js";
import { nanoid } from "nanoid";

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
      const user = await User.findOneAndUpdate({ verificationToken }, { verify: true, verificationToken: null })

      if (!user) {
        throw HttpError(404, "User not found");
      }
      
      res.status(200).json({message: "Verification successful"});
    } catch (error) {
      next(error);
    }
  }

  export const resendVerificationEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
      const verificationToken = nanoid(); 
        
      const user = await User.findOneAndUpdate({ email }, { verificationToken }, {new: true });
  
      if (user.verify) {
        return next(HttpError(400, "Verification has already been passed"));
      }
  
      await sendMail({
        to: email,
        from: process.env.EMAIL_SENDER,
        subject: "Re-verification in Contact Kingdom",
        html: `<h2 style="color: blue">Your re-verification <a href="http://localhost:3000/users/verify/${verificationToken}">link</a></h2>`,
        text: `Your re-verification link: http://localhost:3000/users/verify/${verificationToken}`,
      })
  
      res.status(201).json({ message: "Verification email sent" })
    } catch (error) {
      next(error)
    }
  }