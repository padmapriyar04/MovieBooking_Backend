const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async(req,res,next)=>{
    let token;
    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer')){
        token  = req.headers.authorization.split(' ')[1];
        console.log(token);
    }

    if(!token){
        return res.status(401).json({message : "Token not found,Unauthorised"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id).select('-password');
        console.log(req.user);
        next();
    }catch(error){
        res.status(401).json({message: "Not authorised,token failed"});
    }
}

exports.authorize = (...roles)=>{
    return (req,res,next) =>{
        console.log(roles);
        console.log(req.user.role);
        if(!roles.includes(req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1).toLowerCase())){
            return res.status(403).json({message: `Role ${req.user.role} is not authorized`});
        }
        next();
    };
};

