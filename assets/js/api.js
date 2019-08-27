export const isDev = process.env.NODE_ENV === 'development'
export const host = isDev ? 'http://localhost' : 'http://47.103.82.183'

export const SOCKET_ARTICLE = host + ':8081/article?user='

//登陆前
export const POST_LOGIN = "/login";
export const POST_REGISTER = "/register";

//登陆后
export const POST_FOCUS_AUTHOR = '/check/focus/user'
export const POST_UNFOCUS_AUTHOR = '/check/unfocus/user'
export const POST_CHECK_ARTICLE_OPTION = '/check/article/option'

export const POST_CHECK_READ_ARTICLE_NOTIFICATION = '/check/new/notification/articles/read'
export const POST_CHECK_READ_CHAT_NOTIFICATION = '/check/new/notification/chat/read'
export const POST_CHECK_READ_GOOD_NOTIFICATION = '/check/new/notification/good/read'
export const POST_CHECK_READ_FANS_NOTIFICATION = '/check/new/notification/fans/read'
export const POST_CHECK_READ_ALL_ARTICLE_NOTIFICATION = '/check/new/notification/articles/read/all'
export const POST_CHECK_READ_ALL_CHAT_NOTIFICATION = '/check/new/notification/chat/read/all'
export const POST_CHECK_READ_ALL_GOOD_NOTIFICATION = '/check/new/notification/good/read/all'
export const POST_CHECK_READ_ALL_FANS_NOTIFICATION = '/check/new/notification/fans/read/all'

//登陆前

export const GET_USER_DATA = '/user/data'
export const GET_IS_FOCUS = '/user/isFocus'

export const GET_ARTICLE_BY = '/article/by'
export const GET_RECOMMEND_ARTICLE = "/article/recommend";
export const GET_HOTTEST_ARTICLE = '/article/hottest'
export const GET_NEWEST_ARTICLE = '/article/newest'
export const GET_ARTICLE = '/article'

export const GET_EVENTS_DESCRIPTION_LESS = '/events/description/less';
export const GET_EVENTS_DESCRIPTION = '/events/description';
export const GET_COMMUNITY_EVENT = '/event/community'

export const GET_RECOMMEND_LESSON = '/lesson/recommend'
export const GET_RECOMMEND_CAROUSEL_INFO = '/carousel/recommend'

//登陆后

export const GET_CHECK_USER_DATA_AFTER_LOGIN = "/check/user/afterLogin";

export const GET_CHECK_ARTICLE_RECOMMEND = "/check/article/recommend";
export const GET_CHECK_ARTICLE_NEWEST = '/check/article/newest'
export const GET_CHECK_ARTICLE_HOTTEST = '/check/article/hottest'

export const GET_CHECK_NEW_NOTIFICATION_NUMBER = '/check/new/notification/number'
export const GET_CHECK_NEW_ARTICLE_NOTIFICATION = '/check/new/notification/articles'
export const GET_CHECK_NEW_CHAT_NOTIFICATION = '/check/new/notification/chat'
export const GET_CHECK_NEW_GOOD_NOTIFICATION = '/check/new/notification/good'
export const GET_CHECK_NEW_FANS_NOTIFICATION = '/check/new/notification/fans'
export const GET_CHECK_CHAT_MESSAGE = '/check/chat/message'
