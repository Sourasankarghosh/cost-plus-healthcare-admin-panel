const data = {};
const pool = require('../config/database');

/**
 * Create category form
 */
data.createForm = async function (req, res) {
    let sidebar = 'create-category';
    return res.render('pages/category/create', { sidebar: sidebar });
}

/**
 * Process the create category
 */
data.create = async function (req, res) {
    const name = req.body.name;
    const nameExist = await pool.query('SELECT * FROM category WHERE name = ?', [name]);
    if (nameExist[0].length > 0) {
        req.flash('errors', 'Name is already exist');
        return res.redirect('/category/create');
    }
    const created_at = new Date();
    let result = await pool.query('INSERT INTO category SET name = ?, created_at= ?'
        , [name, created_at]);
    insertId = String(result[0].insertId);
    req.flash('success', 'Category successfully create');
    return res.redirect('/category/list');
}

/**
 * Listing category 
 */
data.list = async function (req, res) {
    let sidebar = 'listing-category';
    return res.render('pages/category/list', { sidebar: sidebar });
}

/**
 * Process the listing category 
 */
data.dataTable = async function (req, res) {
    let draw = parseInt(req.body.draw);
    let totalCategories = await pool.query('SELECT COUNT(*) as count FROM category WHERE is_deleted = 0');
    let categoryList = await pool.query('SELECT * FROM category WHERE is_deleted = 0');
    categoryList = categoryList[0];
    let result = [];
    if (categoryList.length > 0) {
        categoryList.forEach(function (data) {
            let value = [];
            value.push(data.name);
            let action = "<a href='/category/edit/" + data.id + "' class='btn btn-warning btn-xs'><i class='fa fa-fw fa-edit'></i></a> &nbsp;";
            action += "<a href='javascript:deleteCategory(" + data.id + ")' class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></a> &nbsp;";
            action += "<a href='/product/list/" + data.id + "' class='btn btn-info btn-xs'><i class='fa fa-fw fa-list'></i>Go to Product Listing</a>";
            value.push(action);
            result.push(value);
        })
    }
    const output = {
        draw: draw,
        recordsTotal: totalCategories[0][0]['count'],
        recordsFiltered: totalCategories[0][0]['count'],
        data: result
    };
    res.send(output);
}

/**
 * Edit category form
 */
data.editForm = async function (req, res) {
    const id = req.params.id;
    let category = await pool.query('SELECT * FROM category WHERE id = ?', [id]);
    return res.render('pages/category/edit', { sidebar: 'category', category: category[0] });
}

/**
 * Process the edit category
 */
data.edit = async function (req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const nameExist = await pool.query('SELECT * FROM category WHERE name = ? AND id != ?', [name, id]);
    if (nameExist[0].length > 0) {
        req.flash('errors', 'Name is already exist');
        return res.redirect('/category/edit/' + id);
    }
    await pool.query('UPDATE category SET name = ? WHERE id = ?'
        , [name, id]);
    req.flash('success', 'Category successfully edit');
    return res.redirect('/category/edit/' + id);

}

/**
 * Process the delete category
 */
data.delete = async function (req, res) {
    const id = req.params.id;
    const exist = await pool.query('SELECT * FROM category WHERE id = ?', [id]);
    if (exist[0].length > 0) {
        await pool.query('UPDATE category SET is_deleted = 1 WHERE id = ?', [id]);
        return res.send({ msg: 'Category successfully deleted', type: 'success' });
    } else {
        return res.send({ msg: 'Category id not found', type: 'error' });
    }
}

module.exports = data;