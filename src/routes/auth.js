const passport = require('passport');
const router = require('express').Router();

const { urlClient } = require('../configs/env');

const controller = require('../controllers/AuthController');
const redirectIfAuthenticated = require('../middlewares/redirect-if-authenticated');

router.post(
  '/attempt',
  passport.authenticate('local', { failureRedirect: `${urlClient.trim()}/login`, session: false }),
  redirectIfAuthenticated,
  controller.handleAttempt
);

router.post('/revoke', passport.authenticate('jwt', { session: false }), controller.handleRevoke);
router.post('/rotate', passport.authenticate('jwt', { session: false }), controller.handleRotate);

module.exports = router;
