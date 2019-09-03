<template>
  <div id="ArticleDescription">
    <good :click="goodArticle" :good="article.isGood" :number="article.goodNum"></good>
    <section class="text">
      <div>
        <nuxt-link :to="'/article/'+article.id" tag="h3">{{article.name}}</nuxt-link>
        <label class="original-article" v-if="article.original">原创</label>
        <label class="translate-article" v-else-if="article.translate">翻译</label>
      </div>
      <div class="info">
        <div class="avatar">
          <img :src="article.avatar">
        </div>
        <nuxt-link class="author" :to="'/user/'+article.authorId">{{article.author}}</nuxt-link>
        <span class="date">{{$formatDate(article.datetime)}}</span>
        发布于
        <a class="channels" v-if="article.channels" :href="'/article-channel/'+article.channelsId">{{article.channels}}</a>
        <nuxt-link class="channels" v-else :to="'/user/'+article.authorId+'/articles'">self文章</nuxt-link>
        <img class="collect-icon" src="/icon/bookmark.svg">
        <m-button class="collect-txt" :click="collectArticle" :param="article">{{article.isCollect?'已收藏':'收藏'}}</m-button>
      </div>
      <p class="content">{{$formatText(article.firstParagraph)}}</p>
    </section>
  </div>
</template>

<script>
  import Good from "./Good";
  import MButton from "./MButton";
  import {POST_CHECK_GOOD_ARTICLE} from "../assets/js/api";
  import {COLLECT_ARTICLE} from "../assets/js/event-bus";

  export default {
    name: "ArticleDescription",
    components: {MButton, Good},
    props: {
      article: {
        type: Object,
        required: true
      }
    },
    data() {
      return {}
    },
    watch: {},
    computed: {},
    methods: {
      goodArticle(finish) {
        const article = this.article
        this.$axios.$post(POST_CHECK_GOOD_ARTICLE + '?articleId=' + article.id).then(() => {
          article.isGood = !article.isGood
          if (article.isGood) {
            article.goodNum++
          } else {
            article.goodNum--
          }
          finish()
          this.$forceUpdate()
        })
      },
      collectArticle(article) {
        eventBus.$emit(COLLECT_ARTICLE, article)
      }
    },
    mounted() {
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #ArticleDescription {
    display: flex;
    padding: 20px 10px;
    box-sizing: border-box;

    .text {
      flex-grow: 1;
      padding-left: 20px;
      box-sizing: border-box;

      h3 {
        display: inline-block;
        font-size: 1.6rem;
        color: #333;
        cursor: pointer;
        @media(max-width: 550px) {
          font-size: 1.3rem;
        }

        &:hover {
          text-decoration: underline;
        }
      }

      .original-article, .translate-article {
        margin-left: 10px;
        @media(max-width: 550px) {
          float: right;
        }
      }

      .info {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        font-size: 1.3rem;

        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
          transform: translateY(-2px);
        }

        .author, .channels, .date {
          color: $green;
          margin-right: 5px;
          margin-left: 5px;
        }

        .collect-icon {
          width: 12px;
          height: 12px;
        }

        .collect-txt {
          color: #777;
          font-size: 1.2rem;
          margin-left: 5px;
        }
      }

      .content {
        font-size: 1.3rem;
        line-height: 1.6;
        color: #777;
        @media(max-width: 550px) {
          display: none;
        }
      }
    }
  }
</style>
