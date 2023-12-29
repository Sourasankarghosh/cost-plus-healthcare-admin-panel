const pool = require('../config/database');

module.exports = async function (req, res, next) {
    try {
        if (req.cookies[process.env.KEY] && req.cookies[process.env.KEY].authId) {
            const isuserExist = await pool.query('SELECT * FROM users WHERE id = ?', [parseInt(req.cookies[process.env.KEY].authId)]);
            if (isuserExist) {
                next();
            } else {
                req.flash('errors', 'You are not authorized');
                return res.redirect('/');
            }
        } else {
            req.flash('errors', 'You are not authorized');
            return res.redirect('/');
        }
    } catch (e) {
        req.flash('errors', 'You are not authorized');
        return res.redirect('/');
    }

}