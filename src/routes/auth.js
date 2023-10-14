const passport = require('passport');
const router = require('express').Router();

const { urlClient } = require('../configs/env');

const { handleAttempt, handleRevoke, handleRotate } = require('../controllers/AuthController');
const abortIfAuthenticated = require('../middlewares/abort-if-authenticated');

router.post(
  '/attempt',
  passport.authenticate('local', { failureRedirect: `${urlClient.trim()}/login`, session: false }),
  abortIfAuthenticated,
  handleAttempt
);

router.get('/revoke', passport.authenticate('jwt', { session: false }), handleRevoke);
router.get('/rotate', passport.authenticate('jwt', { session: false }), handleRotate);

module.exports = router;
