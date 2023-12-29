const data = {};
const pool = require('../../config/database');


/**
 * Process the listing category 
 */
data.categoryList = async function (req, res) {
    let categoryList = await pool.query('SELECT * FROM category WHERE is_deleted = 0');
    categoryList = categoryList[0];
    if (categoryList.length > 0) {
        return res.status(200).send(
            {
                status: true,
                msg: 'Category found',
                categoryList: categoryList
            }
        );
    } else {
        return res.status(200).send(
            {
                status: true,
                msg: 'Category not found',
            }
        );
    }
}


/**
 * Process of product listing based on category 
 */
data.productList = async function (req, res) {
    const category_id = req.params.category_id;
    let productList = await pool.query('SELECT * FROM product WHERE is_deleted = 0 AND category_id = ?', [category_id]);
    productList = productList[0];
    if (productList.length > 0) {
        return res.status(200).send(
            {
                status: true,
                msg: 'Product found',
                productList: productList
            }
        );
    } else {
        return res.status(200).send(
            {
                status: true,
                msg: 'Product not found',
            }
        );
    }
}

data.productDetails = async function (req, res) {
    const id = req.params.id;
    let product = await pool.query('SELECT * FROM product WHERE id = ?', [id]);
    product = product[0][0];
    return res.status(200).send(
        {
            product: product,
            status: true,
            msg: 'Product found',
        }
    );
}

module.exports = data;