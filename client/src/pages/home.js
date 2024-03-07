
import {useEffect} from 'react'
import { UsePostsContext } from '../hooks/UsePostsContext'
import { UseAuthContext } from '../hooks/UseAuthContext'

//componenst
import PostDetails from '../components/postDetails'
import PostForm from '../components/postForm'

const Home = ()=>{

    //creating local states, initially they're null
    //but if response is ok we update 'posts' with the help of 'setposts'
    //posts-local component state which store the posts
    //....
    //we have global context state for posts after creating the context
    //const [posts,setPosts] = useState(null)

    const {posts,dispatch} = UsePostsContext()
    const { user } = UseAuthContext()

    useEffect(()=>{
        const fetchPosts = async () => {
            //fetching the posts from that address
            //initaily we write it explicitly as fetch('https://localhost:4000/api/posts')
            //but since cross origin request  are not allowed. we add proxy property in package.json file 
            //so any requests not recognised by the react server sends them to proxy server and it recognises that route
            //"THIS ISSUE IS CURRENTLY FIXED ONLY FOR DEVELOPMENT"
            const response = await fetch(`${process.env.REACT_APP_URL}/api/posts`,{
                //sending the authorization property eith users token so we can verify auth in middleware
                headers : {
                    'Authorization' : `Bearer ${user.token}`
                }
            })
            //the .json() method will breakdown the response into array of objects
            const json = await response.json()

            //checking if the response is ok or not with the help of ok property
            //if we didn't get any data or if there is an error the following actions shouldn't be done so placing them in if loop
            if(response.ok){
               //update some local states
               //setPosts(json)
               //we use the dispach function to update the posts state
               //json is whole array of our posts
               dispatch({type:'SET_POSTS', payload : json})
            }
        }

        //calling that function
        //fetching the posts only if the user is authenticated-(from use auth context)
        if(user){
            fetchPosts()
        }
       
      //the dispatch function is an external function-since we're using it
      //adding iti in dependency array makes sure that whenever the dispatch function changes,whole useEffect() function is rerun
    },[dispatch,user])

    //the above empty dependency array restricts the function to be fired only once i.e, only when the component is rendered initially
    return(
        <div className="home">
            <div className="posts">
                {/* using noraml paranthesis at map (()=>()) because returning a template*/}
                {/* below line indicates that only if the posts are not null then only we map through them */}
                {posts && posts.map((post)=>(
                    //we are outputting post details for each post from postDetails component
                    //we also pass the post as property so post={post}
                    <PostDetails key={post._id} post={post} />
                ))}
            </div>
            <PostForm />
        </div>
    )
}

export default Home