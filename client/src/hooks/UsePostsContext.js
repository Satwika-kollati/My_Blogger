import { PostsContext } from "../context/PostsContext"
import { useContext } from "react"

//hook function
//so everytime we wanna use the post data we invoke the below hookand get the context value back
export const UsePostsContext = () => {
    //so the value of PostsContext i.e, the state and dispatch are returned 
    const context = useContext(PostsContext)

    if(!context) {
        //the context can be accessed by the components wrapped inside the context provider
        //so if any components outside that component tree access it..it return null-then we throw an error
        throw Error('UsePostsContext must be used inside an PostsContextProvider')
    }

    return context
}