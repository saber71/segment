<template>
  <div id="index" class="default-container">
    <section class="left">
      <section class="banner">
        <img src="/icon/channel-icon.png">
        <section class="text">
          <div class="top">
            <span class="name">{{channel.name}}</span>
            <m-button class="focus-button" :class="{active:channel.isFocus}" :click="focus">
              <span>{{channel.isFocus?'已关注':'关注'}}</span>
              <span>|</span>
              <span>{{$formatNumber(channel.focusNum)}}</span>
            </m-button>
          </div>
          <p>{{channel.description}}</p>
        </section>
      </section>
      <ul class="article-list">
        <li v-for="val in articles[articlePage]">
          <article-description :article="val"></article-description>
        </li>
      </ul>
      <pagination :page="articlePage+1" :total="totalArticlePage" @page-change="onArticlePageChange"></pagination>
    </section>
    <section class="right">
      <p class="article-num">{{channel.articlesNum}}篇文章</p>
      <div class="input">
        <input class="common-input" v-model="searchTxt" @keypress.enter="search">
        <button @click="search">搜索</button>
      </div>
      <div class="tags">
        <tag class="tag" v-for="(val,index) in channel.tags" :tag="val" :param="index" :selected="filterTagIndex===index" :key="index" :click="clickTag"></tag>
      </div>
      <div class="authors">
        <p class="number">{{channel.authors.length}}位作者</p>
        <ul class="author-list">
          <li v-for="val in authors">
            <div class="avatar">
              <img :src="val.avatar">
            </div>
            <section class="info">
              <nuxt-link :to="'/user/'+val.id">{{val.name}}</nuxt-link>
              <p>{{val.declare}}</p>
            </section>
          </li>
        </ul>
        <arrow-pagination :page="authorPage+1" :total="totalAuthorPage" @page-change="onAuthorPageChange"></arrow-pagination>
      </div>
    </section>
  </div>
</template>

