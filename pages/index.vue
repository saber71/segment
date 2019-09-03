<template>
  <div id="Index">
    <section class=" default-container content">
      <section class="left">
        <ul class="top">
          <li class="tag" :class="{'active-tag':selectedTag==='为你推荐'}" v-if="!user" @click="selectedTag='为你推荐'">
            <img src="/icon/board-black.png" v-show="selectedTag!=='为你推荐'">
            <img src="/icon/board-white.png" v-show="selectedTag==='为你推荐'">
            为你推荐
          </li>
          <li class="tag" :class="{'active-tag':selectedTag==='我的订阅'}" v-else="user" @click="selectedTag='我的订阅'">
            <img src="/icon/board-black.png" v-show="selectedTag!=='我的订阅'">
            <img src="/icon/board-white.png" v-show="selectedTag==='我的订阅'">
            我的订阅
          </li>
          <li class="tag" :class="{'active-tag':selectedTag==='近期热门'}" @click="selectedTag='近期热门'">
            <img src="/icon/hottest-black.png" v-show="selectedTag!=='近期热门'">
            <img src="/icon/hottest-white.png" v-show="selectedTag==='近期热门'">
            近期热门
          </li>
          <li class="tag" :class="{'active-tag':selectedTag==='最新内容'}" @click="selectedTag='最新内容'">
            <img src="/icon/newest-black.png" v-show="selectedTag!=='最新内容'">
            <img src="/icon/newest-white.png" v-show="selectedTag==='最新内容'">
            最新内容
          </li>
          <li class="tag"
              :class="{'active-tag':selectedTag!=='最新内容'&&selectedTag!=='近期热门'&&selectedTag!=='为你推荐'&&selectedTag!=='我的订阅'}"
              @click="showTechTagsSelector=true">
            <img src="/icon/channel-black.png" v-show="selectedTag==='最新内容'||selectedTag==='近期热门'||selectedTag==='为你推荐'||selectedTag==='我的订阅'">
            <img src="/icon/channel-white.png" v-show="selectedTag!=='最新内容'&&selectedTag!=='近期热门'&&selectedTag!=='为你推荐'&&selectedTag!=='我的订阅'">
            技术频道
          </li>
        </ul>
        <ul class="list">
          <li>技术社区
            <div class="line"></div>
          </li>
          <li>
            <a class="tag" href="#">
              <img src="/icon/tag/artificial-intelligence.png">人工智能
            </a>
          </li>
          <li>
            <a class="tag" href="#">
              <img src="/icon/tag/machine.png">芯片软硬件
            </a>
          </li>
        </ul>
        <ul class="list">
          <li>技术频道
            <div class="line"></div>
          </li>
          <li class="tag" :class="{'invert-tag':val.name===selectedTag}" v-for="val in techChannels" @click="clickTechTag(val.name)">
            <img :src="val.icon">{{val.name}}
          </li>
        </ul>
        <section class="tech-tags-selector" v-show="showTechTagsSelector">
          <ul class="content">
            <li class="return" @click="showTechTagsSelector=false">
              <img class="return" src="/icon/down-arrow-white.png">
            </li>
            <li class="tag" :class="{'invert-tag':val.name===selectedTag}" v-for="val in techChannels" @click="clickTechTag(val.name)">
              <img :src="val.icon">{{val.name}}
            </li>
          </ul>
        </section>
      </section>
      <section class="center">
        <section class="carousel">
          <carousel :len="recommendCarouselInfo.length"
                    v-if="recommendCarouselInfo">
            <carousel-item v-for="(val,index) in $readyForCarousel(recommendCarouselInfo)" :key="index">
              <div class="slide">
                <img :src="val.img">
                <div class="mask"></div>
                <p class="title" v-if="val.title">{{val.title}}</p>
              </div>
            </carousel-item>
          </carousel>
        </section>
        <section class="articles">
          <section class="labels">
            <label v-if="selectedTag!=='近期热门'&&selectedTag!=='我的订阅'">{{selectedTag}}</label>
            <section v-else-if="selectedTag==='我的订阅'">
              <section class="set-option" v-if="showOption">
                <section class="left-side">
                  <input type="checkbox" v-model="articleOption.ignoreSelf">不看自己
                  <input type="checkbox" v-model="articleOption.onlyRecommend">只看推荐
                  <input type="checkbox" v-model="articleOption.autoUpdate">自动更新
                </section>
                <section class="right-side">
                  <button class="cancel" @click="showOption=false">取消</button>
                  <button class="save" @click="saveArticleOption">保存</button>
                </section>
              </section>
              <section class="show-option" v-else>
                <section class="left-side">
                  <span>我的订阅</span>
                  <label v-show="articleOption.ignoreSelf">| 不看自己</label>
                  <label v-show="articleOption.onlyRecommend">| 只看推荐</label>
                  <label v-show="articleOption.autoUpdate">| 自动更新</label>
                </section>
                <button class="option-button" @click="showOption=true">推送配置</button>
              </section>
            </section>
            <section class="hottest-by" v-else>
              <label :class="{'active-label':hottestByIndex===0}" @click="hottestByIndex=0">日热门</label>
              <label :class="{'active-label':hottestByIndex===1}" @click="hottestByIndex=1">周热门</label>
              <label :class="{'active-label':hottestByIndex===2}" @click="hottestByIndex=2">月热门</label>
            </section>
          </section>
          <section class="article-list">
            <section class="update" v-show="socketArticles.length>0" @click="pushToArticles">更新了{{socketArticles.length}}条内容，点击查看</section>
            <down-fetch-content :fetch="fetchArticle">
              <ul>
                <li class="article" v-for="val in articles">
                  <section class="left-side">
                    <p class="tag-line" v-show="user">来自标签<a class="tag" href="#">{{val.tag}}</a></p>
                    <nuxt-link class="goto" tabindex="2" :to="'/article/'+val.id">
                      <h2 class="title">{{val.name}}
                        <img :src="val.image" v-show="val.image">
                      </h2>
                      <p class="first-paragraph">{{val.firstParagraph}}</p>
                    </nuxt-link>
                    <div class="bottom">
                      <div class="good">
                        <img class="green" src="/icon/good-green-full.png">
                        <img class="white" src="/icon/good-white-full.png">
                      </div>
                      <span class="good-number" v-show="val.goodNum>0">x {{val.goodNum}} ·</span>赞
                      <a class="author">{{val.author}}</a>
                      <user-authentication :text="val.authorAuthentication"></user-authentication>
                      <span class="datetime">{{$formatDatetime(val.datetime)}}</span>
                    </div>
                  </section>
                  <section class="right-side" v-show="val.image">
                    <img :src="val.image">
                  </section>
                </li>
              </ul>
            </down-fetch-content>
          </section>
        </section>
      </section>
      <section class="right">
        <div class="community-event" v-if="communityEvent">
          <a :href="communityEvent.link">{{communityEvent.banner}}</a>
        </div>
        <section class="recommend-lesson">
          <div class="top">
            <span>课程推荐</span>
            <div class="button-group">
              <div class="swiper-prev" @click="recommendLessonChange(-1)">
                <img src="/icon/arrow-down-white.png">
              </div>
              <div class="swiper-next" @click="recommendLessonChange(1)">
                <img src="/icon/arrow-down-white.png">
              </div>
            </div>
          </div>
          <carousel ref="recommendLessonCarousel" :len="recommendLesson.length" :interval="3000"
                    v-if="recommendLesson">
            <carousel-item v-for="(val,index) in $readyForCarousel(recommendLesson)" :key="index">
              <div class="slide">
                <img :src="val.img">
                <p class="name">{{val.name}}</p>
                <div class="rating">
                  <star-rating :rating="val.rank"></star-rating>
                  <label class="number">({{val.join}}人参与)</label>
                </div>
                <div class="price">
                  <label class="new">￥{{val.price}}</label>
                  <label class="old" v-show="val.oldPrice">￥{{val.oldPrice}}</label>
                </div>
              </div>
            </carousel-item>
          </carousel>
        </section>
        <div class="recommend-event">
          <section class="head">
            <label>活动推荐</label>
            <a href="#">更多</a>
          </section>
          <ul class="events">
            <li v-for="val in eventDescription">
              <div class="left-side">
                <div class="month">{{$getMonthEn(val.datetime).toUpperCase()}}</div>
                <div class="day">{{new Date(val.datetime).getDate()}}</div>
              </div>
              <div class="right-side">
                <a class="name" href="#">{{val.name}}</a>
                <p class="info">
                  {{val.city}} · {{$formatDate(val.datetime)}} {{$getWeekDay(val.datetime)}}
                  <label class="yellow" v-if="val.joining">报名中</label>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
  import {eventBus, SUCCESS_LOGIN} from "../assets/js/event-bus";
  import {
    GET_ARTICLE_BY,
    GET_CHECK_ARTICLE_HOTTEST,
    GET_CHECK_ARTICLE_NEWEST,
    GET_CHECK_ARTICLE_RECOMMEND,
    GET_COMMUNITY_EVENT,
    GET_EVENTS_DESCRIPTION_LESS,
    GET_HOTTEST_ARTICLE,
    GET_NEWEST_ARTICLE,
    GET_RECOMMEND_ARTICLE,
    GET_RECOMMEND_CAROUSEL_INFO,
    GET_RECOMMEND_LESSON,
    POST_CHECK_ARTICLE_OPTION,
    SOCKET_ARTICLE
  } from "../assets/js/api";
  import StarRating from "../components/StarRating";
  import DownFetchContent from "../components/DownFetchContent";
  import Carousel from "../components/Carousel";
  import CarouselItem from "../components/CarouselItem";
  import {CAROUSEL_NEXT, CAROUSEL_PREV} from "../assets/js/const";
  import UserAuthentication from "../components/UserAuthentication";

  const CHANGE_TAG = 'changeTag', LEAVE = 'leave'
  let isOpenSocket = false

  export default {
    components: {UserAuthentication, CarouselItem, Carousel, DownFetchContent, StarRating},
    head() {
      let prefix = this.selectedTag
      if (prefix !== '为你推荐' && prefix !== '我的订阅') {
        prefix += ' - '
      } else {
        prefix = ''
      }
      const len = this.socketArticles.length
      if (len > 0) {
        prefix = '(' + len + ') ' + prefix
      }
      return {
        title: prefix + 'SegmentFault 思否'
      }
    },
    data() {
      return {
        showTechTagsSelector: false,
        showOption: false,
        selectedTag: '为你推荐',
        techChannels: [
          {
            icon: require('static/icon/tag/front-end.png'),
            name: '前端',
          },
          {
            icon: require('static/icon/tag/back-end.png'),
            name: '后端',
          },
          {
            icon: require('static/icon/tag/small-program.png'),
            name: '小程序',
          },
          {
            icon: require('static/icon/tag/ai.png'),
            name: 'AI',
          },
          {
            icon: require('static/icon/tag/cloud-compute.png'),
            name: '云计算',
          },
          {
            icon: require('static/icon/tag/block-chain.png'),
            name: '区块链',
          },
          {
            icon: require('static/icon/tag/security.png'),
            name: '安全',
          },
          {
            icon: require('static/icon/tag/android.png'),
            name: 'Android',
          },
          {
            icon: require('static/icon/tag/ios.png'),
            name: 'iOS',
          },
          {
            icon: require('static/icon/tag/tool.png'),
            name: '工具',
          },
          {
            icon: require('static/icon/tag/programmer.png'),
            name: '程序员',
          },
          {
            icon: require('static/icon/tag/industry.png'),
            name: '行业',
          },
          {
            icon: require('static/icon/tag/sf-official.png'),
            name: 'SF官方',
          },
          {
            name: '更多标签',
            icon: require('static/icon/tag.png'),
          }
        ],
        hottestByIndex: 0,
        articles: [],
        socketArticles: [],
        articleOption: {autoUpdate: false},
        page: 0,
      }
    },
    async asyncData({app}) {
      const [communityEvent, recommendCarouselInfo, recommendLesson] = await Promise.all([
        app.$axios.$get(GET_COMMUNITY_EVENT),
        app.$axios.$get(GET_RECOMMEND_CAROUSEL_INFO),
        app.$axios.$get(GET_RECOMMEND_LESSON),
      ])
      return {
        communityEvent, recommendCarouselInfo, recommendLesson
      }
    },
    async fetch({app, store}) {
      const data = await app.$axios.$get(GET_EVENTS_DESCRIPTION_LESS)
      store.commit('setEventsDescriptionLess', data)
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      eventDescription() {
        return this.$store.state.eventsDescriptionLess
      },
      tag() {
        if (this.selectedTag === '近期热门') {
          return this.selectedTag + '-' + this.hottestByIndex
        } else {
          return this.selectedTag
        }
      }
    },
    watch: {
      'articleOption.autoUpdate'(val) {
        if (val) {
          this.openSocketIO()
        } else {
          this.$emit(LEAVE)
        }
      },
      selectedTag() {
        this.articles = []
        this.socketArticles = []
        this.page = 0
        this.fetchArticle()
        if (this.user) {
          this.$emit(CHANGE_TAG)
        }
      },
      hottestByIndex() {
        this.articles = []
        this.socketArticles = []
        this.fetchArticle()
        if (this.user) {
          this.$emit(CHANGE_TAG)
        }
      }
    },
    methods: {
      recommendLessonChange(bias) {
        if (bias > 0) {
          this.$refs.recommendLessonCarousel.$emit(CAROUSEL_NEXT)
        } else {
          this.$refs.recommendLessonCarousel.$emit(CAROUSEL_PREV)
        }
      },
      saveArticleOption() {
        this.$store.commit('setRecommendArticleOption', this.articleOption)
        this.$axios.post(POST_CHECK_ARTICLE_OPTION, this.articleOption)
        this.showOption = false
      },
      fetchArticle(finish) {
        const isLogin = this.user
        let url, params = {}
        if (isLogin) {
          switch (this.selectedTag) {
            case "我的订阅":
              url = GET_CHECK_ARTICLE_RECOMMEND
              break
            case '近期内容':
              url = GET_CHECK_ARTICLE_NEWEST
              break
            case '最热内容':
              url = GET_CHECK_ARTICLE_HOTTEST
              params = {index: this.hottestByIndex}
              break;
            default:
              url = GET_ARTICLE_BY
              params = {by: this.selectedTag}
              break
          }
        } else {
          switch (this.selectedTag) {
            case "为你推荐":
              url = GET_RECOMMEND_ARTICLE
              break
            case '近期内容':
              url = GET_NEWEST_ARTICLE
              break
            case '最热内容':
              url = GET_HOTTEST_ARTICLE
              params = {index: this.hottestByIndex}
              break;
            default:
              url = GET_ARTICLE_BY
              params = {by: this.selectedTag}
              break
          }
        }
        params.page = this.page++
        let config = {params}
        this.$axios.get(url, config).then(response => {
          response.data.forEach(val => this.articles.push(val))
          if (finish) {
            finish()
          }
        })
      },
      clickTechTag(val) {
        this.showTechTagsSelector = false
        if (val === '更多标签') {
          // todo 跳转标签页
        } else {
          this.selectedTag = val
        }
      },
      pushToArticles() {
        this.socketArticles.forEach(val => this.articles.unshift(val))
        this.socketArticles = []
      },
      openSocketIO() {
        if (isOpenSocket) {
          return
        }
        const io = require('socket.io-client')
        const socket = io(SOCKET_ARTICLE + this.user.name)
        socket.on('connect', () => {
          isOpenSocket = true
          socket.on('article', (article) => {
            this.socketArticles.push(article)
          })
          this.$on(CHANGE_TAG, () => {
            socket.emit(CHANGE_TAG, this.tag)
          })
          this.$on(LEAVE, () => {
            socket.close()
            isOpenSocket = false
          })
        })
      }
    },
    mounted() {
      eventBus.$on(SUCCESS_LOGIN, () => {
        this.articles = []
        this.fetchArticle()
        Object.assign(this.articleOption, this.user.recommendArticleOption)
        if (this.selectedTag === '为你推荐') {
          this.selectedTag = '我的订阅'
        }
        if (this.articleOption.autoUpdate) {
          this.openSocketIO()
        }
      })
      this.$store.commit('setHomeActiveMenu', '首页')
      this.fetchArticle()
    },
    beforeDestroy() {
      this.$emit(LEAVE)
    }
  }
