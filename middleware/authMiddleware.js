const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) =>{
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({
            message:'Access denied, no token provided',
        })
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
         req.user = verified; 
         next();
    } catch (error) {
        res.status(400).json({ 
            message: 'Invalid Token' ,
            error:error.message
        });
    }
}

module.exports = authMiddleware;