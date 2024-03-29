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
    .post('/verifyEmail', userController.verifyEmail)
    .put('/resetPassword', userController.resetPassword)
    .get('/getEPosts', userAuth, userController.getEventPosts)
    .get('/getFollowingposts', userAuth, userController.getFollowingposts)
    .get('/searchEvents', userAuth, userController.getEvents)
    .post('/likePost', userAuth, userController.likePost)
    .post('/UnlikePost', userAuth, userController.UnlikePost)
    .post('/followEvent', userAuth, userController.followEvent)
    .post('/unfollowEvent', userAuth, userController.unfollowEvent)
    .get('/getStories', userAuth, userController.getStories)
    .post('/getEventPostsinUser', userAuth, userController.getEventPostsinUser)
    .post('/getEventStoryinUser', userAuth, userController.getEventStoryinUser)

    .post('/createComment',userAuth, commentController.createComment)
    .get('/getAllComments/:postId',userAuth, commentController.getAllComments)
    .delete('/deleteComment',userAuth, commentController.deleteComment)
    .put('/addReply',userAuth, commentController.addReply)
    .delete('/deleteReply',userAuth, commentController.deleteReply)

    .post('/editUser', userAuth, uploadUserProfile, resizeUserProfile, userController.editUser)
    .post('/addJobProfile', userAuth, uploadCv, userController.addJobProfile)
    .post('/updateJobProfile', userAuth, uploadCv, userController.updateJobProfile)
    .get('/getFollowings', userAuth, userController.getFollowings)

    // chats
    .get('/getContactsList', userAuth, chatController.getContactsList)
    .post('/sendNewMessage', userAuth, chatController.sendNewMessage)
    .post('/getMessages', userAuth, chatController.getMessages)

    .get('/getUserNotifications', userAuth, userController.getUserNotifications)
    .delete('/clearUserNotification', userAuth, userController.clearUserNotification)
    .delete('/clearAllUserNotifications', userAuth, userController.clearAllUserNotifications)
    .get('/getUserNotificationsCount', userAuth, userController.getUserNotificationsCount)

    .get('/getJobs', userAuth, userController.getJobs)
    .post('/applyJob', userAuth, userController.applyJob)
    .get('/getJobStats', userAuth, userController.getJobStats)
    .post('/UserSearchJob', userAuth, userController.UserSearchJob)



module.exports = userRouter