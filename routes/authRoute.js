const express = require('express');
const passport = require('passport');
const {
    getLogin,
    getCallback,
    getLogout,
} = require('../controllers/authController');

const router = express.Router();

router.get(
    '/login',
    passport.authenticate('auth0', {
        scope: 'openid email profile',
    }),
    getLogin
);
router.get('/callback', getCallback);
router.get('/logout', getLogout);

module.exports = router;
