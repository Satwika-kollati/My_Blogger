const Post = require('../models/postSchema')
const mongoose = require('mongoose')

//GET all posts
const getPosts = async(req,res)=>{
    //getting user id fom the user property added in middleware
    const user_id = req.user._id

    //finds in the collection posts
    //sort({id: 1}) gives post with ascending order of id's
    //sort({id: -1}) gives descending order
    //getting only the posts where user_id matches
    const posts = await Post.find({user_id }).sort({id: 1})
    res.status(200).json(posts)
}

//GET a single post
const getPost = async(req,res)=>{
    
    const {id} = req.params
    //to check if the id is in valid format or not
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No such Post'})
    }
    const post = await Post.findById(id)

    if(!post){
        return res.status(404).json({error : 'No such Post'})
    }
    res.status(200).json(post)
}

//POST a post
const createPost = async(req,res)=>{
    const {id,title,content,date} = req.body

    let emptyFields = []

    if(!title){
        emptyFields.push('title')
    }
    if(!id){
        emptyFields.push('id')
    }
    if(!content){
        emptyFields.push('content')
    }
    if(!date){
        emptyFields.push('date')
    }

    if(emptyFields.length > 0 ){
        return res.status(400).json({error:'All the fields are mandatory',emptyFields})
    }
    try{
        //we get a user with id prop from the middleware
        const user_id = req.user._id

        const post = await Post.create({id,title,content,date,user_id})
        //status code is set to 200 to say everything is ok
        res.status(200).json(post)
    }catch(error){
        //the error object catched in above line has message property
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(
              (err) => err.message
            );
            return res.status(400).json({ error: validationErrors });
        }
        // For other types of errors
        res.status(400).json({ error: error.message });
    }
}

//DELETE a post
const deletePost = async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No Post with that ID'})
    }
    //mongoose id is as "_id"
    const post = await Post.findByIdAndDelete({_id : id})

    if(!post){
        return res.status(402).json({error : 'No such Post'})
    }
    res.status(200).json(post)
}

//UPDATE a post
const updatePost = async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:'No Post with that ID'})
    }

    const post = await Post.findByIdAndUpdate({_id: id},{
        //the below line is an object from request-it indicate sthe updates to be done
        //the req.body object is spread into its properties withe the help of those ...
        ...req.body
    })

    if(!post){
        return res.status(400).json({error : 'No such Post'})
    }
    res.status(200).json(post)

}

module.exports={
    getPosts,
    getPost,
    createPost,
    deletePost,
    updatePost
}