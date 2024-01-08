const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/User/userController')
const commentController = require('../controllers/User/CommentController')
const chatController = require('../controllers/chatController')
const userAuth = require('../middlewares/UserAuthMiddleware')
const {uploadUserProfile,resizeUserProfile, uploadCv} = require('../middlewares/imgUploads')

userRouter.post('/register', userController.register)
    .post('/VerifyOtp', userController.VerifyOtp)
    .post('/Login', userController.loginUser)
    .post('/ResendOtp', userController.ResendOtp)
    .get('/getEPosts', userAuth, userController.getEventPosts)
    .get('/getFollowingposts', userAuth, userController.getFollowingposts)
    .post('/likePost', userAuth, userController.likePost)
    .post('/UnlikePost', userAuth, userController.UnlikePost)
    .post('/followEvent', userAuth, userController.followEvent)
    .post('/unfollowEvent', userAuth, userController.unfollowEvent)
    .get('/getStories', userAuth, userController.getStories)
    
    .post('/comments/:postId/createComment',userAuth, commentController.createComment)
    .get('/comments/:postId/comments',userAuth, commentController.getAllComments)
    .put('/comments/:commentId/reply',userAuth, commentController.addReply)
    .delete('/comments/:commentId/replies/:replyId',userAuth, commentController.deleteReply)

    .post('/editUser', userAuth, uploadUserProfile, resizeUserProfile, userController.editUser)
    .post('/addJobProfile', userAuth, uploadCv, userController.addJobProfile)
    .post('/updateJobProfile', userAuth, uploadCv, userController.updateJobProfile)

    // chats
    .get('/getContactsList', userAuth, chatController.getContactsList)
    .post('/sendNewMessage', userAuth, chatController.sendNewMessage)
    .post('/getMessages', userAuth, chatController.getMessages)


module.exports = userRouter