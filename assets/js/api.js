export const IS_DEV = process.env.NODE_ENV === 'development'
export const SOCKET_URL = IS_DEV ? 'http://localhost:8081' : 'http://47.103.82.183:8081'
export const SOCKET_ARTICLE = SOCKET_URL + '/article?user='
export const HOST = IS_DEV ? 'http://localhost:1999' : 'http://47.103.82.183:1999'

// 登陆前
export const POST_LOGIN = "/login";
export const POST_REGISTER = "/register";

//登陆后
export const POST_CHECK_CREATE_QUESTION = '/check/create-question'
export const POST_CHECK_REMOVE_DRAFT = '/check/removeDraft'
export const POST_CHECK_SAVE_TO_DRAFT = '/check/saveToDraft'
export const POST_CHECK_ANSWER_QUESTION = '/check/answer-question'
export const POST_CHECK_DELETE_IMAGE = '/check/delete/img'
export const POST_CHECK_UPLOAD_IMAGE = '/check/upload/img'
export const POST_CHECK_FOCUS_QUESTION = '/check/focus/question'
export const POST_CHECK_COLLECT_QUESTION = '/check/collect/question'
export const POST_CHECK_GOOD_ANSWER = '/check/good/answer'
export const POST_CHECK_BAD_ANSWER = '/check/bad/answer'
export const POST_CHECK_GOOD_QUESTION = '/check/good/question'
export const POST_CHECK_BAD_QUESTION = '/check/bad/question'
export const POST_CHECK_FOCUS_ARTICLE_CHANNEL = '/check/channel/focus'
export const POST_CHECK_FOCUS_TAG = '/check/focus/tag'
export const POST_FOCUS_AUTHOR = '/check/focus/user'
export const POST_UNFOCUS_AUTHOR = '/check/unfocus/user'
export const POST_CHECK_ARTICLE_OPTION = '/check/article/option'
export const POST_CHECK_COLLECT_ARTICLE = '/check/article/collect'
export const POST_CHECK_GOOD_ARTICLE = '/check/article/good'
export const POST_CHECK_GOOD_COMMENT = '/check/good/comment'
export const POST_CHECK_SUB_COMMENT_COMMIT = '/check/subComment/commit'
export const POST_CHECK_COMMENT_COMMIT = '/check/comment/commit'
export const POST_CHECK_READ_ARTICLE_NOTIFICATION =
  "/check/new/notification/articles/read";
export const POST_CHECK_READ_CHAT_NOTIFICATION =
  "/check/new/notification/chat/read";
export const POST_CHECK_READ_GOOD_NOTIFICATION =
  "/check/new/notification/good/read";
export const POST_CHECK_READ_FANS_NOTIFICATION =
  "/check/new/notification/fans/read";
export const POST_CHECK_READ_ALL_ARTICLE_NOTIFICATION =
  "/check/new/notification/articles/read/all";
export const POST_CHECK_READ_ALL_CHAT_NOTIFICATION =
  "/check/new/notification/chat/read/all";
export const POST_CHECK_READ_ALL_GOOD_NOTIFICATION =
  "/check/new/notification/good/read/all";
export const POST_CHECK_READ_ALL_FANS_NOTIFICATION =
  "/check/new/notification/fans/read/all";
export const POST_CHECK_EVENT = '/check/event/commit'
export const POST_CHECK_FORK_NOTE = '/check/fork/note'
export const POST_CHECK_COLLECT_NOTE = '/check/collect/note'
export const POST_CHECK_COMMIT_NOTE = '/check/commit/note'
export const POST_CHECK_NEW_TOPIC = '/check/new/topic'

