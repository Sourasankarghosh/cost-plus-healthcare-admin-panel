const express = require('express');
const router = new express.Router();

const category = require('../controller/category');

router.get('/create',category.createForm);
router.post('/create',category.create);
router.get('/list',category.list);
router.get('/data-table',category.dataTable);
router.get('/edit/:id',category.editForm);
router.post('/edit',category.edit);
router.get('/delete/:id',category.delete);

module.exports = router;