import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        required: true,
    },
    image:{
      public_id: String,
      url: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    comments:[
        { 
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },

            comment:{
                type: String,
                // required: true,
            }
           
        }
        
    ]
})

export const Post = mongoose.model('Post', postSchema)