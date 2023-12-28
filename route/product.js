const express = require('express');
const router = new express.Router();

const product = require('../controller/product');

router.get('/create/:category_id',product.createForm);
router.post('/create',product.create);
router.get('/list/:category_id',product.list);
router.get('/data-table/:category_id',product.dataTable);
router.get('/edit/:id',product.editForm);
router.post('/edit',product.edit);
router.get('/delete/:id',product.delete);

module.exports = router;