const express = require('express');
const router = new express.Router();

const banner = require('../controller/banner');

router.get('/create', banner.createForm);
router.post('/create', banner.create);
router.get('/list', banner.list);
router.get('/data-table', banner.dataTable);
router.get('/edit/:id', banner.editForm);
router.post('/edit', banner.edit);
router.get('/delete/:id', banner.delete);

module.exports = router;