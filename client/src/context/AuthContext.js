import { createContext,useReducer,useEffect } from "react"

export const AuthContext = createContext()

export const authReducer = (state,action) => {
    switch(action.type) {
        case 'LOGIN' :
            return {user: action.payload}
        case 'LOGOUT' :
            return {user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state,dispatch] = useReducer(authReducer,{
        user:null
    })

    //so to set the initial auth state,
    //i.e,when page is refreshed ,the user data is stored in local storage , but the auth context state object will be null (so thinking user is not logged in)
    //2nd argument --> empty dependency array
    //below line tells the useEffect function to be fired only once when the component first renders
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if(user){
            dispatch({type : 'LOGIN',payload: user})
        }
    },[])

    //so every time the state changes,we can view the new state in console
    console.log('AuthContext State: ',state)

    return(
        <AuthContext.Provider value={{...state,dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}