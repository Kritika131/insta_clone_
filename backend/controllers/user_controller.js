import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        if(!username|| !email ||!password){
            return res.status(401).json({
                message:"Something is missing!",
                success:false,
            })
        }
        
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"Email is already exist!",
                success:false,
            })
            
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            email,password:hashedPassword
        })
        return res.status(201).json({
            message:"Account created successfully!",
            success:true,
        })



    }catch(err){
        console.log(err)
    }
}

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email,!password){

         return res.status(401).json({
                message:"Something is missing!",
                success:false,
            })
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid Credentials, Please try again!",
                success:false,
            })
            
        }

        const isPassword = await bcrypt.compare(password,user.password);
        if(!isPassword){
             return res.status(401).json({
                message:"Invalid Credentials, Please try again!",
                success:false,
            })
        }

        user ={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:user.posts
        }

        const token = await jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message:`Welcome back ${user.username}`,
            success:true,
            user
        })


    }catch(err){
     console.log(err)
    }
}

export const logout=async(req,res)=>{
    try{
      return res.cookie('token',"",{maxAge:0}).json({
        message:"Logged out successfully",
        success:true,
      })
    }catch(err){
     console.log(err)
    }
}

export const getProfile = async(req,res)=>{
    try{
        const userId = req.params.id;
        let user = await User.findById(userId)

        return res.status(200).json({
            user,
            success:true
        })

    }catch(err){
     console.log(err)
    }
}

export const editProfile=(req,res)=>{
    try{
        // const 

    }catch(err){
     console.log(err)
    }
}