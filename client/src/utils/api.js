export const apiEndPoints = {
    //user end points
    postRegisterData : '/api/user/register',
    postRegisterOtp  : '/api/user/VerifyOtp',
    postLogin : '/api/user/Login',
    postResendOtp: '/api/user/ResendOtp',
    getEPosts:'/api/user/getEventPost',
    likePost:'api/user/likePost',
    UnlikePost:'api/user/UnlikePost',
    getStories:'api/user/getStories',

    //admin end points
    postLoginAdmin: '/api/admin/verifyAdmin',
    getUsers:  'api/admin/getUsers',
    blockUser: 'api/admin/blockUser',
    getPlans:  'api/admin/getPlans',
    addPlan: 'api/admin/addPlan',
    blockPlan:'api/admin/blockPlan',
    editPlan:'api/admin/editPlan',
    getEvents:'api/admin/getEvents',
    blockEvent:'api/admin/blockEvent',

    //event end points
    postEventRegisterData : 'api/event/registerEvent',
    postEventRegisterOtp  : 'api/event/verifyEventOtp',
    postEventResendOtp : 'api/event/ResendOtp',
    postEventLogin : 'api/event/verifyEventLogin',
    updateEventProfile:'api/event/updateEventProfile',
    updateEvent:'api/event/updateEvent',
    addPost:'api/event/addPost',
    deleteEventPost:'api/event/deletePost',
    getEventPosts:'api/event/getEventPosts',
    addStory:'api/event/addStory',
    getEventStory:'api/event/getStory',
}

