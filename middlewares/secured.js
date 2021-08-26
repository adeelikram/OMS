module.exports.secured = async (req, res, next) => {
    if (req.user) {
        // console.log('In MongoDB',test);
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
};

