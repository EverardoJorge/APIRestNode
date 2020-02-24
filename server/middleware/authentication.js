// ==================================
// IMPORTS
// ==================================

const jwt = require('jsonwebtoken')


// ==================================
// VERIFY TOKEN
// ==================================

let verifyToken = (req, res, next) => {
    //get to header
    let authorization = req.get('authorization');

    jwt.verify(authorization, process.env.SECRET_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalid'
                }
            });
        }

        req.user = decoded.user;
        next()
    });

}

// ==================================
// VERIFY ROLE
// ==================================
let verifyAdminRol = (req, res, next) => {
    let user = req.user;

    if (user.role === 'USER_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'You are not ADMIN'
            }
        });
    } else {
        next();
    }
}





module.exports = {
    verifyToken,
    verifyAdminRol
}