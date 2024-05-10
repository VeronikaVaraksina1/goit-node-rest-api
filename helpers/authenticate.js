import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization === "undefined") {
    return next(HttpError(401, "Not authorized"));
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  jwt.verify(token, SECRET_KEY, async (err, decode) => {
    if (err) {
      return next(HttpError(401, "Not authorized"));
    }

    try {
      const user = await User.findById(decode.id);

      if (!user) {
        return next(HttpError(401, "Not authorized"));
      }

      if (user.token !== token) {
        return next(HttpError(401, "Not authorized"));
      }

      req.user = {
        id: decode.id,
        name: decode.name,
      };
      
      next();
    } catch(error) {
      next(error);
    }
  });
};
