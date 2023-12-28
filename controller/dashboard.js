const data = {};
const pool = require('../config/database');

/**
 * Show the dashboard page
 */
data.index = async function(req,res){    
    let sidebar = 'dashboard';  
    return res.render('pages/dashboard',{sidebar:sidebar});  
}

/**
 * Process the listing enquiry 
 */
data.enquiryDataTable = async function (req, res) {
    let draw = parseInt(req.body.draw);
    const totalEnquiries = await pool.query('SELECT COUNT(*) as count FROM enquiry ORDER BY id DESC;');
    let enquiriesList = await pool.query('SELECT * FROM enquiry ORDER BY id DESC');
    enquiriesList = enquiriesList[0];
    let result = [];
    if (enquiriesList.length > 0) {
        enquiriesList.forEach(function (data) {
            let value = [];            
            value.push(data.name)
            value.push(data.mobile)
            value.push(data.emailID)
            value.push(data.status)
            result.push(value);
        })
    }
    const output = {
        draw: draw,
        recordsTotal: totalEnquiries[0][0]['count'],
        recordsFiltered: totalEnquiries[0][0]['count'],
        data: result
    };
    res.send(output);
}

module.exports = data;