import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
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
  const { refreshToken, sessionId } = req.cookies;
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: sessionId });
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
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
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');
    return res.status(204).send();

    // throw createHttpError(401, 'Session not found');
  }
  await Session.deleteOne({ _id: sessionId });
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');

  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: 'If this email exists, a reset link has been sent',
    });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const templatePath = path.resolve('src/templates/reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.status(200).json({
    message: 'If this email exists, a reset link has been sent',
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }
  const user = await User.findOne({ _id: payload.sub, email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });
  await Session.deleteMany({ userId: user._id });
  res.status(200).json({
    message: 'Password reset successfully',
  });
};
