const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')

//function to create jwt tokens
//we can actually use a method called sign to create and sign a token
//but we're writing a function - since can be used in multiple fn's -login,signup
//argument-id--> mongodb id to be used in paylod
const createToken = (_id) => {
    //1st argument --> payload with properties
    //2nd argument --> JWT SECRET
    //3rd arguments --> options Ex:expiresIn - so the user will be logged in for 3 days
    return jwt.sign({_id : _id},process.env.SECRET,{expiresIn : '3d'})
}

//login user
const loginUser = async (req,res) => {
    const {email,password} = req.body
    try{
        const user = await User.login(email,password)

        const token = createToken(user._id)

        res.status(200).json({email,token})
        
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//signup user
const signupUser = async (req,res) => {
    const {email,password} = req.body
    
    try{
        //calling signup method defined userSchema.js
        const user = await User.signup(email,password)
        
        //create a token
        const token = createToken(user._id)

        res.status(200).json({email,token})
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {loginUser,signupUser}