<template>
  <div id="ArticleChannels" class="default-container">
    <section class="inner">
      <section class="left-side">
        <tabs :labels="labels" @active-change="onActiveChange">
          <div class="sort" v-show="activeIndex===1">
            排序：
            <button @click="hottestBy=0" :class="{'active-button':hottestBy===0}">日排序</button>
            <button @click="hottestBy=1" :class="{'active-button':hottestBy===1}">周排序</button>
            <button @click="hottestBy=2" :class="{'active-button':hottestBy===2}">月排序</button>
          </div>
          <ul class="article-list">
            <li v-for="val in articles[page]">
              <article-description :article="val"></article-description>
            </li>
          </ul>
        </tabs>
        <br/>
        <pagination :page="page+1" :total="articleNum" @page-change="pageChange"></pagination>
      </section>
      <section class="right-side">
        <section class="hot-channels">
          <h3>热门专栏</h3>
          <ul>
            <li v-for="(val,index) in hotChannels">
              <div class="index">{{index}}</div>
              <div class="info">
                <nuxt-link :to="'/article-channel/'+val.name">{{val.name}}</nuxt-link>
                <p>{{val.description}}</p>
              </div>
            </li>
          </ul>
        </section>
        <section class="hot-tags">
          <h3>热门标签</h3>
          <ul>
            <li v-for="val in hotTags">
              <tag :tag="val.name"></tag>
              <span>x {{$formatNumber(val.number)}}</span>
            </li>
          </ul>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import Tabs from "../components/Tabs";
  import {GET_ARTICLE_TOTAL_NUM, GET_HOTTEST_ARTICLE, GET_HOTTEST_ARTICLE_CHANNELS, GET_HOTTEST_TAGS, GET_NEWEST_ARTICLE, GET_RECOMMEND_ARTICLE} from "../assets/js/api";
  import Good from "../components/Good";
  import MButton from "../components/MButton";
  import Pagination from "../components/Pagination";
  import Tag from "../components/Tag";
  import ArticleDescription from "../components/ArticleDescription";

  export default {
    name: "article-channels",
    components: {ArticleDescription, Tag, Pagination, MButton, Good, Tabs},
    props: {},
    head() {
      let prefix
      switch (this.activeIndex) {
        case 0:
          prefix = '推荐的文章'
          break
        case 1:
          if (this.hottestBy === 1) {
            prefix = '一周内'
          } else if (this.hottestBy === 2) {
            prefix = '一个月内'
          }
          prefix += '热门的文章'
          break
        case 2:
          prefix = '最新的'
          break
      }
      return {
        title: prefix + ' - SegmentFault 思否'
      }
    },
    async asyncData({app}) {
      const [articleNum, hotChannels, hotTags] = await Promise.all([
        app.$axios.$get(GET_ARTICLE_TOTAL_NUM),
        app.$axios.$get(GET_HOTTEST_ARTICLE_CHANNELS),
        app.$axios.$get(GET_HOTTEST_TAGS),
      ])
      return {
        articleNum, hotChannels, hotTags
      }
    },
    data() {
      return {
        labels: [
          '推荐文章',
          '热门文章',
          '最新文章',
        ],
        hottestBy: 0,//0:日，1：周，2：月
        articles: [],
        recommendArticles: [],
        dayHottestArticles: [],
        monthHottestArticles: [],
        weekHottestArticles: [],
        newestArticles: [],
        page: 0,
        activeIndex: 0,
      }
    },
    watch: {
      hottestBy() {
        this.fetchArticle()
      }
    },
    computed: {},
    methods: {
      pageChange(page) {
        this.page = page - 1
        this.fetchArticle()
      },
      onActiveChange(active) {
        this.activeIndex = active
        this.page = 0
        this.fetchArticle()
      },
      setArticle() {
        switch (this.activeIndex) {
          case 0:
            this.articles = this.recommendArticles
            break
          case 1:
            if (this.hottestBy === 0) {
              this.articles = this.dayHottestArticles
            } else if (this.hottestBy === 1) {
              this.articles = this.weekHottestArticles
            } else if (this.hottestBy === 2) {
              this.articles = this.monthHottestArticles
            }
            break
          case 2:
            this.articles = this.newestArticles
            break
        }
      },
      fetchArticle() {
        this.setArticle()
        const page = this.page
        let url, params = {page}, array
        const getLength = (array) => {
          return array ? array.length : 0
        }
        switch (this.activeIndex) {
          case 0:
            if (getLength(this.recommendArticles[page]) === 0) {
              url = GET_RECOMMEND_ARTICLE
              array = this.recommendArticles
            }
            break
          case 1:
            params.by = this.hottestBy
            if (getLength(this.dayHottestArticles[page]) === 0 && this.hottestBy === 0) {
              url = GET_HOTTEST_ARTICLE
              array = this.dayHottestArticles
            } else if (getLength(this.weekHottestArticles[page]) === 0 && this.hottestBy === 1) {
              url = GET_HOTTEST_ARTICLE
              array = this.weekHottestArticles
            } else if (getLength(this.monthHottestArticles[page]) === 0 && this.hottestBy === 2) {
              url = GET_HOTTEST_ARTICLE
              array = this.monthHottestArticles
            }
            break
          case 2:
            if (getLength(this.newestArticles[page]) === 0) {
              url = GET_NEWEST_ARTICLE
              array = this.newestArticles
            }
            break
        }
        if (url) {
          this.$axios.$get(url, {
            params
          }).then(res => {
            array[page] = res
            this.$forceUpdate()
          })
        }
      },
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '专栏')
      this.onActiveChange(0)
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #ArticleChannels {
    .inner {
      padding-top: 20px;
      display: flex;

      .left-side {
        flex-grow: 1;
        margin: 30px 0;

        .sort {
          font-size: 1.4rem;
          color: #777;
          margin-top: 10px;
          padding-left: 20px;

          button {
            font-size: 1.2rem;
            color: #222;
            padding: 0 5px;
            border: 1px solid #dddddd;

            &:hover {
              background-color: #dddddd;
            }
          }

          .active-button {
            background-color: #dddddd;
            box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.15);
          }
        }

        .article-list {
          margin-top: 20px;

          li {
            border-bottom: 1px solid #dddddd;
            padding: 10px 0;
          }
        }
      }

      .right-side {
        width: 27%;
        padding-left: 30px;
        box-sizing: border-box;

        .hot-channels {
          padding-top: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #dddddd;

          h3 {
            font-size: 1.8rem;
            font-weight: bold;
            padding-bottom: 25px;
          }

          li {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .index {
              width: 24px;
              min-width: 24px;
              height: 24px;
              min-height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.4rem;
              color: #777;
              border: 1px solid #dddddd;
            }

            .info {
              width: calc(100% - 24px);
              padding-left: 15px;
              box-sizing: border-box;

              a {
                color: $green;
                font-size: 1.4rem;

                &:hover {
                  color: $darker-green;
                }

                padding-bottom: 10px;
              }

              p {
                color: #777;
                font-size: 1.2rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
        }

        .hot-tags {
          padding-top: 30px;

          h3 {
            font-size: 1.8rem;
            font-weight: bold;
            padding-bottom: 25px;
          }

          li {
            display: flex;
            align-items: center;
            font-size: 1.3rem;
            color: #777;
            padding: 5px 0;

            span {
              margin-left: 5px;
            }
          }
        }
      }

      @media(max-width: 992px) {
        flex-direction: column;
        .left-side, .right-side {
          width: 100%;
          padding-left: 0;
        }
      }
    }
  }
</style>
