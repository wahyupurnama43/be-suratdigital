const { Strategy: LocalStrategy } = require('passport-local');
const { compare } = require('bcryptjs');

const { prisma } = require('../configs/database');

const strategy = new LocalStrategy(function (username, password, done) {
  prisma.user
    .findFirst({ where: { username } })
    .then((user) => {
      if (!user) return done(null, false);

      compare(password, user.password)
        .then((isMatched) => done(null, isMatched ? user : false))
        .catch((err) => done(err ?? null, false));
    })
    .catch((err) => done(err ?? null, false));
});

module.exports = strategy;
