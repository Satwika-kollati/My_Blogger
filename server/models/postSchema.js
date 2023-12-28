const mongoose = require('mongoose')

//creating 'S'chema function
const Schema = mongoose.Schema

const postSchema = new Schema({
    id:{
        type: Number,
        reruired: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        reruired: true
    },
    date:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    }
},{timestamps: true})


//model
//here a singular post is written- since it automatically considers a collection-'posts'
module.exports = mongoose.model('Post',postSchema)

//the post model automatically creates a posts collection in db by pluralising the name
//below line finds all the post within the posts collection
//Post.find() 