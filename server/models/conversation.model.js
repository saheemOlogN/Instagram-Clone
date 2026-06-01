import mongoose from "mongoose";

const conversationSchema = new mongoose.model({
    participants : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    messages : [{
        type:MongooseError.Schema.Types.ObjectId,
        ref:'Message'
    }
    ]
})
export const Conversation = mongoose.model('Conversation',conversationSchema)
