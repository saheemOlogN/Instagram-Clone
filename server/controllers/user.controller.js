import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req,res) =>{
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required",success:false})
        }
        const user=await User.findOne({$or:[{email},{username}]})
        if(user){
            const message = user.email === email ? "Email already exists" : "Username already exists";
            return res.status(400).json({message,success:false})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashedPassword
        })
        return res.status(201).json({message:"User created successfully",success:true})
    } catch (error) {
        console.log(error)
        if(error.code === 11000){
            const field = Object.keys(error.keyPattern || {})[0] || "user";
            return res.status(400).json({message:`${field} already exists`,success:false})
        }
        return res.status(500).json({message:"Internal server error",success:false})
    }
}

export const login = async (req,res) =>{
    try {
        const {email,password} = req.body;
        let user= await User.findOne({email})
        if(!user) return res.status(401).json({message:"Invalid email",success:false})
            const isCorrectPassword = await bcrypt.compare(password,user.password)
        if(!isCorrectPassword) return res.status(401).json({message:"Invalid Password",success:false})
    
            const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'3d'})
            const populatedPosts = await Promise.all(
                user.posts.map(async (postId)=>{
                    const post = await Post.findById(postId)

                    if(!post) return null;

                    if(post.author.equals(user._id)){
                        return post;
                    }
                    return null;
                })
            )
                user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts.filter(Boolean),
            bookmarks:user.bookmarks
        }
            return res.cookie('token',token , {httpOnly:true , sameSite:'lax' ,path:'/' ,maxAge:1*24*60*60*1000}).json({message:`Welcome back ${user.username}`,user,success:true})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error",success:false})
    }
}

export const logout = async (_,res) => {
  try{
    return res.cookie('token','',{path:'/' ,maxAge:0}).json({
        message:"Logout Successfully",
        success:true
    });
}catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal server error",success:false})
}
}

export const getProfile = async(req,res) =>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select("-password")
            .populate({
                path:'bookmarks',
                options:{sort:{createdAt:-1}},
                populate:[
                    {
                        path:'author',
                        select:'username profilePicture'
                    },
                    {
                        path:'comments',
                        options:{sort:{createdAt:-1}},
                        populate:{
                            path:'author',
                            select:'username profilePicture'
                        }
                    }
                ]
            })
            .populate({
                path:'followers',
                select:'username profilePicture bio'
            })
            .populate({
                path:'following',
                select:'username profilePicture bio'
            })
        if(!user) return res.status(400).json({message:"user doesnt exists",success:false})
        user = user.toObject()
        user.posts = await Post.find({author:userId}).sort({createdAt:-1})
            .populate({
                path:'author',
                select:'username profilePicture'
            })
            .populate({
                path:'comments',
                options:{sort:{createdAt:-1}},
                populate:{
                    path:'author',
                    select:'username profilePicture'
                }
            })
         return res.status(200).json({message:"User fetched",user,success:true})  
 
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error",success:false})
    }
}
export const editProfile = async(req,res)=>{
    try {
        const userId=req.id;
        const {bio,gender}=req.body;
        const profilePicture=req.file;

        const user=await User.findById(userId)
            if(!user) return res.status(400).json({message:"failed to update",success:false})
          if(bio) user.bio=bio;
            if(gender) user.gender=gender;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture)
            const cloudResponse = await cloudinary.uploader.upload(fileUri)
             user.profilePicture=cloudResponse.secure_url;


        }
        
            await user.save()
            return res.status(200).json({message:"changes made",user,success:true})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error",success:false})
    }
}

export const getSuggestedUser = async(req,res)=>{
    try {
        const user = await User.findById(req.id).select("following")
        if(!user) return res.status(400).json({message:"User not found",success:false})

        const suggestedUser = await User.find({_id:{$ne:req.id,$nin:user.following}}).select("-password")
        if(!suggestedUser) return res.status(400).json({message:"Currently no users",success:false})

            return res.status(200).json({
                success:true,
                users:suggestedUser
            })
    } catch (error) {
       console.log(error) 
       return res.status(500).json({message:"Internal server error",success:false})
    }

}

export const searchUser = async(req,res)=>{
    try {
        const username = req.query.username?.trim().replace(/^@/, "")
        if(!username) return res.status(400).json({message:"Username is required",success:false})

        const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const user = await User.findOne({
            username: { $regex: `^${escapedUsername}$`, $options: "i" }
        }).select("-password")
        if(!user) return res.status(404).json({message:"User not found",success:false})

        return res.status(200).json({message:"User found",user,success:true})
    } catch (error) {
       console.log(error)
       return res.status(500).json({message:"Internal server error",success:false})
    }
}

export const followOrUnfollow = async(req,res)=>{
    try {
        const followKarneWala = req.id;
        const jiskoFollowKarnaHai = req.params.id;
        if (followKarneWala==jiskoFollowKarnaHai) return res.status(400).json({message:"You cant follow yourself",success:false})

            const user = await User.findById(followKarneWala)
            const targetUser = await User.findById(jiskoFollowKarnaHai)

            if(!user || !targetUser) return res.status(400).json({message:"User not found"})

                const isFollowing = user.following.some(id => id.toString() === jiskoFollowKarnaHai) 
                if(isFollowing){
                    await Promise.all([
                    User.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKarnaHai}}),
                    User.updateOne({_id:jiskoFollowKarnaHai},{$pull:{followers:followKarneWala}})
                ])
                return res.status(200).json({message:"unfollowed successfully",success:true,following:false,userId:followKarneWala,targetUserId:jiskoFollowKarnaHai})
                }
                 else{
                    await Promise.all([
                        User.updateOne({_id:followKarneWala},{$addToSet:{following:jiskoFollowKarnaHai}}),
                        User.updateOne({_id:jiskoFollowKarnaHai},{$addToSet:{followers:followKarneWala}})
                    ])
                      return res.status(200).json({message:"followed successfully",success:true,following:true,userId:followKarneWala,targetUserId:jiskoFollowKarnaHai})
                }

        } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error",success:false})
    }
}