// 登陆前
export const GET_TOPIC_DETAIL = '/topic/detail'
export const GET_NEWEST_TOPIC = '/group/topic/newest'
export const GET_HOT_TOPIC_TODAY = '/topic/hot/today'
export const GET_ALL_GROUP = '/all/groups'
export const GET_GROUP_TOPIC_CONTENT = '/group/topic/content'
export const GET_RECOMMEND_GROUP = '/recommend/group'
export const GET_TOPIC = '/topic'
export const GET_GROUP = '/group'
export const GET_EVENT_SUM = '/event/sum'
export const GET_EVENT_IN_DAY_RANGE = '/event/in-day-range'
export const GET_TAG_STATUS = '/tag/status'
export const GET_RELAVANT_TAGS = '/tag/relevant'
export const GET_RP_BOAR_TAG = '/tag-board/tag'
export const GET_TAG_BAIKE = '/tag/baike'
export const GET_TAG_ACTIVE_INFO = '/tag/active-info'
export const GET_SIMILAR_QUESTIONS = '/similar/questions'
export const GET_ANSWER = '/answer'
export const GET_QUESTION = '/question'
export const GET_RP_BOARD_ALL = '/rp-board/all'
export const GET_TOTAL_QUESTION = '/question/total'
export const GET_RP_INCREASE_BOARD = '/rp/increase-board'
export const GET_QUESTIONS = '/questions'
export const GET_TAG_DATA_TOTAL_NUM = '/tag-data/total'
export const GET_TAG_DATA = '/tag/data'
export const GET_TAG_DATAS = '/tag/datas'
export const GET_USER_DATA = '/user/data'
export const GET_SIMILAR_TAGS = '/tag/similar'
export const GET_IS_FOCUS = '/user/isFocus'

export const GET_ARTICLE_CHANNEL = '/article/channel'
export const GET_ARTICLE_IN_CHANNEL = '/article-channel/article'
export const GET_ARTICLE_NUM_IN_CHANNEL_FILTER = '/article-channel/article-num'
export const GET_ARTICLE_TOTAL_NUM = '/article/total-num'

export const GET_HOTTEST_ARTICLE_CHANNELS = '/hottest/article-channels'
export const GET_HOTTEST_TAGS = '/hottest/tags'

export const GET_ARTICLE_BY = "/article/by";
export const GET_RECOMMEND_ARTICLE = "/article/recommend";
export const GET_HOTTEST_ARTICLE = "/article/hottest";
export const GET_NEWEST_ARTICLE = "/article/newest";
export const GET_ARTICLE = '/article'
export const GET_GUESS_LIKE_ARTICLE = '/article/guessLike'
export const GET_COMMENT = '/comment'
export const GET_SUB_COMMENT_MORE = '/subComment'
export const GET_EVENTS_DESCRIPTION_LESS = "/events/description/less";
export const GET_EVENTS_DESCRIPTION = "/events/description";
export const GET_COMMUNITY_EVENT = "/event/community";

export const GET_RECOMMEND_LESSON = "/lesson/recommend";
export const GET_RECOMMEND_CAROUSEL_INFO = "/carousel/recommend";

// 登陆后
export const GET_CHECK_FAVORITE_GROUP = '/check/topic/favorite'
export const GET_CHECK_TOPIC_NUM = '/check/topic/num'
export const GET_CHECK_MY_GROUP = '/check/my/group'
export const GET_CHECK_MY_FOCUS_GROUP = '/check/my-focus/group'
export const GET_CHECK_NOTE = '/check/note'
export const GET_CHECK_NOTES = '/check/notes'
export const GET_CHECK_NOTES_NUMBER = '/check/notes/number'
export const GET_CHECK_USER_DATA_AFTER_LOGIN = "/check/user/afterLogin";
export const GET_CHECK_ARTICLE_RECOMMEND = "/check/article/recommend";
export const GET_CHECK_ARTICLE_NEWEST = "/check/article/newest";
export const GET_CHECK_ARTICLE_HOTTEST = "/check/article/hottest";
export const GET_CHECK_ATTITUDE_TO_ARTICLE = '/check/attitudeTo'
export const GET_CHECK_FOCUS_TAGS = '/check/focus/tags'
export const GET_CHECK_NEW_NOTIFICATION_NUMBER =
  "/check/new/notification/number";
export const GET_CHECK_NEW_ARTICLE_NOTIFICATION =
  "/check/new/notification/articles";
export const GET_CHECK_NEW_CHAT_NOTIFICATION = "/check/new/notification/chat";
export const GET_CHECK_NEW_GOOD_NOTIFICATION = "/check/new/notification/good";
export const GET_CHECK_NEW_FANS_NOTIFICATION = "/check/new/notification/fans";
export const GET_CHECK_CHAT_MESSAGE = "/check/chat/message";
