const data = {};
const pool = require('../config/database');
const fs = require('fs');

/**
 * Create product form
 */
data.createForm = async function (req, res) {
    const category_id = req.params.category_id;
    const category = await pool.query('SELECT * FROM category WHERE id = ?', [category_id]);
    const sidebar = 'listing-category';
    return res.render('pages/product/create', { sidebar: sidebar, category_id: category_id, category: category[0] });
}

/**
 * Process the create product
 */
data.create = async function (req, res) {
    const name = req.body.name;
    const category_id = req.body.category_id
    const nameExist = await pool.query('SELECT * FROM product WHERE name = ?', [name]);
    if (nameExist[0].length > 0) {
        req.flash('errors', 'Name is already exist');
        return res.redirect('/product/create/' + category_id);
    }
    let thumbImage_name;
    let fullImage_name;
    if (req.files && req.files.thumbImage) {
        const thumbImage = req.files.thumbImage;
        thumbImage_name = req.files.thumbImage.name.replace(/\s/g, '');
        thumbImage_name = Date.now() + thumbImage_name;
        thumbImage.mv('storage/thumbImages/' + thumbImage_name, function (err) {
            if (err) {
                req.flash('errors', 'File is not uploaded!');
                return res.redirect('/product/create/' + category_id);
            }
        });
    } else {
        req.flash('errors', 'Please upload the thumbnail Image!');
        return res.redirect('/product/create/' + category_id);
    }
    if (req.files && req.files.fullImage) {
        const fullImage = req.files.fullImage;
        fullImage_name = req.files.fullImage.name.replace(/\s/g, '');
        fullImage_name = Date.now() + fullImage_name;
        fullImage.mv('storage/fullImages/' + fullImage_name, function (err) {
            if (err) {
                req.flash('errors', 'File is not uploaded!');
                return res.redirect('/product/create/' + category_id);
            }
        });
    } else {
        req.flash('errors', 'Please upload the full image!');
        return res.redirect('/product/create/' + category_id);
    }
    const created_at = new Date();
    const composition = req.body.composition;
    const indication = req.body.indication;
    const packing = req.body.packing;
    const packType = req.body.packType;
    const result = await pool.query('INSERT INTO product SET name = ?, category_id = ?, thumbImage_name = ?, fullImage_name = ?,composition = ?, indication = ?, packing = ?, packType = ?, created_at= ?'
        , [name, category_id, thumbImage_name, fullImage_name, composition, indication, packing, packType, created_at]);
    insertId = String(result[0].insertId);
    req.flash('success', 'product successfully create');
    return res.redirect('/product/list/' + category_id);
}

/**
 * Listing product 
 */
data.list = async function (req, res) {
    const category = await pool.query('SELECT * FROM category WHERE id = ?', [req.params.category_id]);
    const sidebar = 'listing-category';
    return res.render('pages/product/list', { sidebar: sidebar, category: category[0] });
}

/**
 * Process the listing product 
 */
data.dataTable = async function (req, res) {
    let draw = parseInt(req.body.draw);
    const category_id = req.params.category_id;
    const totalproducts = await pool.query('SELECT COUNT(*) as count FROM product WHERE is_deleted = 0 AND category_id = ?', [category_id]);
    let productList = await pool.query('SELECT * FROM product WHERE is_deleted = 0 AND category_id = ?', [category_id]);
    productList = productList[0];
    let result = [];
    if (productList.length > 0) {
        productList.forEach(function (data) {
            let value = [];
            value.push(data.name);
            const thumbImage = "<img src='/thumbImages/" + data.thumbImage_name + " ' class='thumbnail' style='height:220px;width:100%'>"
            value.push(thumbImage);
            let action = "<a href='/product/edit/" + data.id + "' class='btn btn-warning btn-xs'><i class='fa fa-fw fa-edit'></i></a> &nbsp;";
            action += "<a href='javascript:deleteProduct(" + data.id + ")' class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></a> &nbsp;";
            value.push(action);
            result.push(value);
        })
    }
    const output = {
        draw: draw,
        recordsTotal: totalproducts[0][0]['count'],
        recordsFiltered: totalproducts[0][0]['count'],
        data: result
    };
    res.send(output);
}

/**
 * Edit product form
 */
data.editForm = async function (req, res) {
    const id = req.params.id;
    const product = await pool.query('SELECT * FROM product WHERE id = ?', [id]);
    const category = await pool.query('SELECT * FROM category WHERE id = ?', [product[0][0].category_id]);
    return res.render('pages/product/edit', { sidebar: 'category', product: product[0], category: category[0] });
}

/**
 * Process the edit product
 */
data.edit = async function (req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const nameExist = await pool.query('SELECT * FROM product WHERE name = ? AND id != ?', [name, id]);
    if (nameExist[0].length > 0) {
        req.flash('errors', 'Name is already exist');
        return res.redirect('/product/edit/' + id);
    }
    const composition = req.body.composition;
    const indication = req.body.indication;
    const packing = req.body.packing;
    const packType = req.body.packType;
    const product = await pool.query('SELECT * FROM product WHERE id = ?', [id]);
    let thumbImage_name = product[0][0]['thumbImage_name'];
    let fullImage_name = product[0][0]['fullImage_name'];
    if (req.files) {
        if (req.files.thumbImage) {
            fs.unlinkSync('storage/thumbImages/' + thumbImage_name);
            const thumbImage = req.files.thumbImage;
            thumbImage_name = req.files.thumbImage.name.replace(/\s/g, '');
            thumbImage_name = Date.now() + thumbImage_name;
            thumbImage.mv('storage/thumbImages/' + thumbImage_name, function (err) {
                if (err) {
                    req.flash('errors', 'File is not uploaded!');
                    return res.redirect('/product/edit/' + id);
                }
            });
        }
        if (req.files.fullImage) {
            fs.unlinkSync('storage/fullImages/' + fullImage_name);
            const thumbImage = req.files.fullImage;
            fullImage_name = req.files.fullImage.name.replace(/\s/g, '');
            fullImage_name = Date.now() + fullImage_name;
            thumbImage.mv('storage/fullImages/' + fullImage_name, function (err) {
                if (err) {
                    req.flash('errors', 'File is not uploaded!');
                    return res.redirect('/product/edit/' + id);
                }
            });
        }
    }

    await pool.query('UPDATE product SET name = ?, composition = ?, indication = ?, packing = ?, packType = ?, thumbImage_name = ?, fullImage_name = ? WHERE id = ?'
        , [name, composition, indication, packing, packType, thumbImage_name, fullImage_name, id]);
    req.flash('success', 'Product successfully edit');
    return res.redirect('/product/edit/' + id);

}

/**
 * Process the delete product
 */
data.delete = async function (req, res) {
    const id = req.params.id;
    const exist = await pool.query('SELECT * FROM product WHERE id = ?', [id]);
    if (exist[0].length > 0) {
        await pool.query('UPDATE product SET is_deleted = 1 WHERE id = ?', [id]);
        return res.send({ msg: 'Product successfully deleted', type: 'success' });
    } else {
        return res.send({ msg: 'Product id not found', type: 'error' });
    }
}

module.exports = data;