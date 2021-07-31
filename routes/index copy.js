const express = require('express');

const router = express.Router();
const passport = require('passport');
const { secured } = require('../middlewares/secured');

const { ensureAuthenticated } = require('../config/auth');
const { forwardAuthenticated } = require('../config/auth');
const authController = require('../controllers/authController');
const indexController = require('../controllers/indexController');

const Ticket = require('../models/Ticket');

// router.get('/reset', authController.getReset);
// router.post('/reset', authController.postReset);
// router.get('/login', forwardAuthenticated, authController.getLogin);
// router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
// router.post('/register', authController.postRegister);
// router.post('/login', authController.postLogin);

// router.get('/logout', authController.logOut);

/// ///////Suppor / Dev ticket Routes below

/// /////////Deviation Ticket

module.exports = router;
