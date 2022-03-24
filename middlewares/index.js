const jwt = require('jsonwebtoken');
const userDataLayer = require('../dal/users');

const checkIfAuthenticated = function(req,res,next){
    if (req.session.user) {
        next(); // go to the next middleware
                // if no more middleware, then go to the
                // route function
    } else {
        // no user has logged in
        req.flash('error_messages', 'Login required to view page');
        res.redirect('/users/login');
    }
}

const checkIfAuthenticatedWithJWT = function(req,res,next) {
    // req.headers.authorization will contain "Bearer <JWT>"
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, async function(err,user){
            if (err) {
                res.status("401").json({
                    "message":"Forbidden"
                })
            } else{
                const token = await userDataLayer.getUserToken(user.id);
                console.log("Token: "+token);
                if (token === null || token === ''){
                    res.status("401").json({
                        "message":"Forbidden"
                    })
                } else {
                    // add the user object to req
                    req.user = user;
                    next();
                }
            }
        })
    } else {
        // no authorization in header found then therefore
        // not allowed
        res.status(401).json({
            'message':'Forbidden'
        });
    }
}

module.exports = { checkIfAuthenticated, checkIfAuthenticatedWithJWT }