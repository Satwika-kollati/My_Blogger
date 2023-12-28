const express = require('express')
const router = express.Router()
const {
    getPosts,
    getPost,
    createPost,
    deletePost,
    updatePost
} = require('../controllers/postControllers ')
const requireAuth = require('../middleware/requireAuth')

//firing the middleware function before any further requests are sent for the following routes
//basically it checks the user to be authenticated
router.use(requireAuth)


//GET all posts
router.get('/',getPosts)
/*router.get('/',(req,res)=>{
    res.json({mssg:"GET all posts"})
})
*/

//GET a single post
router.get('/:id',getPost)
/*router.get('/:id',(req,res)=>{
    res.json({mssg:"GET a single post"})
})*/

//POST a post
router.post('/',createPost)

//DELETE a post
router.delete('/:id',deletePost)

//UPDATE a post
router.patch('/:id',updatePost)

module.exports = router