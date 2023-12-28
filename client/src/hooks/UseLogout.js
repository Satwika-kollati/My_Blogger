import { UseAuthContext } from "./UseAuthContext"
import { UsePostsContext } from "./UsePostsContext"

//basically to logout
//1.we need to remove the jwt token stored in local storage
//2.we need to change the global state by using dispatch function
//so,ne need to send any request to api
export const useLogout  = () => {
    const { dispatch } = UseAuthContext()

    //we rename the dispatch function
    const { dispatch : postsDispatch } = UsePostsContext()

    const logout = () => {
        //remove user form localstorage
        localStorage.removeItem('user')
        
        //update global state
        dispatch({type:'LOGOUT'})

        //when we logout we want to clear the global posts state so any new posts recently added by another user are not to be seen
        //so we set global state with posts:null
        postsDispatch({type:'SET_POSTS',payload: null})
    }

    return {logout}
}

