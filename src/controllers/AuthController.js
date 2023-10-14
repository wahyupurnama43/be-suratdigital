const jwt = require('jsonwebtoken');

const { jwtAudience, jwtIssuer, jwtSecret } = require('../configs/env');
const { prisma } = require('../configs/database');

async function handleAttempt(req, res) {
  try {
    let refreshToken;

    if (req.user.refreshToken) {
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
    }

    const accessToken = jwt.sign({ uuid: req.user.uuid, username: req.user.username }, jwtSecret, {
      audience: jwtAudience,
      issuer: jwtIssuer,
      subject: req.user.uuid,
      expiresIn: '1h',
    });

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

function handleRevoke(req, res) {
  const { accessToken, refreshToken } = req.body;

  return res.send({
    message: 'Revoke accessed',
  });
}

function handleRotate(req, res) {
  const { accessToken, refreshToken } = req.body;

  return res.send({
    message: 'Rotate accessed',
  });
}

module.exports = {
  handleAttempt,
  handleRevoke,
  handleRotate,
};
