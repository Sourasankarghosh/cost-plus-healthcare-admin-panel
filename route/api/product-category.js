const express = require('express');
const router = new express.Router();

const productCategory = require('../../controller/api/product-category');

router.get('/category-list', productCategory.categoryList);
router.get('/product-list/:category_id', productCategory.productList);
router.get('/product-details/:id', productCategory.productDetails);


module.exports = router;