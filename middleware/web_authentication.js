module.exports = function (req, res, next) {
    if (req.session.authId && req.cookies[process.env.KEY]) {
        req.session._garbage = Date();
        req.session.touch();
        next();
    } else {
        req.flash('errors', 'You are not authorized');
        return res.redirect('/');
    }
}