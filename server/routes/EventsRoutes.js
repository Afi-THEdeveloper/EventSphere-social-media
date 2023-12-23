const express = require('express')
const eventRouter = express.Router()
const eventController = require('../controllers/Event/EventController')
const eventAuth = require('../middlewares/EventAuthMiddleware')
const {uploadEventProfile,resizeEventProfile,uploadEventPost, processEventPost} = require('../middlewares/imgUploads')


eventRouter
    .post('/registerEvent', eventController.registerEvent)
    .post('/verifyEventOtp', eventController.verifyEventOtp)
    .post('/ResendOtp', eventController.ResendOtpEvent)
    .post('/verifyEventLogin', eventController.verifyEventLogin)
    .post('/updateEvent', eventAuth, eventController.updateEvent)
    .post('/updateEventProfile', eventAuth,uploadEventProfile,resizeEventProfile, eventController.updateEventProfile)
    .get('/getEventPosts', eventAuth, eventController.getEventPosts)
    .post('/addPost', eventAuth, uploadEventPost,processEventPost, eventController.addPost)
    .post('/deletePost', eventAuth, eventController.deletePost)
    .post('/addStory', eventAuth, uploadEventPost, processEventPost, eventController.addStory)
    .get('/getStory', eventAuth, eventController.getEventStory)


module.exports = eventRouter   






