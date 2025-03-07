import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        requried: true,
    },
    email: {
        type: String,
        requried: true,
    },
    password: {
        type: String,
        requried: true,
    },
}, { timestamps: true })

export default mongoose.model<User>('User', userSchema)