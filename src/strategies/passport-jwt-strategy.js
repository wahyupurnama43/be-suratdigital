const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');

const { jwtAudience, jwtIssuer, jwtSecret } = require('../configs/env');
const { prisma } = require('../configs/database');

const strategy = new JWTStrategy(
  {
    audience: jwtAudience,
    issuer: jwtIssuer,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  },
  function (payload, done) {
    prisma.user
      .findFirst({ where: { username: payload.username } })
      .then((user) => done(null, user ?? false))
      .catch((err) => done(err ?? null, false));
  }
);

module.exports = strategy;
