import { UsePostsContext } from '../hooks/UsePostsContext'
import { UseAuthContext } from '../hooks/UseAuthContext'

//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const postDetails = ({post})=>{
    //getting dispatch from that hook
    const {dispatch} = UsePostsContext()
    //getting user form the hook
    const {user} = UseAuthContext()

    const handleClick = async ()=>{

        //if user is not authenticated,we don't want to delte any post
        if(!user){
            return
        }

        //fetch adress for delete
        //second arg-object that says the method of request 
        const response = await fetch(`${process.env.REACT_APP_URL}/api/posts/` + post._id ,{
            method:'DELETE',
            headers:{
                'Authorization' : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(response.ok){
            dispatch({type:'DELETE_POST',payload:json})
        }
    }
    return(
        <div className="post-details">
            <h4>{post.id}.{post.title}</h4>
            <p><strong>Date : </strong>{post.date}</p>
            <p><strong>Content : </strong>{post.content}</p>
            <p>Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined delete-button" onClick={handleClick}>Delete</span>
        </div>
    )
}

export default postDetails