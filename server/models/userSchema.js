const mongoose = require('mongoose')
//bcrypt used for hashing
const bcrypt = require('bcrypt')
//salt-a random string of characters added to password before hashing
//so two same passwords when different salts are added to them produces different hashed products-more security
//validator package
const validator = require('validator')


const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type : String,
        required: true,
        unique: true
    },
    password:{
        type : String,
        required: true,
    }
})


//we create a STATIC SIGN-UP METHOD for user moder similar to those .create,.find methods
//so whenever we want to signup a new user,we then use that method
//we use regular function instead of => function cause we're using 'this' keyword
userSchema.statics.signup = async function (email,password) {

    //validation
    if(!email || !password){
        throw Error('All fileds are mandatory')
    }
    if(!validator.isEmail(email)){
        throw Error('Please enter a Valid Email')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Please give a Strong Password.The Password must contain Atleast One capital letter,Atleast one special character, Atleast one number')
    }

    //generally we use User.findOne,but here the model is not yet exported,so 'this'-indicates User Model
    const exists = await this.findOne({email})
    if(exists){
        //here we can't do res.status.... beacuse we don't have access to res
        //so instead we throw an error and it can be caught when we use this signup method 
        throw Error('Email already in use')
    }

    //generate salt
    //argument-no.of rounds or cost of salt
    //the high the number-the longer it takes for hakers to hack it-but the signup time also increases
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)

    //document to be created in db-object with password property's value->hash
    const user = await this.create({ email, password:hash })

    return user
}

//static method for login logic
userSchema.statics.login = async function (email,password) {
    //if email and password null
    if(!email || !password){
        throw Error('All fileds are mandatory')
    }

    //if user with email exists/not
    const user = await this.findOne({email})
    if(!user){
       throw Error('No user with the given Email Id') 
    }

    //check password is correct/not
    //bcrypt method compare - compares hashed version of this password argument with hashed password in db
    const match = await bcrypt.compareSync(password,user.password)
    if(!match){
        throw Error('Incorrect password')
    }

    //if everything is correct
    return user
}


module.exports = mongoose.model('User',userSchema)