const express = require('express')
const eventRouter = express.Router()
const eventController = require('../controllers/Event/EventController')
const subscriptionController = require('../controllers/Event/SubscriptionController')
const chatController = require('../controllers/chatController')
const eventAuth = require('../middlewares/EventAuthMiddleware')
const IsPlanExpired = require('../middlewares/IsPlanExpired')
const {uploadEventProfile,resizeEventProfile,uploadEventPost, processEventPost} = require('../middlewares/imgUploads')


eventRouter
    .post('/registerEvent', eventController.registerEvent)
    .post('/verifyEventOtp', eventController.verifyEventOtp)
    .post('/ResendOtp', eventController.ResendOtpEvent)
    .post('/verifyEventLogin', eventController.verifyEventLogin)
    .post('/updateEvent', eventAuth, eventController.updateEvent)
    .post('/updateEventProfile', eventAuth,uploadEventProfile,resizeEventProfile, eventController.updateEventProfile)
    .post('/getEventPosts', eventAuth, eventController.getEventPosts)
    .post('/getlikedUsers', eventAuth, eventController.getlikedUsers)

    .post('/addPost', eventAuth,IsPlanExpired, uploadEventPost,processEventPost, eventController.addPost)

    .post('/deletePost', eventAuth, eventController.deletePost)
    .post('/addStory', eventAuth,IsPlanExpired, uploadEventPost, processEventPost, eventController.addStory)
    .post('/getStory', eventAuth, eventController.getEventStory)
    .get('/availablePlans', eventAuth, subscriptionController.availablePlans) 
    .post('/subscribePlan', eventAuth, subscriptionController.buyPlan)
    .get('/PaymentSuccess',subscriptionController.getSuccessPage)
    .get('/PaymentError',subscriptionController.getErrorPage)
    .post('/getPostComments',eventAuth,eventController.getPostComments)
    .post('/EventReply',eventAuth,eventController.EventReply)
    .post('/deleteReply', eventAuth, eventController.deleteReply)

    .get('/getEventContacts', eventAuth, chatController.getEventContacts)
    .post('/getEventMessages', eventAuth, chatController.getEventMessages)
    .post('/sendMessage', eventAuth, chatController.sendMessage)

    .get('/getNotificationsCount', eventAuth,eventController.getNotificationsCount)
    .get('/getNotifications', eventAuth, eventController.getNotifications)
    .delete('/clearNotification', eventAuth, eventController.clearNotification)
    .delete('/clearAllNotifications', eventAuth, eventController.clearAllNotifications)

    .get('/getFollowers', eventAuth, eventController.getFollowers)
    .post('/addJobPost', eventAuth, eventController.addJobPost)
    .get('/getJobPosts', eventAuth, eventController.getJobPosts)
    .put('/editJobPost',eventAuth, eventController.editJobPost)
    .delete('/deleteJobPost', eventAuth, eventController.deleteJobPost)
    .patch('/blockJobPost', eventAuth, eventController.blockJobPost)
    .post('/userAppliedjobs', eventAuth, eventController.userAppliedjobs)
    .patch('/acceptJobRequest', eventAuth, eventController.acceptJobRequest)
    .post('/getEventJobStats', eventAuth, eventController.getEventJobStats)

    .post('/searchJob', eventAuth, eventController.searchJob)         


    
module.exports = eventRouter   






