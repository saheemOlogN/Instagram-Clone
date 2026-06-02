import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import upload from "../middlewares/multer.js"

export const register = async (req,res) =>{
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({message:"empty field"})
        }
        const user=await User.findOne({email})
        if(user){
            return res.status(401).json({message:"user already exists",success:false})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashedPassword
        })
        res.status(200).json({message:"User Created successfully"})
    } catch (error) {
        console.log(error)
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
            posts:populatedPosts
        }
            return res.cookie('token',token , {httpOnly:true , sameSite:'strict' ,maxAge:1*24*60*60*1000}).json({message:`Welcome back ${user.username}`,user})

    } catch (error) {
        console.log(error)
    }
}

export const logout = async (_,res) => {
  try{
    return res.cookie('token','',{maxAge:0}).json({
        message:"Logout Successfully"
    });
}catch(error){
    console.log(error)
}
}

export const getProfile = async(req,res) =>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password')
        if(!user) return res.status(400).json({message:"user doesnt exists",success:false})
         return res.status(200).json({message:"User fetched",user,success:true})  
 
    } catch (error) {
        console.log(error)
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
    }
}

export const getSuggestedUser = async(req,res)=>{
    try {
        const suggestedUser = await User.find({_id:{$ne:req.id}}).select("-password")
        if(!suggestedUser) return res.status(400).json({message:"Currently no users",success:false})

            return res.status(200).json({
                success:true,
                users:suggestedUser
            })
    } catch (error) {
       console.log(error) 
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

                const isFollowing = user.following.includes(jiskoFollowKarnaHai) 
                if(isFollowing){
                    await Promise.all([
                    User.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKarnaHai}}),
                    User.updateOne({_id:jiskoFollowKarnaHai},{$pull:{followers:followKarneWala}})
                ])
                return res.status(200).json({message:"unfollowed successfully",success:true})
                }
                 else{
                    await Promise.all([
                        User.updateOne({_id:followKarneWala},{$push:{following:jiskoFollowKarnaHai}}),
                        User.updateOne({_id:jiskoFollowKarnaHai},{$push:{followers:followKarneWala}})
                    ])
                      return res.status(200).json({message:"followed successfully",success:true})
                }

        } catch (error) {
        console.log(error)
    }
}