<script>
  import {GET_ARTICLE_CHANNEL, GET_ARTICLE_IN_CHANNEL, GET_ARTICLE_NUM_IN_CHANNEL_FILTER, POST_CHECK_FOCUS_ARTICLE_CHANNEL} from "../../../assets/js/api";
  import MButton from "../../../components/MButton";
  import ArticleDescription from "../../../components/ArticleDescription";
  import Pagination from "../../../components/Pagination";
  import Tag from "../../../components/Tag";
  import ArrowPagination from "../../../components/ArrowPagination";

  export default {
    name: "index",
    components: {ArrowPagination, Tag, Pagination, ArticleDescription, MButton},
    props: {},
    head() {
      return {title: this.channel.name + ' - SegmentFault 思否'}
    },
    async asyncData({params, app}) {
      const channel = await app.$axios.$get(GET_ARTICLE_CHANNEL + '?channelId=' + params.id)
      return {channel}
    },
    data() {
      return {
        articlePage: 0,
        articlePageSize: 20,
        authorPage: 0,
        authorPageSize: 5,
        articles: [],
        searchTxt: '',
        filterTag: undefined,
        filterTagIndex: -1,
        articleSum: -1,
      }
    },
    watch: {},
    computed: {
      totalArticlePage() {
        const res = parseInt(this.articleSum / this.articlePageSize)
        if (res * this.articlePageSize < this.channel.articlesNum) {
          return res + 1
        }
        return res
      },
      authors() {
        const start = this.authorPage * this.authorPageSize
        return this.channel.authors.slice(start, this.authorPageSize + start)
      },
      totalAuthorPage() {
        const res = parseInt(this.channel.authors.length / this.authorPageSize)
        if (res * this.authorPageSize < this.channel.authors.length) {
          return res + 1
        }
        return res
      },
    },
    methods: {
      async clickTag(tag, finish, tagIndex) {
        if (this.filterTagIndex === tagIndex) {
          this.filterTag = undefined
          this.filterTagIndex = -1
          this.articleSum = this.channel.articlesNum
        } else {
          this.filterTag = tag
          this.filterTagIndex = tagIndex
          this.articleSum = await this.$axios.$get(GET_ARTICLE_NUM_IN_CHANNEL_FILTER + '?tag=' + tag)
        }
        this.articles = []
        this.articlePage = 0
        this.fetchArticles()
        finish()
      },
      search() {
        tihs.$router.push({path: `/search?by='文章'&&channel=${this.channel.id}&&txt=${this.searchTxt}`})
      },
      onAuthorPageChange(page) {
        this.authorPage = page - 1
      },
      onArticlePageChange(page) {
        this.articlePage = page - 1
        this.fetchArticles()
      },
      focus(finish) {
        this.$axios.$post(POST_CHECK_FOCUS_ARTICLE_CHANNEL + '?channelId=' + this.channel.id).then(() => {
          this.channel.isFocus = !this.channel.isFocus
          if (this.channel.isFocus) {
            this.channel.focusNum++
          } else {
            this.channel.focusNum--
          }
          finish()
        })
      },
      fetchArticles() {
        const page = this.articlePage
        if (this.articles[page]) {
          return
        }
        this.$axios.$get(GET_ARTICLE_IN_CHANNEL, {
          params: {
            page,
            channelId: this.channel.id,
            size: this.articlePageSize,
            tag: this.filterTag
          }
        }).then((res) => {
          this.articles[page] = res
          this.$forceUpdate()
        })
      }
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '专栏')
      this.articleSum = this.channel.articlesNum
      this.fetchArticles()
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
    display: flex;
    padding-top: 30px;

    .left {
      flex-grow: 1;
      padding-bottom: 20px;

      .banner {
        border-bottom: 1px solid #dddddd;
        display: flex;
        padding-bottom: 20px;

        img {
          width: 32px;
          height: 48px;
          margin: 0 8px;
        }

        .text {
          flex-grow: 1;
          padding-left: 20px;

          .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;

            .name {
              color: #333333;
              font-size: 2.4rem;
              line-height: 1;
            }

            .focus-button {
              color: white;
              font-size: 1.2rem;
              background-color: #5cb85c;
              padding: 5px 10px;
              border-radius: 4px;

              span {
                margin: 0 2px;
              }

              &:hover {
                background-color: $darker-green;
              }
            }

            .active {
              background-color: $darker-green;
            }
          }

          p {
            font-size: 1.3rem;
            color: #737373;
            line-height: 1.6;
          }
        }
      }

      .article-list {
        padding-top: 10px;
        padding-bottom: 20px;

        li {
          border-bottom: 1px solid #dddddd;
          padding: 10px 0;
        }
      }
    }

    .right {
      width: 30%;
      padding-left: 20px;
      box-sizing: border-box;
      padding-bottom: 20px;

      .article-num {
        font-size: 1.6rem;
        color: #333333;
        padding-bottom: 20px;
      }

      .input {
        display: flex;
        align-items: center;
        padding-bottom: 20px;

        input {
          flex-grow: 1;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        button {
          min-width: 54px;
          font-size: 1.4rem;
          color: #333333;
          text-align: center;
          line-height: 32px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          border: 1px solid #dddddd;
          border-left: none;

          &:hover {
            background-color: #dddddd;
          }
        }
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 30px;
        border-bottom: 1px solid #dddddd;

        .tag {
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }

      .authors {
        padding-top: 30px;

        .number {
          font-size: 1.6rem;
          color: #333333;
          padding-bottom: 20px;
        }

        .author-list {
          li {
            display: flex;
            margin-bottom: 10px;

            .avatar {
              min-width: 40px;
              max-width: 40px;
              max-height: 40px;
              min-height: 40px;
              border-radius: 50%;
              overflow: hidden;
            }

            .info {
              flex-grow: 1;
              padding-left: 10px;
              font-size: 1.4rem;

              a {
                color: $green;
                padding-bottom: 10px;
              }

              p {
                color: #777777;
                line-height: 1.5;
              }
            }
          }
        }
      }
    }

    @media(max-width: 992px) {
      flex-direction: column;
      .left, .right {
        width: 100%;
      }
    }
  }
</style>
