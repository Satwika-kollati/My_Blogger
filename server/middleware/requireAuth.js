const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')

const requireAuth = async(req,res,next) => {
     
    //verify authentication
    //the headers have many properties like Content-type,headers etc.
    //we check if the authorisation prop has jwt/not
    const {authorization} = req.headers 

    if (!authorization) {
        res.status(401).json({error:'Authorization Token Required'})
    }

    //the token received from authorisation property will be like 'Bearer  djscnjsk234r.djkcdsjbmjjdfncsj45rtnrdsjn.cfskjnjmdkbfsbd42dsnk' 
    //the second part is JWToken, so we need to split the string
    //so splitting by space and taking the 2nd ele-index-1
    const token = authorization.split(' ')[1]

    try{
        //we grab the id from payload property from this verify function
        const {_id} = jwt.verify(token,process.env.SECRET)

        //attaching the user prop to request so when this req is proccessed to next function after this middleware, this user prop can be used
        //we want to take only id prop,not the entire document so '.select'
        req.user = await User.findOne({ _id }).select('_id')
        //to fire next handler function
        next()
    }
    catch(error){
        //if verification fails
        console.log(error)
        res.status(401).json({error: 'Request is not Authorised'})
    }

}

module.exports = requireAuth