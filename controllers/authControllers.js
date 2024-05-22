import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

import HttpError from "../helpers/HttpError.js";
import { sendMail } from "../helpers/verifyEmail.js";
import { User } from "../models/user.js";

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
    
    const verificationToken = crypto.randomUUID();

    await User.create({ 
      ...req.body, 
      password: passwordHash, 
      avatarURL, 
      verificationToken, 
    });

    sendMail({
      to: email,
      from: "plaguemoon@gmail.com",
      subject: "Welcome to Contact Kingdom!",
      html: `Confirm your email address by following the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `Confirm your email address by open the link: http://localhost:3000/api/users/verify/${verificationToken}`,
    })

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

    if (!user.verify) {
      throw HttpError(401, "Please, verify your email");
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
