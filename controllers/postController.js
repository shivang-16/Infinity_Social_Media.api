import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
export const createPost = async(req, res, next)=>{
    try {
        const {caption} = req.body;
     
    const post = await Post.create({
        caption, 
        image:{
            public_id: "req.body.public_id",
            url: "req.body.url"
        },
        owner: req.user,
    })
    
    //pushing the post into the user data
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save(); 

     res.status(201).json({
        success: true,
        message: 'Post added successfully',
     })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }   
}


export const getAllPost = async(req, res, next)=>{
    try {

    const post = await Post.find()
    if(!post){
        return res.status(404).json({
            success: false,
            message: "Error in fetching post"
        })
    }

    res.status(200).json({
        success: true,
        post,
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const editPost = async(req, res, next)=>{
    try {
        

        let post = await Post.findById(req.params.id);
         if(!post) {
         return res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }
       const {caption} = req.body;
       post = await Post.updateOne({caption});
        res.status(200).json({
            success:true,
            message: "Post updated successfull"
        })

    } catch (error) {
       return res.status(500).json({
        success: false,
        message: error.message
      })
   }
}

export const deletePost = async(req, res, next)=>{

   try {
    let post = await Post.findById(req.params.id);
    if(!post) {
        return res.status(400).json({
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
    return res.status(500).json({
        success: false,
        message: error.message
      })
   }


}