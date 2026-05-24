const User=require('../models/users');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const register=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const userExists=await User.findOne({email:email});
        if(userExists){
            return res.status(400).json({message:'this email is already registered'});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=new User({
            name,
            email,
            password:hashedPassword
        })
        await user.save();
        return res.status(201).json({message:'user registered successfully'});
    }
    catch(err){
        return res.status(400).json({error:err.message});
    }
};

const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(400).json({message:'invalid credentials'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'invalid credentials'});
        }
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:3600000
        });
        return res.status(200).json({
            message:'login successfully',
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    }
    catch(err){
        return res.status(400).json({error:err.message});
    }
};

const logout=async(req,res)=>{
    try{
        res.clearCookie('token');
        return res.status(200).json({message:'logged out successfully'});
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
};

module.exports={
    register,
    login,
    logout
};