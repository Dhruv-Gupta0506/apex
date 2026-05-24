const jwt=require('jsonwebtoken');
const User=require('../models/users');

const authMiddleware=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:'not authorized,please login'});
        }
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(verified.id).select('-password');
        req.user=user;
        next();
    }
    catch(err){
        return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
}

module.exports=authMiddleware;