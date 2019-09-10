<template>
  <div id="tag" class="default-content-layout default-container">
    <section class="left-part">
      <breadcrumb :router="breadcrumbData"></breadcrumb>
      <section class="banner">
        <section class="top">
          <div class="name-block">{{tagData.name}}</div>
          <m-button class="focus-button" :click="{'active-button':tagData.isFocus}">
            <span>{{tagData.isFocus?'已关注':'关注'}}</span>{{$formatNumber(tagData.focusNum)}}
          </m-button>
        </section>
        <p class="txt">
          {{$limitString(tagData.description,100)}}
          <button class="to-baike" @click="setTabActiveIndex(3)">[百科]</button>
        </p>
      </section>
      <tabs ref="tabs" :labels="labels" @active-change="onTabActiveChange">
        <ul class="active-info-list" v-if="tabActiveIndex===0">
          <li v-for="val in tagActiveInfo">
            <good :good="val.isGood" :param="val" :number="val.goodNum" :click="clickGood"></good>
            <section class="info">
              <div class="top">
                <nuxt-link class="name" :to="(val.question?'/question?id=':'/article/')+val.id">{{val.name}}</nuxt-link>
                <Tag class="tag" :tag="v" v-for="(v,index) in val.tags" :key="val.name+index"></Tag>
              </div>
              <div class="bottom">
                <div class="avatar">
                  <img :src="val.avatar">
                </div>
                <nuxt-link class="author" :to="'/user?id='+val.authorId" tabindex="1">{{val.author}}</nuxt-link>
                <span class="datetime">{{$formatDatetime(val.datetime)}}</span>
                <div class="question-part" v-if="val.question">
                  <nuxt-link class="to-answer" :to="'/question?id='+val.id+'#answers'" tabindex="1">{{val.answerNum>0?val.answerNum:''}}回答</nuxt-link>
                  <nuxt-link class="to-questions" to="/questions">问答</nuxt-link>
                </div>
                <div class="article-part" v-else>
                  <nuxt-link class="to-comment" :to="'/article/'+val.id+'#comments'" tabindex="1">{{val.commentNum>0?$formatNumber(val.commentNum):''}}评论</nuxt-link>
                  <nuxt-link class="to-article-channels" to="/article-channels">专栏</nuxt-link>
                </div>
              </div>
            </section>
          </li>
        </ul>
        <section v-else-if="tabActiveIndex===1">
          <p class="sort">
            排序：
            <button @click="sortType=0" :class="{'active-button':sortType===0}">时间</button>
            <button @click="sortType=1" :class="{'active-button':sortType===1}">得票数</button>
            <button @click="sortType=2" :class="{'active-button':sortType===2}">未回答</button>
            <button @click="sortType=3" :class="{'active-button':sortType===3}">未解决</button>
          </p>
          <ul class="question-list">
            <li v-for="(val,index) in  questionArray">
              <question-banner :question="val" :key="index"></question-banner>
            </li>
          </ul>
        </section>
        <ul class="article-list" v-else-if="tabActiveIndex===2">
          <li v-for="(val,index) in articleArray">
            <article-description :article="val" :key="index"></article-description>
          </li>
        </ul>
        <section v-else-if="tabActiveIndex===3">
          <md-render :content="tagBaike"></md-render>
        </section>
        <br/>
        <pagination v-show="tabActiveIndex!==3" :page="page+1" :size="size" :total="totalNum" @page-change="onPageChange"></pagination>
      </tabs>
      <button class="create-question" @click="createQuestion">+ 提问题</button>
    </section>
    <section class="right-part">
      <section class="rp-board">
        <div class="top">
          <label>标签排行榜</label>
          <div>
            <span @mouseenter="rpBoardIndex=0" :class="{active:rpBoardIndex===0}">本周</span>
            <span @mouseenter="rpBoardIndex=1" :class="{active:rpBoardIndex===1}">全部</span>
          </div>
        </div>
        <r-p-board :array="rpBoard[rpBoardIndex]" :show-icon="true"></r-p-board>
      </section>
      <section class="relevant-tags">
        <h3>相关标签</h3>
        <div class="tags">
          <Tag class="tag" :tag="val" v-for="(val,index) in relevantTags" :key="index"></Tag>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
  import {eventBus, SET_TAG_GROUP_STATUS, SHOW_LOGIN__CARD} from "../assets/js/event-bus";
  import {
    GET_ARTICLE_BY,
    GET_QUESTIONS,
    GET_RELAVANT_TAGS,
    GET_RP_BOAR_TAG,
    GET_TAG_ACTIVE_INFO,
    GET_TAG_BAIKE,
    GET_TAG_DATA,
    GET_TAG_STATUS,
    POST_CHECK_GOOD_ARTICLE,
    POST_CHECK_GOOD_QUESTION
  } from "../assets/js/api";
  import Breadcrumb from "../components/Breadcrumb";
  import MButton from "../components/MButton";
  import Tabs from "../components/Tabs";
  import DownFetchContent from "../components/DownFetchContent";
  import Good from "../components/Good";
  import Tag from '../components/Tag'
  import QuestionBanner from "../components/QuestionBanner";
  import ArticleDescription from "../components/ArticleDescription";
  import RPBoard from "../components/RPBoard";
  import Pagination from "../components/Pagination";
  import MdRender from "../components/MdRender";

  const size = 20
  export default {
    name: "tag",
    components: {MdRender, Pagination, RPBoard, ArticleDescription, QuestionBanner, Good, DownFetchContent, Tabs, MButton, Breadcrumb, Tag},
    props: {},
    validate({query}) {
      const tagName = query.name
      return tagName !== null && tagName !== undefined
    },
    head() {
      let prefix = this.tagData.name + '的'
      switch (this.tabActiveIndex) {
        case 0:
          prefix += '动态'
          break
        case 1:
          prefix += '问题'
          break
        case 2:
          prefix += '文章'
          break
        case 3:
          prefix += '介绍'
          break
      }
      return {
        title: prefix + '- SegementFault 思否'
      }
    },
    async asyncData({app, query}) {
      const tagName = query.name, breadcrumbData = [
        {
          text: '标签',
          href: '/tags'
        }, {
          text: tagName
        }
      ]
      const [tagData, tagActiveInfo, tagBaike, tagStatus, relevantTags] = await Promise.all([
        app.$axios.$get(GET_TAG_DATA + '?name=' + tagName),
        app.$axios.$get(GET_TAG_ACTIVE_INFO + '?page=0&&size=' + size + '&&tag=' + tagName),
        app.$axios.$get(GET_TAG_BAIKE + '?tag=' + tagName),
        app.$axios.$get(GET_TAG_STATUS + '?tag=' + tagName),
        app.$axios.$get(GET_RELAVANT_TAGS + '?tag=' + tagName)
      ])
      return {tagData, tagActiveInfo, tagBaike, breadcrumbData, relevantTags, tagStatus}
    },
    data() {
      return {
        page: 0,
        tabActiveIndex: 0,
        labels: ['标签动态', '技术问答', '专栏文章', '标签百科'],
        questionArray: [],
        articleArray: [],
        rpBoard: [],
        rpBoardIndex: 0,
        sortType: 0,
        size
      }
    },
    watch: {
      '$route': async function (val) {
        const tagName = val.query.name
        this.page = 0
        this.tabActiveIndex = 0
        this.sortType = 0
        this.breadcrumbData[1].text = tagName
        const [tagData, tagActiveInfo, tagBaike, tagStatus, relevantTags] = await Promise.all([
          this.$axios.$get(GET_TAG_DATA + '?name=' + tagName),
          this.$axios.$get(GET_TAG_ACTIVE_INFO + '?page=0&&size=' + size + '&&tag=' + tagName),
          this.$axios.$get(GET_TAG_BAIKE + '?tag=' + tagName),
          this.$axios.$get(GET_TAG_STATUS + '?tag=' + tagName),
          this.$axios.$get(GET_RELAVANT_TAGS + '?tag=' + tagName)
        ])
        this.rpBoard = []
        this.fetchRpBoard()
        this.tagData = tagData
        this.tagActiveInfo = tagActiveInfo
        this.tagBaike = tagBaike
        this.tagStatus = tagStatus
        this.relevantTags = relevantTags
      },
      sortType() {
        this.questionArray = []
        this.fetchMoreQuestion()
      },
      rpBoardIndex() {
        this.fetchRpBoard()
      }
    },
    computed: {
      totalNum() {
        switch (this.tabActiveIndex) {
          case 0:
            return this.tagStatus.activeInfoNum
          case 1:
            return this.tagStatus.questionNum
          case 2:
            return this.tagStatus.articleNum
        }
      }
    },
    methods: {
      createQuestion() {
        if (this.$store.state.user) {
          this.$router.push({path: '/create-question'})
        } else {
          eventBus.$emit(SHOW_LOGIN__CARD)
        }
      },
      setTabActiveIndex(index) {
        this.$refs.tabs.$emit('set-active', index)
      },
      onTabActiveChange(index) {
        this.tabActiveIndex = index
        this.page = 0
        this.fetch()
      },
      onPageChange(page) {
        this.page = page - 1
        this.fetch()
      },
      fetch() {
        switch (this.tabActiveIndex) {
          case 0:
            this.fetchMoreActiveInfo()
            break
          case 1:
            this.fetchMoreQuestion()
            break
          case 2:
            this.fetchMoreArticle()
            break
        }
      },
      fetchMoreActiveInfo() {
        if (this.tagActiveInfo[this.page]) {
          return
        }
        this.$axios.$get(GET_TAG_ACTIVE_INFO, {
          params: {
            page: this.page++, size,
            tag: this.tagData.name
          }
        }).then(res => {
          this.$pushToArray(this.tagActiveInfo, res)
        })
      },
      fetchMoreQuestion() {
        if (this.questionArray[this.page]) {
          return
        }
        this.$axios.$get(GET_QUESTIONS, {
          params: {page: this.page++, size, tag: this.tagData.name, sort: this.sortType}
        }).then(res => {
          this.$pushToArray(this.questionArray, res)
          if (finish) {
            finish()
          }
        })
      },
      fetchMoreArticle() {
        if (this.articleArray[this.page]) {
          return
        }
        this.$axios.$get(GET_ARTICLE_BY, {
          params: {page: this.page++, size, index: this.tagData.name}
        }).then(res => {
          this.$pushToArray(this.articleArray, res)
          this.$forceUpdate()
        })
      },
      clickGood(info) {
        if (info.question) {
          this.$axios.$post(POST_CHECK_GOOD_QUESTION, {
            questionId: info.id, status: !info.isGood
          }).then(() => {
            info.isGood = !info.isGood
            finish()
          })
        } else {
          this.$axios.$post(POST_CHECK_GOOD_ARTICLE, {
            articleId: info.id, status: !info.isGood
          }).then(() => {
            info.isGood = !info.isGood
            finish()
          })
        }
      },
      fetchRpBoard() {
        if (this.rpBoard[this.rpBoardIndex]) {
          return
        }
        this.$axios.$get(GET_RP_BOAR_TAG, {
          params: {name: this.tagData.name, by: this.rpBoardIndex}
        }).then(res => {
          this.rpBoard[this.rpBoardIndex] = res
          this.$forceUpdate()
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        eventBus.$emit(SET_TAG_GROUP_STATUS, true)
      })
      this.$store.commit('setHomeActiveMenu', '')
      this.fetchRpBoard()
    },
    created() {
    },
    beforeDestroy() {
      eventBus.$emit(SET_TAG_GROUP_STATUS, false)
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #tag {
    padding: 30px 0;

    .left-part {
      position: relative;
    }

    .banner {
      margin-top: 20px;
      margin-bottom: 20px;
      background-color: #F6F6F6;
      border-radius: 1px;
      padding: 15px 20px;
      box-sizing: border-box;

      .top {
        display: flex;
        align-items: center;
        padding-bottom: 15px;

        .name-block {
          background-color: #E3EDEB;
          border-radius: 1px;
          color: #017E66;
          font-size: 1.4rem;
          padding: 5px;
          margin-right: 10px;
        }

        .focus-button {
          background-color: $green;
          color: #ffffff;
          font-size: 1.3rem;
          padding: 2px 10px;
          border-radius: 4px;

          span {
            padding-right: 5px;
            margin-right: 5px;
            border-right: 1px solid white;
          }

          &:hover {
            background-color: $darker-green;
          }
        }

        .active-button {
          background-color: $darker-green;
        }
      }

      .txt {
        font-size: 1.4rem;
        color: #666666;
        line-height: 1.5;

        .to-baike {
          color: $green;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .active-info-list, .question-list, .article-list {
      padding-top: 10px;

      li {
        padding: 10px 0;
        border-bottom: 1px solid #dddddd;
      }
    }

    .active-info-list {
      li {
        display: flex;

        .info {
          flex-grow: 1;
          padding-left: 20px;
          box-sizing: border-box;

          .top {
            display: flex;
            align-items: center;
            padding-bottom: 10px;
            flex-wrap: wrap;

            .name {
              font-size: 1.6rem;
              color: #212121;
            }

            .tag {
              margin-left: 5px;
            }
          }

          .bottom {
            display: flex;
            align-items: center;
            font-size: 1.3rem;
            flex-wrap: wrap;

            .avatar {
              min-width: 18px;
              max-width: 18px;
              min-height: 18px;
              max-height: 18px;
              border-radius: 50%;
              overflow: hidden;
            }

            .author {
              color: $green;
              margin-left: 10px;
            }

            .datetime {
              color: #777777;
              margin-left: 10px;
            }

            .question-part, .article-part {
              .to-answer, .to-comment {
                color: $green;
                margin-left: 10px;
              }

              .to-questions {
                color: #8C5825;
                margin-left: 10px;
              }

              .to-article-channels {
                margin-left: 10px;
                color: #468ee5;
              }
            }
          }
        }
      }
    }

    .sort {
      font-size: 1.4rem;
      color: #777777;
      padding-top: 10px;

      button {
        border: 1px solid #777777;
        color: #333333;
        font-size: 1.2rem;
        padding: 0 5px;
        border-radius: 3px;

        &:hover {
          background-color: #dddddd;
        }
      }
    }

    .create-question {
      position: absolute;
      right: 0;
      top: -5px;
      width: fit-content;
      padding: 5px 10px;
      background-color: $green;
      color: #fff;
      font-size: 1.4rem;
      border-radius: 5px;

      &:hover {
        background-color: $darker-green;
      }

      @media(max-width: 768px) {
        right: 20px;
      }
    }

    .rp-board {
      padding-bottom: 20px;

      .top {
        font-size: 1.6rem;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0 10px;

        div {
          font-size: 1.3rem;
          color: #777777;

          span {
            margin-left: 10px;
            cursor: default;
          }

          .active {
            color: $green;
          }
        }
      }
    }

    .relevant-tags {
      h3 {
        font-size: 1.6rem;
        color: #333333;
        padding: 5px 0 10px;
      }

      .tags {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .tag {
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
