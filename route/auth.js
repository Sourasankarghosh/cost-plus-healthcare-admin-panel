const express = require('express');
const router = new express.Router();

const auth = require('../controller/auth');

router.get('/',auth.loginForm);
router.post('/',auth.login);
router.get('/signup',auth.signupForm);
router.post('/signup',auth.signup);
router.get('/logout',auth.logout);

module.exports = router;