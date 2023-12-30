const express = require('express');
const router = new express.Router();

const banner = require('../../controller/api/banner');

router.get('/list', banner.bannerList);


module.exports = router;