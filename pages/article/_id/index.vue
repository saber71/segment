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
          <nuxt-link class="name" :to="'/user?id='+authorData.authorId">{{authorData.name}}</nuxt-link>
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
        <article-title :article="article"></article-title>
        <br/>
        <br/>
        <md-render :content="article.content" :thin="false"></md-render>
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
    <section id="comments" class="comments" v-show="article.comments">
      <comments :target-id="article.id" :comments="comments" :total="article.comments" @push="pushToComment"></comments>
    </section>
  </div>
</template>

<script>
  import {
    GET_ARTICLE,
    GET_CHECK_ATTITUDE_TO_ARTICLE,
    GET_COMMENT,
    GET_GUESS_LIKE_ARTICLE,
    GET_IS_FOCUS,
    GET_USER_DATA,
    POST_CHECK_COLLECT_ARTICLE,
    POST_CHECK_GOOD_ARTICLE,
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
  import ArticleTitle from "../../../components/ArticleTitle";
  import Comments from "../../../components/Comments";
  import {TARGET_ARTICLE} from "../../../assets/js/const";

  export default {
    name: "index",
    components: {Comments, ArticleTitle, Good, Tag, MButton, MdIndex, UserAuthentication, Breadcrumb, MdRender},
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
        app.$axios.$get(GET_COMMENT + '?articleId=' + article.id + '&&page=0&&size=' + 10),
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
        onScroll: undefined,
        target: TARGET_ARTICLE
      }
    },
    watch: {},
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      pushToComment(val) {
        this.comments.push(val)
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
        this.$axios.$post(POST_CHECK_GOOD_ARTICLE, {
          articleId: this.article.id, status: !this.isGood
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
      collect(finish) {
        if (this.article.isCollect) {
          this.$axios.$post(POST_CHECK_COLLECT_ARTICLE, undefined, {
            articleId: this.article.id,
            packageName: this.article.inPackageName,
            status: false
          }).then(() => {
            this.isCollect = false
            this.article.isCollect = false
            if (finish) {
              finish()
            }
          })
        } else {
          eventBus.$emit(COLLECT_ARTICLE, this.article)
          if (finish) {
            finish()
          }
        }
      },
      async fetchAttitudeToArticle() {
        [this.isGood, this.isCollect] = await this.$axios.$get(GET_CHECK_ATTITUDE_TO_ARTICLE, {
          params: {
            articleId: this.article.id
          }
        })

      },
    },
    async mounted() {
      this.$store.commit('setHomeActiveMenu', '专栏')
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
      const onLoginSuccess = () => {
        this.fetchAttitudeToArticle()
      }
      this.onScroll = onScrollCallback
      this.onLoginSuccess = onLoginSuccess
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
      eventBus.$on(SUCCESS_LOGIN, onLoginSuccess)
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
    beforeDestroy() {
      eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL, this.onScroll)
      eventBus.$off(ON_MD_INDEX_CHANGE_TITLE)
      eventBus.$off(SUCCESS_LOGIN, this.onLoginSuccess)
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
        max-width: 40px;
        min-width: 40px;
        max-height: 40px;
        min-height: 40px;
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
      padding-bottom: 30px;

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
          padding-top: 30px;

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
  }
</style>
