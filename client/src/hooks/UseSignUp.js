import { useState } from "react";
import { UseAuthContext } from "./UseAuthContext";

//we're gonna signup inside this hook,send the request to api,get a response
//if user signed up,update the auth context-user property in auth context

export const useSignup = () => {
    const [error,setError] = useState(null)
    const [isLoading,setisLoading] = useState(null)
    const {dispatch} = UseAuthContext()

    const signup = async (email,password) => {
        setisLoading(true)
        //reset the error to null each time
        setError(null)

        const response = await fetch(`${process.env.REACT_APP_URL}/api/user/signup`,{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({email,password})
        })

        const json = await response.json()

        if(!response.ok){
            setisLoading(false)
            setError(json.error)
        }
        if(response.ok){
            //save the user to local storage
            //the json has the JWT token and email sent back to us - check userController.js
            localStorage.setItem('user',JSON.stringify(json))
            
            //update AuthContext
            dispatch({type:'LOGIN',payload: json})

            setisLoading(false)
        }
    }

    return {signup,isLoading,error}
}

