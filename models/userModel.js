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
    createdAt:{
        type: Date,
        default: Date.now
    }

})
export const User = mongoose.model('User', userSchema)