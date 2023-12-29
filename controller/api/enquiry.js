const data = {};
const pool = require('../../config/database');

/**
 * Process the create enquiry
 */
data.create = async function (req, res) {
    const created_at = new Date();
    let result = await pool.query('INSERT INTO enquiry SET name = ?,mobile=?, emailID =?,district_of_distribution =?, pharma_licence_number=?,investment=?,purchase_period=?,preffered_time_of_call_back=?,profession=?,address=?,business_query=?,created_at= ?,status="not-started"'
        , [req.body.name, req.body.mobile, req.body.emailID, req.body.district_of_distribution, req.body.pharma_licence_number, req.body.investment, req.body.purchase_period, req.body.preffered_time_of_call_back, req.body.profession, req.body.address, req.body.business_query, created_at]);
    insertId = String(result[0].insertId);
    return res.status(200).send(
        {
            status: true,
            msg: 'Enquiry successfully create',
        }
    );
}

module.exports = data;