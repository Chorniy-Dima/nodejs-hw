import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../services/auth.js";
import { Session } from "../models/session.js";


export const registerUser = async (req, res) => {

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(401, "Email in use");
  };

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ email, password: hashedPassword });

  const newSession = await createSession(user._id);

  await setSessionCookies(res, newSession);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);

  await setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({_id: sessionId});
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const oldSession = await Session.findOne({
    _id: sessionId,
    refreshToken
  });

  if (!oldSession) {
    throw createHttpError(401, "Session not found");
  };

  const isTokenExpired = new Date(oldSession.refreshTokenValidUntil) < new Date(Date.now());

  if (isTokenExpired) {
    throw createHttpError(401, "Session token expired");
  };

  await Session.deleteOne({ _id: oldSession._id });
  const session = await createSession(oldSession.userId);
  await setSessionCookies(res, session);

  res.status(200).json({message: "Session refreshed"});
};
