import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const serverError = (res) => res.status(500).json({message:"Internal server error",success:false});

export const addNewPost = async(req,res)=>{
    try {
        const image = req.file;
        const {caption} = req.body;
        const authorId = req.id;

        if(!image) return res.status(400).json({message:"Image is required",success:false})
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
        const user = await User.findById(authorId)
        if(user){
            user.posts.push(post._id)
            await user.save()
        }

        await post.populate({path:'author',select:'-password'})
        return res.status(201).json({message:"Posted successfully",success:true,post})

    } catch (error) {
        console.log(error)
        return serverError(res)
    }

}

export const getAllPosts = async (req,res) =>{
    try{
    const posts = await Post.find().sort({createdAt:-1}).populate({path:'author',select:'username profilePicture'})
    .populate({
        path : 'comments',
        sort : {createdAt : -1 },
        populate :{
            path :'author',
            select:'username profilePicture'
        }
    })

    return res.status(200).json({posts,success:true})
}
catch(error){
    console.log(error)
    return serverError(res)
}
}

export const getUserPosts = async(req,res) =>{
    try {
        const posts = await Post.find({author:req.id}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username profilePicture'

        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        })
        return res.status(200).json({posts,success:true})
    } catch (error) {
        console.log(error)
        return serverError(res)
    }
}


export const likePost = async(req,res) =>{
    try{
    const likeKarneWala = req.id;
    const postKiId = req.params.id;
    const post = await Post.findById(postKiId)

    if(!post) return res.status(400).json({message:"Something went wrong",success:false})
    
        await post.updateOne({$addToSet:{likes:likeKarneWala}})
        await post.save()

        return res.status(200).json({message:"Post Liked",success:true})

    }
    catch(error){
        console.log(error)
        return serverError(res)
    }
}

export const dislikePost = async(req,res) =>{
    try{
    const likeKarneWala = req.id;
    const postKiId = req.params.id;
    const post = await Post.findById(postKiId)

    if(!post) return res.status(400).json({message:"Something went wrong",success:false})
    
        await post.updateOne({$pull:{likes:likeKarneWala}})
        await post.save()

        return res.status(200).json({message:"Post Disliked",success:true})
        
    }
    catch(error){
        console.log(error)
        return serverError(res)
    }
}

export const addComment = async(req,res) =>{
    try {
        const postId = req.params.id;
        const commentKarneWala = req.id;

        const post=await Post.findById(postId)
        const {text} = req.body;
        if(!post) return res.status(404).json({message:"Post not found",success:false})
        if(!text) return res.status(400).json({message:"Failed to add comment",success:false})

            const comment = await Comment.create({
                text,
                author:commentKarneWala,
                post:postId
            })

            await comment.populate({
                path:'author',
                select:'username profilePicture'
            })

            post.comments.push(comment._id)
            await post.save()

            return res.status(201).json({message:"Comment Added",success:true,comment})
    } catch (error) {
        console.log(error)
        return serverError(res)
    }
}


export const getAllComments = async(req,res) =>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).populate('author','username profilePicture')

            return res.status(200).json({comments,success:true})
    } catch (error) {
        console.log(error)
        return serverError(res)
    }
}

export const deletePost = async(req,res) =>{
    try {
        const postId = req.params.id;
        const authorId=req.id;
        const post = await Post.findById(postId)

        if(!post) return res.status(404).json({message:"No posts available to delete",success:false})

            if(post.author.toString()!=authorId) return res.status(400).json({message:"You arent the owner of this post",success:false})
            
                await Post.findByIdAndDelete(postId)

            

                let user = await User.findById(authorId)

                user.posts = user.posts.filter(id=> id.toString()!=postId)
                await user.save()


                await Comment.deleteMany({post:postId})

                    return res.status(200).json({message:"Post deleted successfully",success:true})



    } catch (error) {
        console.log(error)
        return serverError(res)
    }
}

export const bookmarkPost = async(req,res) =>{
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId)
        if(!post) return res.status(400).json({message:"Post not found",success:false})

        const user = await User.findById(authorId)
        if(!user) return res.status(400).json({message:"User not found",success:false})

        const isBookmarked = user.bookmarks.some(id => id.toString() === post._id.toString());
        if(isBookmarked){
            // remove from bookmark
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== post._id.toString());
            await user.save();
            return res.status(200).json({message:"Post Unbookmarked",success:true})
        }else{
            // add to bookmark
            user.bookmarks.push(post._id);
            await user.save();
            return res.status(200).json({message:"Post Bookmarked",success:true})
        }
    } catch (error) {
        console.log(error)
        return serverError(res)
    }
}
