<template>
  <div id="index" class="default-container">
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
          <button class="focus" @click="focus">{{isFocus?'关注作者':'取消关注'}}</button>
        </div>
        <p class="time">{{$formatDate(article.datetime)}}发布</p>
      </div>
    </section>
    <section class="article-content">
      <div ref="content" class="left-side">
        <md-render :article="article"></md-render>
      </div>
      <div ref="rightSide" class="right-side">
        <div ref="index" :style="indexStyle">
          <md-index></md-index>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import {GET_ARTICLE, GET_IS_FOCUS, GET_USER_DATA, POST_FOCUS_AUTHOR, POST_UNFOCUS_AUTHOR} from "../../../assets/js/api";
  import MdRender from "../../../components/MdRender";
  import Breadcrumb from "../../../components/Breadcrumb";
  import UserAuthentication from "../../../components/UserAuthentication";
  import {eventBus, ON_DEFAULT_LAYOUT_SCROLL, SHOW_LOGIN__CARD} from "../../../assets/js/event-bus";
  import MdIndex from "../../../components/MdIndex";

  export default {
    name: "index",
    components: {MdIndex, UserAuthentication, Breadcrumb, MdRender},
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
          href: '/article-channel?name=' + article.aricleChannelName
        })
      }
      breadcrumbData.push({
        text: '文章详情'
      })
      const authorData = await app.$axios.$get(GET_USER_DATA + '?id=' + article.authorId)
      return {article, breadcrumbData, authorData}
    },
    data() {
      return {
        isFocus: false,
        indexStyle: {
          position: 'absolute',
          width: '100%',
          top: 0
        },
        offsetTop: 0
      }
    },
    watch: {},
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
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
      }
    },
    async mounted() {
      const indexRef = this.$refs.index
      const content = this.$refs.content
      const contentHeight = content.getBoundingClientRect().height
      const indexHeight = indexRef.getBoundingClientRect().height
      const rightSideOffsetTop = this.$refs.rightSide
      const onScrollCallback = (toTop) => {
        if (this.offsetTop + indexHeight >= contentHeight) {
          return
        }
        toTop -= 20
        if (toTop < this.offsetTop) {
          return
        }
        this.offsetTop = toTop - rightSideOffsetTop
        this.indexStyle.top = this.offsetTop + 'px'
      }
      eventBus.$on(ON_DEFAULT_LAYOUT_SCROLL, onScrollCallback)
      onScrollCallback()
      this.focus = await this.$axios.$get(GET_IS_FOCUS, {
        params: {
          id: this.user ? this.user.id : -1,
          targetId: this.article.authorId
        }
      })
    },
    created() {
    },
    destroyed() {
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
      align-items: center;
      position: relative;

      .left-side {
        width: 70%;
        padding-right: 20px;
        box-sizing: border-box;
      }

      .right-side {
        width: 30%;
        position: relative;
      }
    }
  }
</style>
