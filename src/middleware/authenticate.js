import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw createHttpError(401, "Missing access token");
  }

  const session = await Session.findOne({ accessToken });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isExpired = new Date(session.accessTokenValidUntil) < new Date(Date.now());
  if (isExpired) {
    throw createHttpError(401, "Access token expired");
  }

  const user = await User.findOne({ _id: session.userId });
  if (!user) {
    throw createHttpError(401);
  }

  req.user = user;
  next();
};
