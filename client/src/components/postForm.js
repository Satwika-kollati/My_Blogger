import { useState } from 'react'
import { UsePostsContext } from '../hooks/UsePostsContext'
import { UseAuthContext } from '../hooks/UseAuthContext'

const PostForm = () => {
    //getting the dispatch functin from the hook
    const {dispatch} = UsePostsContext ()
    
    const { user } = UseAuthContext()

    //setting initial value to be empty string
    const [title,setTitle] = useState('')
    const [id,setId] = useState('')
    const [date,setDate] = useState('')
    const [content,setContent] = useState('')
    const [error,setError] = useState(null)
    const [emptyFields,setEmptyFiels] = useState([])

    const handleSubmit = async(e) =>  {
        //normally the default action is to refresh the page-so we prevent it
        e.preventDefault()

        //if the user isn't logged in,we don't want to post a post at all
        if (!user){
            setError('You must be logged in')
            return
        }

        const post={id,title,date,content}

        //using the fetch api to send the post request at the required address
        //the second argument is an object with following properties
        const response = await fetch(`${process.env.REACT_APP_URL}/api/posts`,{
            method:'POST',
            //to send the post into json format
            body: JSON.stringify(post),
            //to say that content type is json
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        
        if(!response.ok){
            setError(json.error)
            setEmptyFiels(json.emptyFields)
        }
        if(response.ok){
            setError(null)
            setTitle('')
            setId('')
            setDate('')
            setContent('')
            setEmptyFiels([])
            console.log('new Post Added',json)
            //when we added a new document to database,we need to dispatch an action to update our context state & add the new post to global context state
            //i.e, the new doc is showed in page without refreshing
            //payload is the single new workout we just added-json
            dispatch({type:'CREATE_POST',payload:json})

        }
    }
    return(
        //we set onSubmit={handleSubmit}-so that funvtion is called when form is submitted
        <form className="create-form" onSubmit={handleSubmit}>
            <h3>Add a new Post</h3>
            <label>Post Title:</label>
            <input 
               type="text" 
               //when the user gives the input...it's going to fire a function
               //we take the event object...we then call the settitle function
               //the title is to be set to e.target(which is the input field),value(So value of the input field)
               onChange={(e)=>setTitle(e.target.value)}
               //with data-binding,so we set value of the input to be title
               //i.e., if we change the value of the input outside the input in state-to cahnge it's value in input
               value={title}
               //we are giving a conditional class to all these inputs
               //so if the emptyFields have title,so we give it classname-error else ''-i.e., no class
               //this is to give the input field a red border 
               className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label>ID:</label>
            <input 
               type="text" 
               onChange={(e)=>setId(e.target.value)}
               value={id}
               className={emptyFields.includes('id') ? 'error' : ''}
            />
            <label>Date:</label>
            <input 
               type="text" 
               onChange={(e)=>setDate(e.target.value)}
               value={date}
               className={emptyFields.includes('date') ? 'error' : ''}
            />
            <label>Content:</label>
            <input 
               type="text" 
               onChange={(e)=>setContent(e.target.value)}
               value={content}
               className={emptyFields.includes('content') ? 'error' : ''}
            />

            <button>Add Post</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default PostForm