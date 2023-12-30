const data = {};
const pool = require('../../config/database');

/**
 * Process the listing banner
 */
data.bannerList = async function (req, res) {
    let bannerList = await pool.query(
        "SELECT * FROM banner WHERE is_deleted = 0"
    );
    bannerList = bannerList[0];
    if (bannerList.length > 0) {
        return res.status(200).send({
            status: true,
            msg: "banner found",
            bannerList: bannerList,
        });
    } else {
        return res.status(200).send({
            status: true,
            msg: "banner not found",
        });
    }
};

module.exports = data;
