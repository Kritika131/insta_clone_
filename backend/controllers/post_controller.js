import sharp from 'sharp';
import cloudinary from '../utils/cloudinary';
import { Post } from '../models/post_model.js';
import { User } from '../models/user_model.js';

export const addNewPost = async(req, res) => {
    try{
        const {caption} = req.body;
        const image = req.file;
        const authorId=req.id;

        if(!image){
            return res.status(400).json({
                message:"Please upload an image",
                success:false
            })
        }
        //image upload to cloudinary
        // first optimize image
        const optimizedImageBuffer = await sharp(image.buffer).resize({width:800,height:800,fit:'inside'}).toFormat('jpeg',{quality:80}).toBuffer();
        const fileUri =`data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        })

        const user = await User.findById(authorId);
        if(user){

            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:'author', select:"-password"})

        return res.status(201).json({
            message:"Post added",
            success:true,
            post
        })  




    }catch(error){
        console.log(error)
    }
}

export const getAllPosts = async(req,res)=>{
    try{
        const posts = await Post.find().sort({createdAt:-1}).populate({path:'author',select:"-password"}).populate({path:'comments',sort:{createdAt:-1},populate:{path:'author',select:"-password"}}).populate({path:'likes',select:"-password"});
        return res.status(200).json({
            posts,
            success:true
        })
    }catch(err){
        console.log(err)
    }
}

export const getUserPost= async(req,res)=>{
    try{

        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({path:'author',select:"-password"}).populate({path:'comments',sort:{createdAt:-1},populate:{path:'author',select:"-password"}}).populate({path:'likes',select:"-password"});
        return res.status(200).json({
            posts,
            success:true
        })

    }catch(err){
        console.log(err)
    }
}

export const likePost = async(req,res)=>{
    try{
      const likedById = req.id;
      const postId = req.params.id;
      const post = await Post.findById(postId)
      if(!post){
        return res.status(404).json({
            message:'Post not found',success:false
        })
      }
      
      await post.updateOne({$addToSet:{likes:likedById}});
      await post.save();

      //implementing socket io for real time notification later

      return res.status(200).json({message:"Post liked",success:true})

    }catch(err){
        console.log(err)
    }

}
export const dislikePost = async(req,res)=>{
    try{
      const likedById = req.id;
      const postId = req.params.id;
      const post = await Post.findById(postId)
      if(!post){
        return res.status(404).json({
            message:'Post not found',success:false
        })
      }
      
      await post.updateOne({$pull:{likes:likedById}});
      await post.save();

      //implementing socket io for real time notification later

      return res.status(200).json({message:"Post disliked",success:true})

    }catch(err){
        console.log(err)
    }

}

export  const addComment = async(req,res)=>{
    try{
        const postId = req.params.id;
        const commentedById = req.id;

        const {text} = req.body;
        const post = await Post.findById(postId);
        if(!text){
            return res.status(400).json({message:"Text is required", success:false})
        }

        const comment = await Comment.create({
            text,
            author:commentedById,
            post:postId,
        }).populate({path:author,select:"username, profilePicture"})
        post.comments.push(comment._id);
        await post.save();
        return res.status(201).josn({
            message:"Comment Added",
            comment,
            success:true
        })

    }catch(err){
        console.log(err)
    }
}