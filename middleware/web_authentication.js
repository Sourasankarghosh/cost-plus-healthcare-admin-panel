module.exports = function(req,res,next){
    if(req.session.authId){
        next();
    } else {
        req.flash('errors','You are not authorized');
        return res.redirect('/');
    }    
}