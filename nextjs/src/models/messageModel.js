import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    message: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model("Message", messageModel);
