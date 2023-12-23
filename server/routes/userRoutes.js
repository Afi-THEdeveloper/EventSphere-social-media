const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/User/userController')
const commentController = require('../controllers/User/CommentController')
const userAuth = require('../middlewares/UserAuthMiddleware')

userRouter.post('/register', userController.register)
    .post('/VerifyOtp', userController.VerifyOtp)
    .post('/Login', userController.loginUser)
    .post('/ResendOtp', userController.ResendOtp)
    .get('/getEventPost', userAuth, userController.getEventPosts)
    .post('/likePost', userAuth, userController.likePost)
    .post('/UnlikePost', userAuth, userController.UnlikePost)
    .get('/getStories', userAuth, userController.getStories)
    
    .post('/comments/:postId/createComment',userAuth, commentController.createComment)
    .get('/comments/:postId/comments',userAuth, commentController.getAllComments)
    .put('/comments/:commentId/reply',userAuth, commentController.addReply)
    .delete('/comments/:commentId/replies/:replyId',userAuth, commentController.deleteReply)


module.exports = userRouter