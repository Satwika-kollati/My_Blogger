require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const postRoutes = require('./routes/post')
const userRoutes = require('./routes/user')
const cors = require('cors');


//express app
const app = express()

// Use CORS middleware
app.use(cors());

//Middlewares
//allows us to send body of a request as json
app.use(express.json())

//logger which logs routes in console
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})


//routes-all the routes imported from "post.js" of routes folder
//app.use(postRoutes)--all the routes are imported to app
//app.use('/api/posts',postRoutes)--all the routes will be executed after the specific path b/w ''
app.use('/api/posts',postRoutes)
//user Routes
app.use('/api/user',userRoutes)

// route handler
/*app.get('/',(req,res)=>{
    res.json({msg:'Welcome to the app'})
})
*/

//connect to db - asynchronous in nature
//we listen to requests only after connecting to db
mongoose.connect(process.env.MONGO_URI)
 .then(()=>{
    //listen for requests
    app.listen(process.env.PORT,()=>{
        console.log('connected to db & listening on port',process.env.PORT)
    })
 })
 .catch ((error)=>{
    console.log(error)
 })