</script>

<style lang="scss">
  /* Sample `apply` at-rules with Tailwind CSS
  #Index {
    @apply min-h-screen flex justify-center items-center text-center mx-auto;
  }
  */
  @import "../assets/css/var";

  #Index {
    .content {
      display: flex;
      margin-top: 30px;
      padding-bottom: 30px;

      .left {
        flex-basis: 170px;
        box-sizing: border-box;
        padding-right: 10px;
        @media(max-width: 992px) {
          flex-basis: 0;
          margin-bottom: 15px;
        }

        .tag {
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 3px;
          font-size: 1.4rem;
          color: #757575;
          display: flex;
          align-items: center;
          @media(max-width: 992px) {
            margin-bottom: 5px;
          }

          img {
            width: 14px;
            height: 14px;
            margin-right: 10px;
            @media(max-width: 992px) {
              margin-right: 5px;
            }
          }

          &:hover {
            background-color: $light-green;
          }
        }

        .active-tag, .invert-tag {
          background-color: $green;
          color: white;

          &:hover {
            background-color: $green;
          }
        }

        .invert-tag {
          img {
            filter: brightness(0) invert(1);
          }
        }

        .top {
          .tag:nth-child(4) {
            display: none;
            @media(max-width: 992px) {
              display: inline-flex;
            }
          }

          @media(max-width: 992px) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }

        .list {
          li:nth-child(1) {
            font-size: 1.4rem;
            color: #212121;
            padding: 10px 0 10px 5px;
            box-sizing: border-box;

            .line {
              width: 95px;
              height: 1px;
              background-color: #eeeeee;
              display: inline-block;
              transform: translateY(-4px);
            }
          }

          @media(max-width: 992px) {
            display: none;
          }
        }

        .tech-tags-selector {
          position: fixed;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.3);
          z-index: 100;
          width: 100%;
          height: 100%;

          .content {
            position: relative;
            background-color: white;
            width: 80%;
            max-height: 80vh;
            margin: 10vh auto auto;
            padding: 30px 20px 10px;
            box-sizing: border-box;
            border-radius: 4px;
            overflow: auto;

            .return {
              position: absolute;
              left: 5px;
              top: 5px;
              width: 16px;
              height: 16px;
              cursor: pointer;

              img {
                filter: invert(100%);
                transform: rotate(90deg);
              }
            }
          }
        }
      }

      .center {
        width: calc(100% - 170px - 255px);
        padding: 0 10px;
        box-sizing: border-box;
        @media(max-width: 992px) {
          width: 100%;
        }

        .carousel {
          border-radius: 4px;
          overflow: hidden;
          position: relative;

          .slide {
            width: 100%;
            height: 150px;
            position: relative;

            img {
              width: 100%;
              height: 150px;
            }

            .mask {
              position: absolute;
              width: 100%;
              height: 50%;
              left: 0;
              bottom: 0;
              background: linear-gradient(to top, black, rgba(0, 0, 0, 0));
            }

            .title {
              position: absolute;
              left: 0;
              bottom: 20px;
              width: 100%;
              padding: 0 20px;
              box-sizing: border-box;
              color: white;
              font-size: 2.4rem;
            }
          }

          .swiper-pagination {
            justify-content: flex-end;
            padding-right: 20px;
          }
        }

        .articles {
          padding-top: 20px;

          .labels {
            border-bottom: 1px solid #dddddd;
            padding-bottom: 10px;
            margin-bottom: 10px;

            label {
              font-size: 1.6rem;
              color: #212121;
            }

            .hottest-by {
              padding-top: 10px;

              label {
                cursor: pointer;
                margin-right: 10px;
                color: $green;
                font-size: 1.4rem;
                padding: 15px;
              }

              .active-label {
                background-color: white;
                border: 1px solid #dddddd;
                border-bottom: none;
                border-radius: 4px;
                color: #212121;
              }
            }

            .set-option {
              font-size: 1.4rem;
              color: #212121;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .left-side {
                input {
                  margin-right: 5px;
                }

                input:nth-child(2), input:nth-child(3) {
                  margin-left: 30px;
                }
              }

              .right-side {
                font-size: 1.2rem;

                button {
                  padding: 5px 10px;
                  border-radius: 3px;
                }

                .cancel {
                  border: 1px solid #dddddd;

                  &:hover {
                    background-color: #dddddd;
                  }
                }

                .save {
                  background-color: #5cb85c;
                  margin-left: 5px;
                  color: white;

                  &:hover {
                    background-color: $darker-green;
                  }
                }
              }
            }

            .show-option {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .left-side {
                span {
                  font-size: 1.6rem;
                  color: #212121;
                  @media(max-width: 500px) {
                    font-size: 1.4rem;
                  }
                }

                label {
                  font-size: 1.3rem;
                  color: gray;
                  margin-left: 10px;
                  @media(max-width: 500px) {
                    font-size: 1.2rem;
                  }
                }
              }

              .option-button {
                font-size: 1.2rem;
                padding: 5px;
                border: 1px solid #dddddd;
                border-radius: 3px;
                @media(max-width: 500px) {
                  display: none;
                }

                &:hover {
                  background-color: #dddddd;
                }
              }
            }
          }

          .update {
            background-color: #d9edf7;
            color: $green;
            border: 1px solid transparent;
            padding: 10px 0;
            margin-top: 5px;
            margin-bottom: 15px;
            font-size: 1.4rem;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;

            &:hover {
              border-color: $green;
            }
          }

          .article {
            margin-bottom: 20px;
            display: flex;

            .left-side {
              width: 80%;
              flex-grow: 1;

              .tag-line {
                font-size: 1.4rem;
                color: #9E9E9E;
                padding: 5px 0;

                a {
                  margin-left: 5px;

                  &:hover {
                    text-decoration: underline;
                  }
                }
              }

              .goto {
                cursor: pointer;
                display: block;

                &:focus {
                  text-decoration: underline;
                }
              }

              .title {
                font-size: 1.8rem;
                color: #212121;
                line-height: 1.5;
                margin-bottom: 5px;
                display: flex;
                justify-content: space-between;

                img {
                  width: 80px;
                  max-height: 80px;
                  display: none;
                  margin-left: 10px;
                  @media (max-width: 500px) {
                    display: block;
                  }
                }
              }

              .first-paragraph {
                text-overflow: ellipsis;
                overflow: hidden;
                color: #888888;
                font-size: 1.3rem;
                line-height: 1.5;
                margin-bottom: 10px;
              }

              .bottom {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                font-size: 1.4rem;
                color: #666;

                .good {
                  border-radius: 50%;
                  overflow: hidden;
                  width: 20px;
                  height: 20px;
                  background-color: #C8E9DE;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;

                  img {
                    width: 12px;
                    height: 12px;
                  }

                  .white {
                    display: none;
                  }

                  &:hover {
                    background-color: #017E66;

                    .green {
                      display: none;
                    }

                    .white {
                      display: block;
                    }
                  }
                }

                .good-number {
                  margin: 0 5px;
                  color: $green;
                }

                .author {
                  color: gray;
                  margin-left: 10px;
                  margin-right: 5px;

                  &:hover {
                    text-decoration: underline;
                  }
                }

                .datetime {
                  color: #999999;
                  margin-left: 10px;
                  font-size: 1.3rem;
                }
              }
            }

            .right-side {
              width: 20%;
              padding-left: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              @media(max-width: 500px) {
                display: none
              }
            }
          }
        }
      }

      .right {
        width: 255px;
        padding-left: 10px;
        box-sizing: border-box;
        @media(max-width: 992px) {
          display: none;
        }

        .community-event {
          padding: 20px 5px;
          box-sizing: border-box;
          line-height: 1.1;
          background: #FCF8E3;
          color: #8a6d3b;
          font-size: 1.2rem;
          margin-bottom: 20px;
          text-align: center;
          border-radius: 5px;
          border: 1px solid #faebcc;
          letter-spacing: 1px;

          a {
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .recommend-lesson {
          padding: 15px 15px;
          box-sizing: border-box;
          background-color: #fafafa;
          margin-bottom: 20px;
          border-radius: 1px;

          .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding-bottom: 10px;
            color: $green;
            font-size: 1.6rem;
            font-weight: 500;

            .button-group {
              display: flex;
              align-items: center;

              .swiper-prev, .swiper-next {
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background-color: $green;
                padding: 2px;
                cursor: pointer;

                img {
                  width: 10px;
                  height: 10px;
                  transform: rotate(90deg);
                }

                &:hover {
                  background-color: $darker-green;
                }
              }

              .swiper-next {
                transform: rotate(180deg);
                margin-left: 5px;
              }
            }

          }

          .slide {
            width: 100%;

            img {
              width: 192px;
              height: 108px;
            }

            .name {
              color: black;
              font-weight: bold;
              margin-top: 10px;
              margin-bottom: 5px;
              font-size: 1.4rem;
            }

            .rating {
              display: flex;
              align-items: center;
              margin-bottom: 5px;

              .number {
                font-size: 1.2rem;
                color: #999999;
              }
            }

            .price {
              .new {
                font-size: 1.4rem;
                font-weight: bold;
                color: red;
              }

              .old {
                font-size: 1.2rem;
                color: gray;
                text-decoration: line-through;
              }
            }
          }
        }

        .recommend-event {
          .head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 1.6rem;
            color: #212121;
            margin-bottom: 20px;

            a {
              font-size: 1.4rem;
              color: $green;
            }
          }

          .events {
            li {
              display: flex;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px dashed #dddddd;

              .left-side {
                text-align: center;
                color: #017E66;
                width: 50px;

                .month {
                  font-size: 1.0rem;
                  background-color: #C8E9DE;
                  padding: 2px 0;
                }

                .day {
                  font-size: 1.4rem;
                  background-color: #EBF7F3;
                }
              }

              .right-side {
                flex-grow: 1;
                padding-left: 10px;
                box-sizing: border-box;

                .name {
                  font-size: 1.4rem;
                  font-weight: 500;
                  line-height: 1.3;
                  color: #212121;
                  margin-bottom: 5px;

                  &:hover {
                    text-decoration: underline;
                  }
                }

                .info {
                  font-size: 1.2rem;
                  color: gray;

                  .yellow {
                    color: #F5A623;;
                    margin-left: 5px;
                  }
                }
              }
            }
          }
        }
      }

      @media(max-width: 992px) {
        flex-direction: column;
      }
    }
  }
</style>
