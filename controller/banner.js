const data = {};
const pool = require("../config/database");
const fs = require("fs");

/**
 * Create banner form
 */
data.createForm = async function (req, res) {
    const sidebar = "create-banner";
    return res.render("pages/banner/create", { sidebar: sidebar });
};

/**
 * Process the banner banner
 */
data.create = async function (req, res) {
    let bannerImage_name;
    if (req.files && req.files.bannerImage) {
        const bannerImage = req.files.bannerImage;
        bannerImage_name = req.files.bannerImage.name.replace(/\s/g, "");
        bannerImage_name = Date.now() + bannerImage_name;
        bannerImage.mv("storage/bannerImages/" + bannerImage_name, function (err) {
            if (err) {
                req.flash("errors", "File is not uploaded!");
                return res.redirect("/banner/create");
            }
        });
    } else {
        req.flash("errors", "Please upload the banner Image!");
        return res.redirect("/banner/create");
    }
    const created_at = new Date();
    const result = await pool.query(
        "INSERT INTO banner SET  bannerImage_name = ?, title = ?, description = ?, created_at= ?",
        [bannerImage_name, req.body.title, req.body.description, created_at]
    );
    insertId = String(result[0].insertId);
    req.flash("success", "banner successfully create");
    return res.redirect("/banner/list");
};

/**
 * Listing banner
 */
data.list = async function (req, res) {
    const sidebar = "listing-banner";
    return res.render("pages/banner/list", { sidebar: sidebar });
};

/**
 * Process the listing banner
 */
data.dataTable = async function (req, res) {
    let draw = parseInt(req.body.draw);
    const totalbanners = await pool.query(
        "SELECT COUNT(*) as count FROM banner WHERE is_deleted = 0"
    );
    let bannerList = await pool.query(
        "SELECT * FROM banner WHERE is_deleted = 0"
    );
    bannerList = bannerList[0];
    let result = [];
    if (bannerList.length > 0) {
        bannerList.forEach(function (data) {
            let value = [];
            value.push(data.title);
            value.push(data.description);
            const bannerImage =
                "<img src='/bannerImages/" +
                data.bannerImage_name +
                " ' class='thumbnail' style='height:220px;width:100%'>";
            value.push(bannerImage);
            let action =
                "<a href='/banner/edit/" +
                data.id +
                "' class='btn btn-warning btn-xs'><i class='fa fa-fw fa-edit'></i></a> &nbsp;";
            action +=
                "<a href='javascript:deleteBanner(" +
                data.id +
                ")' class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></a> &nbsp;";
            value.push(action);
            result.push(value);
        });
    }
    const output = {
        draw: draw,
        recordsTotal: totalbanners[0][0]["count"],
        recordsFiltered: totalbanners[0][0]["count"],
        data: result,
    };
    res.send(output);
};

/**
 * Edit banner form
 */
data.editForm = async function (req, res) {
    const id = req.params.id;
    const banner = await pool.query("SELECT * FROM banner WHERE id = ?", [id]);
    return res.render("pages/banner/edit", {
        sidebar: "banner",
        banner: banner[0],
    });
};

/**
 * Process the edit banner
 */
data.edit = async function (req, res) {
    const id = req.body.id;
    const banner = await pool.query("SELECT * FROM banner WHERE id = ?", [id]);
    let bannerImage_name = banner[0][0]["bannerImage_name"];
    if (req.files) {
        if (req.files.bannerImage) {
            fs.unlinkSync("storage/bannerImages/" + bannerImage_name);
            const bannerImage = req.files.bannerImage;
            bannerImage_name = req.files.bannerImage.name.replace(/\s/g, "");
            bannerImage_name = Date.now() + bannerImage_name;
            bannerImage.mv(
                "storage/bannerImages/" + bannerImage_name,
                function (err) {
                    if (err) {
                        req.flash("errors", "File is not uploaded!");
                        return res.redirect("/banner/edit/" + id);
                    }
                }
            );
        }
    }

    await pool.query(
        "UPDATE banner SET bannerImage_name = ?, title = ?, description = ? WHERE id = ?",
        [bannerImage_name, req.body.title, req.body.description, id]
    );
    req.flash("success", "Banner successfully edit");
    return res.redirect("/banner/edit/" + id);
};

/**
 * Process the delete banner
 */
data.delete = async function (req, res) {
    const id = req.params.id;
    const exist = await pool.query("SELECT * FROM banner WHERE id = ?", [id]);
    if (exist[0].length > 0) {
        await pool.query("UPDATE banner SET is_deleted = 1 WHERE id = ?", [id]);
        return res.send({ msg: "Banner successfully deleted", type: "success" });
    } else {
        return res.send({ msg: "Banner id not found", type: "error" });
    }
};

module.exports = data;
