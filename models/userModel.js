import mongoose from 'mongoose'

const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required:true,
        unique: true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    password: {
       type: String,
       required: true,
       default: false,
    },
    description:{
       type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})
export const User = mongoose.model('User', userSchema)