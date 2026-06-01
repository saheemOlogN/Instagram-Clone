import mongoose from "mongoose";

const conversationSchema = new mongoose.model({
    participants : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    message : [{
        type:MongooseError.Schema.Types.ObjectId,
        ref:'Message'
    }
    ]
})
export const Converssation = mongoose.model('Conversation',conversationSchema)
