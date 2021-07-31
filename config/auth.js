module.exports = {
    ensureAuthenticated(req, res, next) {
        // req.isAuthenticated attached to passport
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to continue...');
        res.redirect('/login');
    },
    forwardAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
};
