// 登陆前
export const POST_LOGIN = "/login";
export const POST_REGISTER = "/register";

//登陆后
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

// 登陆前
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
export const GET_ARTICLE_PAGE_STATUS = '/article/page/status'

export const GET_HOTTEST_ARTICLE_CHANNELS = '/hottest/article-channels'
export const GET_HOTTEST_TAGS = '/hottest/tags'

export const GET_ARTICLE_BY = "/article/by";
export const GET_RECOMMEND_ARTICLE = "/article/recommend";
export const GET_HOTTEST_ARTICLE = "/article/hottest";
export const GET_NEWEST_ARTICLE = "/article/newest";
export const GET_ARTICLE = '/article'
export const GET_GUESS_LIKE_ARTICLE = '/article/guessLike'
export const GET_ARTICLE_COMMENT = '/article/comment'
export const GET_ARTICLE_SUB_COMMENT_MORE = '/article/subComment'
export const GET_EVENTS_DESCRIPTION_LESS = "/events/description/less";
export const GET_EVENTS_DESCRIPTION = "/events/description";
export const GET_COMMUNITY_EVENT = "/event/community";

export const GET_RECOMMEND_LESSON = "/lesson/recommend";
export const GET_RECOMMEND_CAROUSEL_INFO = "/carousel/recommend";

// 登陆后
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
