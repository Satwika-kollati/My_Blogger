import { createContext, useReducer } from "react"

//creating a new context and exporting it
export const PostsContext = createContext()

//state-represents the previous state before we're making changes
//the state here is the object with posts property(2nd arg)
//action-object passed to dispatch function - with type,payload props
export const PostsReducer = (state,action) => {
    switch(action.type){
        //all these action keep only our 'local state' in sync with database
        case 'SET_POSTS' :
            //in each case we return the new state i.e,updated object
            return {
                posts:action.payload
            }
        case 'CREATE_POST' :
            //here payload would be a single post, so breaking our previous state body and adding it to payload
            //...state.Posts--> breaking our previous state 
            //this add the new post at stating of the page
            /*return {
                posts:[action.payload, ...state.posts]
            }
            */
            //to keep the new post in new sorted order- without refreshing
            const newPost = action.payload;
            const sortedPosts = [...state.posts, newPost].sort((a, b) => a.id - b.id);
            return {
              posts: sortedPosts,
            };
        case 'DELETE_POST':
            //the function return yes if the post id is not equal to id of the post to be deleted
            //so if return no that post will not be considered
            return{
                posts: state.posts.filter((post)=> post._id!== action.payload._id)
            }
        default :
            return state
    }
}

//we provide this context to application conmponent tree so that our components can access it
//so we create a context provider component
//....
//we destructure the children property from the props in this component
//the CHILDREN property represents whatever templates/components whatever the PostContextProvider(or whatever components) wraps
//so in this case it represnts the app component (in index.js file)
export const PostContextProvider = ({ children })=>{
    //useReducer hook
    //1st argument-->PostsReducer=Reducer function name
    //2nd argument-->Initial values for the state i.e.,object with posts property-initially null
    //we get back a state value from this hook and the function dispatch updates the state value
    const [state,dispatch] = useReducer(PostsReducer,{
        posts:null
    })

    //to update the state value we call the dispatch function
    //arguments:objects with type property:describes the state change Ex:'CREATE_POST','SET_POST'...
    //payload property-the data we need to make the change,ex:array of post objects
    //the arguments inside a dispatch function:known as 'action'
    // dispatch({type:'SET_POST',payload:[{},{}]})

    //when we call the dispatch function-the reducer function is also envoked
    //the dispatch function passes its action to reducer function

    //we return a template inside this function
    return(
        //this is component given to us by the context we created
        //it wraps whatever parts/components of our application that needs access to the context
        //so since the children has the whole App component,all the components of our app will have access to this context
        //....
        //initially the context has no state value
        //Ex:<PostsContext.Provider value={{posts : []}}>
        //In above example,we provide value to it which is posts object (an empty array)
        //Now this object will be available to all children components-which in our case are all components
        //....
        //But hardcoding values is not recommended...we should provide dynamic state value
        //we can use useState hook but we use useReducer here
        
        //we make sure the state and dispatch are available in all the components-send them as props in an object
        //breaking down state into its properties i.e,a posts
        <PostsContext.Provider value={{...state,dispatch}}>
           {/* we want to wrap our whole application inside this context provider */}
           {/* so we do it by importing this in index.js */}
           {children}
        </PostsContext.Provider>
    )
}