const jwt = require('jsonwebtoken');

const { jwtAudience, jwtIssuer, jwtSecret } = require('../configs/env');
const { prisma } = require('../configs/database');

function generateAccessToken(payload) {
  return jwt.sign(payload, jwtSecret, {
    audience: jwtAudience,
    issuer: jwtIssuer,
    subject: payload.uuid,
    expiresIn: '1h',
  });
}

async function handleAttempt(req, res) {
  try {
    let refreshToken;

    try {
      jwt.verify(req.user.refreshToken, jwtSecret);
      refreshToken = req.user.refreshToken;
    } catch (err) {
      refreshToken = jwt.sign({ uuid: req.user.uuid }, jwtSecret, {
        subject: req.user.uuid,
        expiresIn: '1d',
      });

      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken },
      });
    }

    const accessToken = generateAccessToken({ uuid: req.user.uuid, username: req.user.username });

    return res.send({
      data: { accessToken, refreshToken },
      error: [],
      message: 'Login successful',
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      data: null,
      error: [{ code: 500, message: err.message }],
      message: 'Something went wrong',
      success: false,
    });
  }
}

async function handleRevoke(req, res) {
  try {
    if (!req.user.refreshToken) {
      return res.status(401).send({
        error: [{ code: 401, message: "You're not authorized" }],
        message: "You're not authorized",
      });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });

    return res.send({
      error: [],
      message: "You've been logged out successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      error: [{ code: 500, message: err.message }],
      message: 'Something went wrong',
      success: false,
    });
  }
}

function handleRotate(req, res) {
  try {
    jwt.verify(req.user.refreshToken, jwtSecret);
  } catch (err) {
    return res.status(400).send({
      error: [{ code: 400, message: 'Invalid refresh token, please re-login' }],
      message: 'Invalid refresh token',
    });
  }

  const newAccessToken = generateAccessToken({
    uuid: req.user.uuid,
    username: req.user.username,
  });

  return res.send({
    data: {
      accessToken: newAccessToken,
      refreshToken: req.user.refreshToken,
    },
    error: [],
    message: 'Token successfully being rotated',
    success: true,
  });
}

module.exports = {
  handleAttempt,
  handleRevoke,
  handleRotate,
};
