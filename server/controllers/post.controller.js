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
    
        
    }
    catch(error){
        console.log(error)
    }
}