const data = {};
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const joi = require('joi');

/**
 * Show the login form
 */
data.loginForm = async function (req, res) {
    return res.render('pages/login');
}

/**
 * Process the login form
 */
data.login = async function (req, res) {
    const schema = joi.object().keys({
        username: joi.string().min(5).max(50).required(),
        password: joi.string().required()
    });
    delete req.body.insert;
    var validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        req.flash('errors', validation.error.details[0].message);
        return res.redirect('/');
    }
    const username = req.body.username;
    let userExist = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userExist[0].length == 0) {
        req.flash('errors', 'Username not found');
        return res.redirect('/');
    }
    const validPassword = await bcrypt.compare(req.body.password, userExist[0][0].password);
    if (!validPassword) {
        req.flash('errors', 'Password is not match with Username');
        return res.redirect('/');
    }
    res.cookie(process.env.KEY, { authId: userExist[0][0].id.toString() }, { maxAge: 24 * 60 * 60 * 1000 });
    return res.redirect('/dashboard/index');
}

/**
 * Show the signup form
 */
data.signupForm = async function (req, res) {
    res.render('pages/signup');
}

/**
 * Process the signup form
 */
data.signup = async function (req, res) {
    const schema = joi.object().keys({
        username: joi.string().min(5).max(50).required(),
        email: joi.string().min(5).max(50).required().email(),
        password: joi.string().required()
    });
    delete req.body.insert;
    var validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        req.flash('errors', validation.error.details[0].message);
        return res.redirect('/signup');
    }
    const username = req.body.username;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const emailExist = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (emailExist[0].length > 0) {
        req.flash('errors', 'Email is already exist');
        return res.redirect('/signup');
    }
    const usernameExist = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (usernameExist[0].length > 0) {
        req.flash('errors', 'Username is already exist');
        return res.redirect('/signup');
    }
    let result = await pool.query('INSERT INTO users SET username = ?, email = ?, password = ?', [username, email, password]);
    insertId = String(result[0].insertId);
    req.flash('success', 'Registration successfully');
    return res.redirect('/signup');
}

/**
 * Process the logout
 */
data.logout = async function (req, res) {
    res.clearCookie(process.env.KEY, { path: '/' });
    req.flash('success', 'Logout successfully');
    return res.redirect('/');
}

module.exports = data;