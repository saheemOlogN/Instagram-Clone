import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async(req,res) =>{
    try {
        const sendId=req.id;
        const receiverId=req.params.id;
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:{sendId,receiverId}}
        })

        if(!conversation){
            //abhi toh baate start hogi skibdi

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
            await Promise.all(conversation.save(),newMessage.save())

        //socketIo nahi ata hai vro 

    } catch (error) {
        console.log(error)
    }
}

export const getMessage = async(req,res) =>{
    try {
        const senderId = req.params.id;
        const receiverId = req.id;
        const conversation = await Conversation.find({
            participants:{$all:[senderId,receiverId]}
        })
        if(!conversation) res.status(200).json({messages:[]})

            return res.status(200).json({messages:conversation.message,success:true})

    } catch (error) {
        console.log(error)
    }
}