export const apiEndPoints = {
    //user end points
    postRegisterData : '/api/user/register',
    postRegisterOtp  : '/api/user/VerifyOtp',
    postLogin : '/api/user/Login',
    postResendOtp: '/api/user/ResendOtp',
    getEPosts:'/api/user/getEventPost',
    likePost:'api/user/likePost',
    UnlikePost:'api/user/UnlikePost',
    followEvent:'api/user/followEvent',
    unfollowEvent:'api/user/unfollowEvent',
    getStories:'api/user/getStories',
    editUser:'api/user/editUser',
    addJobProfile:'/api/user/addJobProfile',
    updateJobProfile:'/api/user/updateJobProfile',
    

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
    getSubscriptionHistory:'api/admin/getSubscriptionHistory',

    
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
    AvailablePlans:'api/event/availablePlans',
    subscribePlan:'api/event/subscribePlan',
    getPostComments:'api/event/getPostComments',
    EventReply:'api/event/EventReply',
    deleteReply:'api/event/deleteReply',
}

