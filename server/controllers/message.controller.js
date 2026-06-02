import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async(req,res) =>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const {message} = req.body;
        if(!message) return res.status(400).json({message:"Message is required",success:false})

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if(newMessage) conversation.messages.push(newMessage._id)
            await Promise.all([conversation.save(),newMessage.save()])

        return res.status(201).json({message:"Message sent successfully",success:true,newMessage})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error",success:false})
    }
}

export const getMessage = async(req,res) =>{
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages")
        if(!conversation) return res.status(200).json({messages:[],success:true})

            return res.status(200).json({messages:conversation.messages,success:true})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error",success:false})
    }
}
