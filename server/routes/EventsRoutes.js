const express = require('express')
const eventRouter = express.Router()
const eventController = require('../controllers/Event/EventController')
const subscriptionController = require('../controllers/Event/SubscriptionController')
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
    .get('/getEventPosts', eventAuth, eventController.getEventPosts)

    .post('/addPost', eventAuth,IsPlanExpired, uploadEventPost,processEventPost, eventController.addPost)

    .post('/deletePost', eventAuth, eventController.deletePost)
    .post('/addStory', eventAuth,IsPlanExpired, uploadEventPost, processEventPost, eventController.addStory)
    .get('/getStory', eventAuth, eventController.getEventStory)
    .get('/availablePlans', eventAuth, subscriptionController.availablePlans) 
    .post('/subscribePlan', eventAuth, subscriptionController.buyPlan)
    .get('/PaymentSuccess',subscriptionController.getSuccessPage)
    .get('/PaymentError',subscriptionController.getErrorPage)

module.exports = eventRouter   






