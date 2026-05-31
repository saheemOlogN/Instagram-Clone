import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
export const addNewPost = async(req,res)=>{
    try {
        const image = req.file;
        const {caption} = req.body;
        const authorId = req.id;

        if(!image) return res.status(400).json({message:"Image is required"})
            const optimizedImageBuffer = await sharp (image.buffer)
        .resize({width:800,height:800,fit:'inside'})
            .toFormat('jpeg',{quality:80})
            .toBuffer()

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        })
        const user = await User.findById({authorId})
        if(user){
            user.posts.push(post._id)
            await user.save()
        }

        await post.populate({path:'author'}).select('-password')
        return res.status(200).json({message:"Posted successfully"},post)

    } catch (error) {
        console.log(error)
    }

}

export const getAllPosts = async (req,res) =>{
    try{
    const posts = Post.find().sort({createdAt:-1}).populate({path:'author',select:'username,profilePicture'})
    .populate({
        path : 'comments',
        sort : {createdAt : -1 },
        populate :{
            path :'author',
            select:'username,profilePicture'
        }
    })

    return res.status(200).json({posts})
}
catch(error){
    console.log(error)
}
}

export const getUserPosts = async(req,res) =>{
    try {
        const posts = await Post.find({author:req.id}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username,profilePicture'

        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }
        })
        return res.status(200).json({posts})
    } catch (error) {
        console.log(error)
    }
}


export const likePost = async(req,res) =>{
    try{
    const likeKarneWala = req.id;
    const postKiId = req.params.id;
    const post = await Post.findById(postKiId)

    if(!post) return res.status(400).json({message:"Something went wrong"})
    
        await post.updateOne({$addToSet:{likes:likeKarneWala}})
        await post.save()

        return res.status(200).json({message:"Post Liked"})

    }
    catch(error){
        console.log(error)
    }
}

export const dislikePost = async(req,res) =>{
    try{
    const likeKarneWala = req.id;
    const postKiId = req.params.id;
    const post = await Post.findById(postKiId)

    if(!post) return res.status(400).json({message:"Something went wrong"})
    
        await post.updateOne({$pull:{likes:likeKarneWala}})
        await post.save()

        return res.status(200).json({message:"Post Liked"})
        
    }
    catch(error){
        console.log(error)
    }
}

export const addComment = async(req,res) = ()=>{
    try {
        const postId = req.params.id;
        const commentKarneWala = req.id;

        const post=await Post.findById(postId)
        const {text} = req.body;
        if(!text) return res.status(400).json({message:"Failed to add comment"})

            const comment = await Comment.create({
                text,
                author:commentKarneWala,
                post:postId
            }).populate({
                path:'author',
                select:'username,profilePicture'
            })

            post.comments.push(comments._id)
            await post.save()

            return res.status(200).json({message:"Comment Added"},comment)
    } catch (error) {
        console.log(error)
    }
}


export const getAllComments = async(req,res) =>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        
    } catch (error) {
        console.log(error)
    }
}