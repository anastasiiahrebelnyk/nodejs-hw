import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const session = await createSession(user._id);
  setSessionCookies(res, session);
  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId } = req.cookies;
  const session = await Session.findOne({ _id: sessionId });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired');
  }
  await Session.deleteOne({ _id: sessionId });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.json({ message: 'Session refreshed' });
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  const session = await Session.findOne({ _id: sessionId });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  await Session.deleteOne({ _id: sessionId });
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');

  res.clearCookie('refreshToken');
  res.status(204).send();
};
