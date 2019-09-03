<template>
  <div ref="Index" id="index" class="default-container">
    <section class="info">
      <breadcrumb :router="breadcrumbData"></breadcrumb>
    </section>
    <section class="author-info">
      <div class="avatar">
        <img :src="authorData.avatar">
      </div>
      <div class="text">
        <div class="top-side">
          <nuxt-link class="name" :to="'/user/info?id='+authorData.authorId">{{authorData.name}}</nuxt-link>
          <div class="authentication" v-if="authorData.authentication">
            <user-authentication :text="authorData.authentication"></user-authentication>
          </div>
          <img class="rp" src="/icon/rp.png">
          <span class="prestige">{{$formatNumber(authorData.prestige)}}</span>
          <button class="focus" @click="focus">{{isFocus?'取消关注':'关注作者'}}</button>
        </div>
        <p class="time">{{$formatDate(article.datetime)}}发布</p>
      </div>
    </section>
    <section class="article-content" ref="rightSide">
      <div ref="content" class="left-side">
        <md-render :article="article"></md-render>
        <section class="like-article">
          <m-button class="good" :style="{'good-active':isGood}" :callback="good">{{isGood?'已赞':'赞'}}{{$formatNumber(article.goodNum)}}</m-button>
          <m-button class="collect" :style="{'collect-active':isCollect}" :callback="collect">{{isCollect?'已收藏':'收藏'}}{{$formatNumber(article.collectNum)}}</m-button>
        </section>
      </div>
      <div class="right-side">
        <div ref="index" class="index" :style="indexStyle">
          <h3>目录</h3>
          <div ref="index-component" class="index-component">
            <md-index></md-index>
          </div>
        </div>
      </div>
    </section>
    <section ref="float-part" class="float-part" :style="{left:floatPartLeft+'px',opacity:showFloatPart?1:0}">
      <!--<section class="good-num" :class="{active:isGood}" @click="good">-->
      <!--<section class="top"></section>-->
      <!--<section class="bottom">{{$formatNumber(article.goodNum)}}</section>-->
      <!--</section>-->
      <good :number="article.goodNum" :click="good" :good="isGood"></good>
      <img class="bookmark" :class="{'img-active':isCollect}" src="/icon/bookmark.svg" @click="collect">
      <img class="arrow" src="/icon/arrow-down-white.svg" @click="toTop">
    </section>
    <section class="guess-like">
      <p class="title">你可能感兴趣的</p>
      <ul>
        <li class="item" v-for="val in guessLikeArticles">
          <a class="name" :href="'/article/'+val.id">{{val.name}}</a>
          <span class="author">{{val.author}}</span>
          <tag class="tag" :tag="tag" v-for="tag in val.tags" :key="tag"></tag>
        </li>
      </ul>
    </section>
    <section class="comments" v-show="article.comments">
      <h3 class="number">{{article.comments}}条评论</h3>
      <section class="content-part">
        <section class="comment" v-for="val in comments">
          <nuxt-link :to="'/user/'+val.authorId">
            <img :src="val.avatar">
          </nuxt-link>
          <section class="text">
            <p>
              <nuxt-link :to="'/user/'+val.authorId">
                <span class="author">{{val.author}}</span>
              </nuxt-link>
              <span class="date">{{$formatDate(val.datetime)}}</span>
            </p>
            <p class="content">{{val.content}}</p>
            <p class="good-reply">
              <img class="good-icon" @click="goodComment(val)" :class="{'active':val.isGood}" src="/icon/good-green-full.png">
              <span class="good-num">{{val.isGood?'已赞':'赞'}}{{val.goodNum>0?'x '+val.goodNum:''}}</span>
              <button class="reply" @click="reply(val)">{{val.reply?'取消回复':'回复'}}</button>
            </p>
            <section class="sub-comments" v-show="val.subComments.length>0||val.reply">
              <section class="sub-comment" v-for="v in val.subComments">
                <section class="good-part">
                  <div class="inner">
                    {{v.goodNum}}
                    <img class="good-icon" @click="goodComment(v)" :class="{'active':v.isGood}" src="/icon/good-green-full.png">
                  </div>
                </section>
                <div class="info">
                  <p class="content-part">
                    <nuxt-link v-if="v.replyTo" :to="'/user/'+v.replyToId">@{{v.replyTo}}</nuxt-link>
                    {{v.content}}
                  </p>
                  <div class="author-reply">
                    <nuxt-link :to="'/user/'+v.authorId"><span class="author">{{v.author}}</span></nuxt-link>
                    <span class="date">{{$formatDate(v.datetime)}}</span>
                    <button class="reply" @click="reply(val,v.author,v.authorId)">回复</button>
                  </div>
                </div>
              </section>
              <p class="button-group">
                <m-button class="more" :callback="fetchMoreSubComment" :param="val" v-show="val.subComments.length<val.totalSubComments">查看更多</m-button>
                <button class="reply" @click="reply(val)">{{val.reply?'取消回复':'回复'}}</button>
              </p>
              <p class="reply-input-p" v-show="val.reply">
                <textarea class="common-input comment-reply" v-model="val.replyTxt"></textarea>
                <m-button class="reply-button" :callback="postSubComment" :param="val">添加回复</m-button>
              </p>
            </section>
          </section>
        </section>
        <m-button class="fetch-comment" :callback="fetchMoreComment" v-show="comments.length<article.comments">点击加载更多</m-button>
        <section class="reply-comment">
          <section class="inner">
            <div class="avatar">
              <img :src="user?user.avatar:defaultAvatar">
            </div>
            <div class="input">
              <textarea class="common-input" rows="3" v-model="commentTxt" placeholder="说话文明礼貌"></textarea>
              <m-button class="button" :callback="postComment">发布评论</m-button>
            </div>
          </section>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import {
    GET_ARTICLE,
    GET_ARTICLE_COMMENT,
    GET_ARTICLE_SUB_COMMENT_MORE,
    GET_CHECK_ATTITUDE_TO_ARTICLE,
    GET_GUESS_LIKE_ARTICLE,
    GET_IS_FOCUS,
    GET_USER_DATA,
    POST_CHECK_COMMENT_COMMIT,
    POST_CHECK_GOOD_ARTICLE,
    POST_CHECK_GOOD_COMMENT_IN_ARTICLE,
    POST_CHECK_SUB_COMMENT_COMMIT,
    POST_FOCUS_AUTHOR,
    POST_UNFOCUS_AUTHOR
  } from "../../../assets/js/api";
  import MdRender from "../../../components/MdRender";
  import Breadcrumb from "../../../components/Breadcrumb";
  import UserAuthentication from "../../../components/UserAuthentication";
  import {
    COLLECT_ARTICLE,
    DEFAULT_LAYOUT_SCROLL_TO,
    eventBus,
    ON_DEFAULT_LAYOUT_SCROLL,
    ON_MD_INDEX_CHANGE_TITLE,
    SHOW_LOGIN__CARD,
    SUCCESS_LOGIN
  } from "../../../assets/js/event-bus";
  import MdIndex from "../../../components/MdIndex";
  import MButton from "../../../components/MButton";
  import Tag from "../../../components/Tag";
  import Good from "../../../components/Good";

  let commentsPage = 1
  const subCommentsPage = {}, commentPageSize = 10, subCommentPageSize = 4

  export default {
    name: "index",
    components: {Good, Tag, MButton, MdIndex, UserAuthentication, Breadcrumb, MdRender},
    props: {},
    head() {
      return {
        title: this.article.name + ' - 个人文章 - SegmentFault 思否'
      }
    },
    async asyncData({app, params}) {
      const article = await app.$axios.$get(GET_ARTICLE, {
        params: {
          id: params.id
        }
      })
      const breadcrumbData = [
        {
          text: '专栏',
          href: '/article-channels'
        }
      ]
      if (article.aricleChannelName) {
        breadcrumbData.push({
          text: article.aricleChannelName,
          href: '/article-channel/' + article.aricleChannelId
        })
      }
      breadcrumbData.push({
        text: '文章详情'
      })
      const [authorData, comments, guessLikeArticles] = await Promise.all([
        app.$axios.$get(GET_USER_DATA + '?id=' + article.authorId),
        app.$axios.$get(GET_ARTICLE_COMMENT + '?articleId=' + article.id + '&&page=0&&size=' + commentPageSize),
        app.$axios.$get(GET_GUESS_LIKE_ARTICLE + '?by=' + article.id)
      ])
      comments.forEach(val => {
        val.replyTxt = ''
        val.reply = false
      })
      return {article, breadcrumbData, authorData, comments, guessLikeArticles}
    },
    data() {
      return {
        showFloatPart: false,
        isFocus: false,
        isGood: false,
        isCollect: false,
        indexStyle: {
          top: 0,
          left: '0',
          transform: '',
          position: 'static',
          width: '100%'
        },
        offsetTop: 0,
        floatPartLeft: 0,
        commentTxt: '',
        defaultAvatar: require('static/icon/user.png')
      }
    },
    watch: {},
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      fetchMoreComment(finish) {
        this.$axios.$get(GET_ARTICLE_COMMENT, {
          params: {
            page: commentsPage++,
            size: commentPageSize,
            articleId: this.article.id
          }
        }).then(res => {
          res.forEach(val => this.comments.push(val))
        })
      },
      fetchMoreSubComment(comment, finish) {
        const page = subCommentsPage[comment.id]
        if (page === undefined || page === null) {
          subCommentsPage[comment.id] = 1
        }
        this.$axios.$get(GET_ARTICLE_SUB_COMMENT_MORE, {
          params: {
            page: subCommentsPage[comment.id]++,
            commentId: comment.id,
            size: subCommentPageSize
          }
        }).then(res => {
          res.forEach(val => comment.subComments.push(val))
          finish()
        })
      },
      postSubComment(comment, finish) {
        this.$axios.$post(POST_CHECK_SUB_COMMENT_COMMIT, {
          replyTxt: comment.replyTxt,
          replyTo: comment.replyTo,
          replyId: comment.replyId
        }).then(() => {
          const subComment = {
            author: this.user.name,
            authorId: this.user.id,
            content: comment.replyTxt.replace(/^@.*\s/, ''),
            datetime: new Date().toString(),
            replyTo: comment.replyTo,
            replyToId: comment.replyToId,
            goodNum: 0,
          }
          comment.replyTxt = ''
          comment.replyTo = undefined
          comment.reply = false
          comment.replyToId = undefined
          comment.subComments.push(subComment)
          finish()
        })
      },
      postComment(finish) {
        this.$axios.$post(POST_CHECK_COMMENT_COMMIT, this.commentTxt).then(() => {
          this.comments.push({
            content: this.commentTxt.replace(/^@.*\s/, ''),
            author: this.user.name,
            authorId: this.user.id,
            datetime: new Date().toString(),
            subComments: [],
            goodNum: 0,
            avatar: this.user.avatar
          })
          this.commentTxt = ''
          finish()
        })
      },
      goodComment(comment) {
        this.$axios.$post(POST_CHECK_GOOD_COMMENT_IN_ARTICLE + '?commentId=' + comment.id, undefined).then(() => {
          comment.isGood = !comment.isGood
          if (comment.isGood) {
            comment.goodNum++
          } else {
            comment.goodNum--
          }
        })
      },
      reply(comment, replyTo, id) {
        comment.replyTo = replyTo
        comment.replyToId = id
        if (replyTo) {
          comment.reply = true
          comment.replyTxt = '@' + replyTo + ' '
        } else {
          comment.reply = !comment.reply
          comment.replyTo = undefined
          comment.replyTxt = ''
        }
        this.$forceUpdate()
      },
      focus() {
        if (!this.user) {
          eventBus.$emit(SHOW_LOGIN__CARD)
          return
        }
        let url = POST_FOCUS_AUTHOR
        let bool = true
        if (this.isFocus) {
          url = POST_UNFOCUS_AUTHOR
          bool = false
        }
        this.$axios.post(url + '?id=' + this.article.authorId).then(() => this.isFocus = bool)
      },
      toTop() {
        const indexRef = this.$refs.Index
        eventBus.$emit(DEFAULT_LAYOUT_SCROLL_TO, indexRef.offsetTop)
      },
      good(finish) {
        this.$axios.$post(POST_CHECK_GOOD_ARTICLE, undefined, {
          params: {
            articleId: this.article.id
          }
        }).then(() => {
          this.isGood = !this.isGood
          if (this.isGood) {
            this.article.goodNum++
          } else {
            this.article.goodNum--
          }
          finish()
        })
      },
      collect() {
        eventBus.$emit(COLLECT_ARTICLE, this.article)
        /* this.$axios.$post(POST_CHECK_COLLECT_ARTICLE, undefined, {
           params: {
             articleId: this.article.id
           }
         }).then(() => {
           this.isCollect = !this.isCollect
         })*/
      },
      async fetchAttitudeToArticle() {
        [this.isGood, this.isCollect] = await this.$axios.$get(GET_CHECK_ATTITUDE_TO_ARTICLE, {
          params: {
            articleId: this.article.id
          }
        })

      },
      async fetchComments(finish) {
        if (this.article.comments <= this.comments.length) {
          finish()
          return
        }
        const res = await this.$axios.$get(GET_ARTICLE_COMMENT, {
          params: {
            articleId: this.article.id,
            page: commentsPage++,
            size: commentPageSize
          }
        })
        res.forEach(val => this.comments.push(val))
        finish()
      },
      async fetchSubComments(comment, finish) {
        if (comment.totalSubComments <= comment.subComments.length) {
          finish()
          return
        }
        const res = await this.$axios.$get(GET_ARTICLE_SUB_COMMENT_MORE, {
          params: {
            commentId: comment.id,
            page: subCommentsPage[comment.id]++,
            size: subCommentPageSize
          }
        })
        res.forEach(val => comment.subComments.push(val))
        finish()
      },
    },
    async mounted() {
      let isFixed = false
      const IndexRef = this.$refs.Index
      const IndexHeight = IndexRef.getBoundingClientRect().height
      const floatPart = this.$refs['float-part']
      const floatPartHeight = floatPart.getBoundingClientRect().height
      const indexComponent = this.$refs['index-component']
      const indexComponetHeight = indexComponent.getBoundingClientRect().height
      const indexRef = this.$refs.index
      const content = this.$refs.content
      const contentHeight = content.getBoundingClientRect().height - 30
      const contentLeft = content.getBoundingClientRect().left
      const indexHeight = indexRef.getBoundingClientRect().height
      const indexScrollHeight = indexRef.scrollHeight
      const rightSide = this.$refs.rightSide
      const indexLeft = indexRef.getBoundingClientRect().left
      const indexWidth = indexRef.getBoundingClientRect().width
      const onScrollCallback = (toTop) => {
        // console.log((toTop + window.innerHeight / 2 + floatPartHeight) + '  ' + (IndexHeight + IndexRef.offsetTop))
        if (toTop + window.innerHeight / 2 + floatPartHeight >= IndexHeight + IndexRef.offsetTop) {
          this.showFloatPart = false
        } else {
          this.showFloatPart = toTop - IndexRef.offsetTop >= 100
        }
        this.offsetTop = toTop - rightSide.offsetTop
        if (this.offsetTop + indexHeight >= contentHeight) {
          this.offsetTop = contentHeight - indexHeight
          this.indexStyle.position = 'absolute'
          this.indexStyle.left = 0
          this.indexStyle.top = this.offsetTop + 'px'
          this.indexStyle.width = '100%'
          isFixed = false
        } else if (this.offsetTop < 0) {
          this.offsetTop = 0
          this.indexStyle.position = 'static'
          isFixed = false
          this.indexStyle.width = '100%'
        } else {
          if (isFixed) {
            return
          }
          this.indexStyle.position = 'fixed'
          this.indexStyle.left = indexLeft + 'px'
          this.indexStyle.top = 0
          this.indexStyle.width = indexWidth + 'px'
          isFixed = true
        }
      }
      eventBus.$on(ON_DEFAULT_LAYOUT_SCROLL, onScrollCallback)
      eventBus.$on(ON_MD_INDEX_CHANGE_TITLE, (newElOffsetTop, newElHeight) => {
        const containerScrollTop = indexComponent.scrollTop
        // console.log(containerScrollTop + '  ' + newElOffsetTop + '  ' + newElHeight + '  ' + indexComponetHeight)
        let newPosition
        if (newElOffsetTop > containerScrollTop + indexComponetHeight) {
          newPosition = newElOffsetTop + newElHeight
          indexComponent.scrollTo(0, newPosition > indexScrollHeight ? indexScrollHeight : newPosition)
        } else if (newElOffsetTop < containerScrollTop) {
          newPosition = newElOffsetTop - newElHeight * 3
          indexComponent.scrollTo(0, newPosition >= 0 ? newPosition : 0)
        }
      })
      eventBus.$on(SUCCESS_LOGIN, () => {
        this.fetchAttitudeToArticle()
      })
      this.floatPartLeft = contentLeft - 10 - floatPart.getBoundingClientRect().width
      this.isFocus = await this.$axios.$get(GET_IS_FOCUS, {
        params: {
          id: this.user ? this.user.id : -1,
          targetId: this.article.authorId
        }
      })
      if (this.user) {
        this.fetchAttitudeToArticle()
      }
    },
    created() {
    },
    destroyed() {
      eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL)
      eventBus.$off(ON_MD_INDEX_CHANGE_TITLE)
      eventBus.$off(SUCCESS_LOGIN)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/var";

  #index {
    padding-top: 10px;

    .info {
      margin-bottom: 10px;
    }

    .author-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }

      .text {
        flex-grow: 1;
        font-size: 1.4rem;
        margin-left: 5px;
        line-height: 1.5;

        .top-side {
          display: flex;
          align-items: center;

          .name {
            color: $green;
            font-weight: 700;
          }

          .authentication {
            margin-left: 5px;
          }

          .rp {
            width: 16px;
            height: 12px;
            margin-left: 10px;
          }

          .prestige {
            color: #BF7158;
            margin-left: 5px;
          }

          .focus {
            margin-left: 10px;
            background-color: #449d44;
            border: 1px solid #398439;
            font-size: 1.2rem;
            color: white;
            padding: 0 5px;
            border-radius: 5px;

            &:hover {
              background-color: $green;
            }
          }
        }

        .time {
          color: $light-gray;
        }
      }
    }

    .article-content {
      display: flex;
      position: relative;

      .left-side {
        width: 70%;
        padding-right: 20px;
        box-sizing: border-box;
        @media(max-width: 992px) {
          width: 100%;
        }

        .like-article {
          display: flex;
          align-items: center;
          justify-content: center;

          .good, .collect {
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 1.8rem;
          }

          .good {
            margin-right: 10px;
            color: white;
            background-color: $green;

            &:hover {
              background-color: $darker-green;
            }
          }

          .good-active {
            background-color: $darker-green;
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
          }

          .collect {
            margin-left: 10px;
            color: #333;
            border: 1px solid #dddddd;

            &:hover {
              border-color: #adadad;
              background-color: #dddddd;
            }
          }

          .collect-active {
            background-color: #dddddd;
            border-color: #adadad;
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
          }
        }
      }

      .right-side {
        width: 30%;
        position: relative;
        @media(max-width: 992px) {
          display: none;
        }

        .index {
          border-left: 1px solid #eee;
          padding: 0 20px;
          box-sizing: border-box;

          h3 {
            font-size: 1.6rem;
            line-height: 40px;
            font-weight: bold;
          }

          .index-component {
            height: 334px;
            overflow: auto;
          }
        }
      }
    }

    .float-part {
      position: fixed;
      top: 50%;
      width: fit-content;
      display: flex;
      align-items: center;
      flex-direction: column;
      @media(max-width: 992px) {
        display: none;
      }

      .good-num {
        border-radius: 3px;
        border: 1px solid #eee;
        font-size: 1.6rem;
        margin-bottom: 10px;
        min-width: 38px;
        cursor: pointer;

        .top {
          display: flex;
          align-items: center;
          justify-content: center;

          &:before {
            content: '';
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-bottom-color: #333333;
          }
        }

        .bottom {
          padding: 5px 10px;
          box-sizing: border-box;
        }

        &:hover {
          color: $green;
          background-color: #eee;
          border-color: #adadad;

          .top {
            &:before {
              border-bottom-color: $green;
            }
          }
        }
      }

      .active {
        background-color: #e6e6e6;
        color: #333;
        border-color: #adadad;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);

        &:hover {
          color: #333;
          background-color: #e6e6e6;
        }
      }

      .bookmark, .arrow {
        opacity: 0.3;
        margin-bottom: 10px;
        width: 24px;
        height: 24px;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }
      }

      .img-active {
        opacity: 1;
      }

      .arrow {
        transform: rotate(180deg);
      }
    }

    .guess-like {
      .title {
        font-size: 1.8rem;
        color: #333;
        padding: 10px 0;
      }

      ul {
        margin-bottom: 20px;

        .item {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding: 5px 0 5px 15px;
          box-sizing: border-box;

          &:before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #333;
            margin-right: 10px;
          }

          a {
            font-size: 1.4rem;
            color: $green;
            margin-right: 10px;

            &:hover {
              color: $darker-green;
              text-decoration: underline;
            }
          }

          .author {
            color: #777;
            font-size: 1.3rem;
            margin-right: 10px;
          }

          .tag {
            margin-right: 5px;
          }
        }
      }
    }

    .comments {
      .number {
        font-size: 1.6rem;
        font-weight: bold;
        padding: 10px 0;
      }

      .content-part {
        .comment {
          display: flex;
          margin-bottom: 10px;
          padding-top: 10px;
          border-top: 1px solid #dddddd;

          a {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
          }

          .text {
            flex-grow: 1;
            padding-left: 20px;
            box-sizing: border-box;

            .author {
              font-size: 1.3rem;
              color: $green;
              margin-right: 10px;
            }

            .date {
              font-size: 1.2rem;
              color: #777;
            }

            .content {
              font-size: 1.4rem;
              line-height: 1.5;
              padding: 10px 0;
            }

            .good-reply {
              display: flex;
              align-items: center;

              .good-icon {
                width: 12px;
                height: 12px;
                margin-right: 10px;
                cursor: pointer;
                filter: grayscale(100%);

                &:hover {
                  filter: grayscale(0);
                }
              }

              .active {
                filter: grayscale(0);
              }

              .good-num {
                font-size: 1.3rem;
                margin-right: 10px;
                color: #777;
              }

              .reply {
                color: #777;
                font-size: 1.3rem;

                &:hover {
                  color: #333;
                }
              }
            }

            .button-group {
              padding-left: 50px;
              box-sizing: border-box;

              .more, .reply {
                font-size: 1.3rem;
                color: blue;
                margin-right: 10px;
                padding: 5px 0;
              }
            }

            .sub-comments {
              background-color: #fafafa;
              padding: 10px;
              box-sizing: border-box;
              margin-top: 20px;
              margin-bottom: 20px;

              .sub-comment {
                display: flex;
                font-size: 1.3rem;

                .good-part {
                  width: 50px;

                  .inner {
                    display: none;
                    align-items: center;
                    color: #777777;

                    .good-icon {
                      width: 12px;
                      height: 12px;
                      margin-left: 5px;
                      cursor: pointer;
                      filter: grayscale(100%);

                      &:hover {
                        filter: grayscale(0);
                      }
                    }

                    .active {
                      filter: grayscale(0);
                    }
                  }
                }

                .info {
                  flex-grow: 1;

                  .content-part {
                    line-height: 1.5;

                    a {
                      color: $green;
                      margin-right: 5px;

                      &:hover {
                        text-decoration: underline;
                      }
                    }
                  }

                  .author-reply {
                    display: flex;
                    align-items: center;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px dashed #dddddd;

                    &:before {
                      content: '';
                      width: 20px;
                      height: 1px;
                      background-color: black;
                    }

                    a {
                      width: fit-content;
                      height: fit-content;
                      display: inline-block;
                      border-radius: 0;
                      margin-left: 2px;
                    }

                    .reply {
                      display: none;
                    }
                  }
                }

                &:hover {
                  .good-part {
                    .inner {
                      display: flex;
                    }
                  }

                  .author-reply {
                    .reply {
                      display: inline-block;
                      margin-left: 10px;
                    }
                  }
                }
              }

              .reply-input-p {
                display: flex;

                .comment-reply {
                  flex-grow: 1;
                }

                .reply-button {
                  padding: 5px 10px;
                  border: 1px solid #dddddd;
                  font-size: 1.4rem;
                  margin-left: 10px;
                  white-space: nowrap;
                }
              }
            }
          }
        }

        .fetch-comment {
          display: block;
          font-size: 1.4rem;
          padding: 5px 10px;
          color: $green;
          margin: auto;
          border-radius: 5px;
          border: 1px solid #dddddd;

          &:hover {
            color: white;
            background-color: $green;
          }
        }

        .reply-comment {
          background-color: #fafafa;
          margin-top: 20px;
          border-top: 1px solid #dddddd;

          .inner {
            max-width: 1000px;
            margin: auto;
            display: flex;
            padding: 30px;
            box-sizing: border-box;
            @media(max-width: 992px) {
              max-width: 100%;
            }

            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              overflow: hidden;
            }

            .input {
              padding-left: 20px;
              box-sizing: border-box;
              display: flex;
              align-items: flex-end;
              flex-direction: column;
              flex-grow: 1;

              textarea {
                width: 100%;
                height: 50px;
              }

              .button {
                background-color: $green;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                margin-top: 10px;
                font-size: 1.4rem;
              }
            }
          }
        }
      }
    }
  }
</style>
