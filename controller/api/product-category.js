const data = {};
const pool = require('../../config/database');


/**
 * Process the listing category 
 */
data.list = async function (req, res) {
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

module.exports = data;