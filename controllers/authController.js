/* eslint-disable prefer-destructuring */
const bcrypt = require('bcryptjs');
const passport = require('passport');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                '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',
        },
    })
);
const querystring = require('querystring');

const User = require('../models/User');

// exports.getReset = (req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render('reset', {
//         path: '/reset',
//         pageTitle: 'Reset Password',
//         errorMessage: message,
//     });
// };

// exports.postReset = (req, res, next) => {
//     crypto.randomBytes(32, (err, buffer) => {
//         if (err) {
//             console.log(err);
//             return res.redirect('/reset');
//         }
//         const token = buffer.toString('hex');
//         User.findOne({ email: req.body.email })
//             .then((user) => {
//                 if (!user) {
//                     req.flash('error', 'No account with that email found.');
//                     return res.redirect('/reset');
//                 }
//                 user.resetToken = token;
//                 user.resetTokenExpiration = Date.now() + 3600000;
//                 return user.save();
//             })
//             .then((result) => {
//                 res.redirect('/');
//                 transporter.sendMail({
//                     to: req.body.email,
//                     from: 'shop@node-complete.com',
//                     subject: 'Password reset',
//                     html: `
//               <p>You requested a password reset</p>
//               <p>Click this <a href="http://localhost:3500/reset/${token}">link</a> to set a new password.</p>
//             `,
//                 });
//             })
//             .catch((err) => {
//                 const error = new Error(err);
//                 error.httpStatusCode = 500;
//                 return next(error);
//             });
//     });
// };

// exports.getLogin = (req, res) => res.render('login');

// exports.postRegister = (req, res) => {
//     const { name, email, password } = req.body;
//     const errors = [];

//     if (!name || !email || !password) {
//         errors.push({ msg: 'Please enter all fields' });
//     }
//     if (errors.length > 0) {
//         res.render('register', {
//             errors,
//             name,
//             email,
//             password,
//             password2: password,
//         });
//     } else {
//         User.findOne({ email }).then((user) => {
//             if (user) {
//                 errors.push({ msg: 'Email already exists' });
//                 res.render('register', {
//                     // destructuring
//                     errors,
//                     name,
//                     email,
//                     password,
//                     password2: password,
//                 });
//             } else {
//                 const newUser = new User({
//                     // destructuring
//                     name,
//                     email,
//                     password,
//                 });

//                 bcrypt.genSalt(10, (err, salt) => {
//                     bcrypt.hash(newUser.password, salt, (err, hash) => {
//                         if (err) throw err;
//                         newUser.password = hash;
//                         newUser
//                             .save()
//                             .then(() => {
//                                 console.log('Registration Successful...');
//                                 req.flash(
//                                     'success_msg',
//                                     'You are now registered and can log in'
//                                 );
//                                 res.redirect('/login');
//                             })
//                             .catch((err) => console.log(err));
//                     });
//                 });
//             }
//         });
//     }
// };
// exports.postLogin = (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/login',
//         failureFlash: true,
//     })(req, res, next);
// };
// exports.logOut = (req, res) => {
//     req.logout();
//     req.flash('success_msg', 'You are logged out');
//     res.redirect('/login');
// };
exports.getLogin = (req, res) => {
    res.redirect('/callback');
};
exports.getCallback = async (req, res, next) => {
    passport.authenticate('auth0', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const { returnTo } = req.session;
            delete req.session.returnTo;
            res.redirect(returnTo || '/');
        });
    })(req, res, next);
};
exports.getLogout = (req, res) => {
    req.logout();
    
    var returnTo = req.protocol + '://' + req.hostname;
    var port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port;
    }
    var logoutURL = new URL(
        util.format('https://%s/v2/logout', process.env.AUTHO_DOMAIN)
        // util.format('https://%s/v2/logout', "dev-nroxgmw9.us.auth0.com")
    );

    
    var searchString = querystring.stringify({
        client_id: process.env.CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;
    
    res.redirect(logoutURL);
};
