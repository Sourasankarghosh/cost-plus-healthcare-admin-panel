const express = require('express');
const router = new express.Router();

const dasboard = require('../controller/dashboard');

router.get('/index',dasboard.index);
router.get('/enquiry-data-table',dasboard.enquiryDataTable);

module.exports = router;