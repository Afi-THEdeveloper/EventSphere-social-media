export const apiEndPoints = {
    //user end points
    postRegisterData : '/api/user/register',
    postRegisterOtp  : '/api/user/VerifyOtp',
    postLogin : '/api/user/Login',
    postResendOtp: '/api/user/ResendOtp',
    getFollowingposts:'/api/user/getFollowingposts',
    getEPosts:'/api/user/getEPosts',
    likePost:'api/user/likePost',
    UnlikePost:'api/user/UnlikePost',
    followEvent:'api/user/followEvent',
    unfollowEvent:'api/user/unfollowEvent',
    getStories:'api/user/getStories',
    editUser:'api/user/editUser',
    addJobProfile:'/api/user/addJobProfile',
    updateJobProfile:'/api/user/updateJobProfile',
    getContactsList:'api/user/getContactsList',
    sendNewMessage:'api/user/sendNewMessage',
    getMessages:'api/user/getMessages',
    searchEvents:'api/user/searchEvents',
    getUserNotifications:'api/user/getUserNotifications',
    clearUserNotification:'api/user/clearUserNotification',
    clearAllUserNotifications:'api/user/clearAllUserNotifications',
    getUserNotificationsCount:'api/user/getUserNotificationsCount',
    getFollowings:'api/user/getFollowings',
    getJobs:'api/user/getJobs',
    applyJob:'api/user/applyJob',
    getJobStats:'api/user/getJobStats',
    




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
    getBanners:'api/admin/getBanners',
    getClientBanners:'api/admin/getClientBanners',
    addBanner:'api/admin/addBanner',
    updateBanner:'api/admin/updateBanner',
    blockBanner:'api/admin/blockBanner',
    getDashboardDetails:'api/admin/getDashboardDetails',



    
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
    getEventContacts:'api/event/getEventContacts',
    getEventMessages:'api/event/getEventMessages',
    sendMessage:'api/event/sendMessage',
    getNotifications:'api/event/getNotifications',
    clearNotification:'api/event/clearNotification',
    clearAllNotifications:'api/event/clearAllNotifications',
    getNotificationsCount:'api/event/getNotificationsCount',
    getFollowers:'api/event/getFollowers',
    addJobPost:'api/event/addJobPost',
    getJobPosts:'api/event/getJobPosts',
    editJobPost:'api/event/editJobPost',
    deleteJobPost:'api/event/deleteJobPost',
    blockJobPost:'api/event/blockJobPost',
    getAppliedUsers:'api/event/getAppliedUsers',
    userAppliedjobs:'api/event/userAppliedjobs',
    acceptJobRequest:'api/event/acceptJobRequest',
    getEventJobStats:'api/event/getEventJobStats',
    searchJob:'api/event/searchJob',
}

