const express = require('express');
const router = new express.Router();

const enquiry = require('../../controller/api/enquiry');

router.post('/create', enquiry.create);


module.exports = router;