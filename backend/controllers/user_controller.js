import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

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
        
        let user = await User.findOne({email});
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
        let user = await User.findById(userId).select("-password")

        return res.status(200).json({
            user,
            success:true
        })

    }catch(err){
     console.log(err)
    }
}

export const editProfile=async(req,res)=>{
    try{
        const userId = req.id;
        const {bio,gender} = req.body;

        const profilePicture = req.file;



        let cloudResponse;
        if(profilePicture){
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message:"user not found",
                success:false
            })
        }
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;
        await user.save();

        return res.status(200).json({
            message:"Profile Updated",
            success:true,
            user
        })

    }catch(err){
     console.log(err)
    }
}

export const getSuggestedUsers = async(req,res)=>{
    try{
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message:"Currently do not have a ny users",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            users:suggestedUsers
        })

    }catch(err){
     console.log(err)
    }
}

export const followOrUnfollow = async(req,res)=>{
    try{
        const follower_id = req.id;// my id
        const following_id = req.params.id ; // followed by me
        if(follower_id === following_id){
            return res.status(400).json({
                message:"You cannot follow/unfollow yourself",
                success:false
            })
        }
        const user = await User.findById(follower_id)
        const targetUser = await User.findById(following_id)

        if(!user || !targetUser){
             return res.status(400).json({
                message:"User not found",
                success:false
            })
        } 
        const isFollowing = user.following.includes(following_id)
        if(isFollowing){
            //already follow , unfollow it
              await Promise.all([
                User.updateOne({_id:follower_id},{$pull:{following:following_id}}),
                User.updateOne({_id:following_id},{$pull:{followers:follower_id}})

            ])
              return res.status(200).json({
                message:"Unfollowed successfully",
                success:true
            })
            
        } else{
            //follow it
            await Promise.all([
                User.updateOne({_id:follower_id},{$push:{following:following_id}}),
                User.updateOne({_id:following_id},{$push:{followers:follower_id}})

            ])
              return res.status(200).json({
                message:"followed successfully",
                success:true
            })
        }



    }catch(err){
     console.log(err)
    }
}
