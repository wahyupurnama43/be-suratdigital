const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');

const localStrategy = require('./strategies/passport-local-strategy');
const jwtStrategy = require('./strategies/passport-jwt-strategy');
const router = require('./routes');

const { appPort, appVersion } = require('./configs/env');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors({ origin: ['*'] }));
app.use(helmet());
app.use(morgan('dev'));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(`/api/${appVersion}`, router);

app.listen(appPort, () => {
  console.log(`Server listening on port ${appPort}`);
});
