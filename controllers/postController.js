import { Post } from "../models/postModel.js";

export const createPost = async(req, res, next)=>{
    try {
        const {caption} = req.body;
     
    await Post.create({
        caption, 
        image:{
            public_id: "req.body.public_id",
            url: "req.body.url"
        },
        owner: req.user,
    })
     res.status(201).json({
        success: true,
        message: 'Post added successfully',
     })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }   
}


export const getAllPost = async(req, res, next)=>{
    try {

    const post = await Post.find()
    if(!post){
        res.status(404).json({
            success: false,
            message: "Error in fetching post"
        })
    }

    res.status(200).json({
        success: true,
        post,
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const deletePost = async(req, res, next)=>{

   try {
    let post = Post.findById(req.params.id);
    if(!post) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }
    
    await post.deleteOne();
    res.status(200).json({
        success: true,
        message: "Post deleted Successfully"
    })
   } catch (error) {
    res.status(500).json({
        success: false,
        message: "Server Error"
    })
   }

}