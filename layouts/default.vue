<template>
  <div ref="container" id="Default" @scroll="onContainerScroll">
    <header ref="default-layout-header">
      <section class="top"></section>
      <section class="default-container bottom">
        <div class="side">
          <img src="/icon/search-dark.png" @click="">
        </div>
        <div class="left">
          <logo></logo>
          <ul class="menu">
            <li :class="{'active-li':activeLi==='首页'}">
              <nuxt-link to="/" tag="span">首页</nuxt-link>
            </li>
            <li :class="{'active-li':activeLi==='问答'}">
              <nuxt-link to="/questions" tag="span">问答</nuxt-link>
            </li>
            <li :class="{'active-li':activeLi==='专栏'}">
              <nuxt-link to="/article-channels" tag="span">专栏</nuxt-link>
            </li>
            <li :class="{'active-li':activeLi==='课程'}">课程</li>
            <li :class="{'active-li':activeLi==='圈子'}">圈子</li>
            <li :class="{'active-li':activeLi==='发现'}">发现
              <div class="triangle"></div>
              <div class="popup border-shadow">
                <ul class="left-side">
                  <li class="left-item">
                    <nuxt-link to="/events">活动</nuxt-link>
                  </li>
                  <li class="left-item">
                    <nuxt-link to="/tags">标签</nuxt-link>
                  </li>
                  <li class="left-item">酷工作</li>
                  <li class="left-item">
                    <nuxt-link to="/rp-board">排行榜</nuxt-link>
                  </li>
                  <li class="left-item">徽章</li>
                  <li class="left-item" @click="toNotes">笔记</li>
                  <li class="left-item">
                    <a href="https://docs.segmentfault.com/">开发手册</a>
                    <div class="img">
                      <img src="/icon/down-arrow-white.png">
                    </div>
                  </li>
                  <li class="left-item">广告投放
                    <div class="img">
                      <img src="/icon/down-arrow-white.png">
                    </div>
                  </li>
                </ul>
                <ul class="right-side">
                  <li class="right-item" v-for="val in eventsDescriptionInMenu">
                    <p>{{val.name}}</p>
                    <div>
                      {{val.city}} · {{$formatDate(val.datetime)}} {{$getWeekDay(val.datetime)}} <span class="joining" v-if="val.joining">报名中</span>
                    </div>
                  </li>
                  <li class="more">
                    <nuxt-link to="/events">查看更多活动</nuxt-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div class="search-box">
            <input class="common-input" v-model="searchTxt" placeholder="搜索问题或关键字" @keypress.enter="search">
            <img src="/icon/search-dark.png" @click="search">
          </div>
        </div>
        <div class="right">
          <div class="no-login" v-if="!user">
            <button class="login-button" @click="showLoginCard=true">立即登录</button>
            <button class="register-button" @click="showRegisterCard=true">免费注册</button>
          </div>
          <div class="already-login" v-else>
            <div class="creation" tabindex="2">
              <div class="word">
                创建
                <div class="triangle"></div>
              </div>
              <img class="cross" src="/icon/add.png">
              <div class="popup  border-shadow">
                <ul class="popup-top">
                  <li>提问题</li>
                  <li>发头条</li>
                  <li>写文章</li>
                  <li>做笔记</li>
                </ul>
                <div class="popup-bottom">草稿箱</div>
              </div>
            </div>
            <div class="notification" tabindex="0" @focusout="clearNewNotificationNumber">
              <img src="/icon/msg-tip.png">
              <div class="red-circle" v-if="exitNewNotification"></div>
              <div class="popup border-shadow">
                <div class="banner">
                  <div class="item" :class="{'item-active':notificationPopupBannerIndex===0}" @click="notificationPopupBannerIndex=0">
                    <img src="/icon/notification-black.png" v-show="notificationPopupBannerIndex!==0">
                    <img src="/icon/notification-green.png" v-show="notificationPopupBannerIndex===0">
                  </div>
                  <div class="item" :class="{'item-active':notificationPopupBannerIndex===1}" @click="notificationPopupBannerIndex=1">
                    <img src="/icon/chat-black.png" v-show="notificationPopupBannerIndex!==1">
                    <img src="/icon/chat-green.png" v-show="notificationPopupBannerIndex===1">
                  </div>
                  <div class="item" :class="{'item-active':notificationPopupBannerIndex===2}" @click="notificationPopupBannerIndex=2">
                    <img src="/icon/good-black.png" v-show="notificationPopupBannerIndex!==2">
                    <img src="/icon/good-green.png" v-show="notificationPopupBannerIndex===2">
                  </div>
                  <div class="item" :class="{'item-active':notificationPopupBannerIndex===3}" @click="notificationPopupBannerIndex=3">
                    <img src="/icon/fans-black.png" v-show="notificationPopupBannerIndex!==3">
                    <img src="/icon/fans-green.png" v-show="notificationPopupBannerIndex===3">
                  </div>
                </div>
                <div class="content" @scroll="onNotificationContentScroll">
                  <ul class="article-notification" v-show="notificationPopupBannerIndex===0">
                    <li class="item" v-for="val in articleNotifications" :class="{'no-read':!val.read}">
                      {{val.author}}<span>发布了新文章</span>{{val.name}}
                    </li>
                  </ul>
                  <ul class="chat-notification" v-show="notificationPopupBannerIndex===1">
                    <li class="item" v-for="val in chatNotification" :class="{'no-read':!val.read}">
                      <span class="green">{{val.author}}</span>
                      <span v-if="val.questionName">
                        <span v-if="val.answer">回答了您的问题</span>
                        <span v-else>回复了你在问题</span>
                        <span class="green">{{val.questionName}}</span>
                        <span v-if="!val.answer">中的评论</span>
                      </span>
                      <span v-else>
                        <span v-if="val.answer">评论了您的文章</span>
                        <span v-else>回复了你在文章</span>
                        <span class="green">{{val.articleName}}</span>
                        <span v-if="!val.answer">中的评论</span>
                      </span>
                      ：{{val.content}}<label>{{$formatDatetime(val.datetime)}}</label>
                    </li>
                  </ul>
                  <ul class="good-notification" v-show="notificationPopupBannerIndex===2">
                    <li v-for="val in goodNotification" :class="{'no-read':!val.read}">
                      <span>{{val.target}}</span>点赞了您<label v-if="val.goodAnswerInQuestion">在问题<span>{{val.goodAnswerInQuestion}}</span>中的回答</label><label
                      v-else-if="val.goodArticle">的文章<span>{{val.goodArticle}}</span></label>
                      <label class="datetime">{{$formatDatetime(val.datetime)}}</label>
                    </li>
                  </ul>
                  <ul class="fans-notification" v-show="notificationPopupBannerIndex===3">
                    <li v-for="val in fansNotification" :class="{'no-read':!val.read}">
                      <span>{{val.fanName}}</span>关注了您<label>{{$formatDatetime(val.datetime)}}</label>
                    </li>
                  </ul>
                  <img class="loading" src="/icon/loading-green.png" v-show="showNotificationLoading">
                </div>
                <div class="popup-bottom">
                  <div class="read-all" @click="readAll"><img src="/icon/round-right-black.png">全部标记为已读</div>
                  <div class="see-all">查看全部</div>
                </div>
                <label class="article-number" v-if="newNotificationNumber&&newNotificationNumber.newArticle>0">
                  {{newNotificationNumber.newArticle>=100?'99+':newNotificationNumber.newArticle}}
                </label>
                <label class="chat-number" v-if="newNotificationNumber&&newNotificationNumber.newChat>0">
                  {{newNotificationNumber.newChat>=100?'99+':newNotificationNumber.newChat}}
                </label>
                <label class="good-number" v-if="newNotificationNumber&&newNotificationNumber.newGood>0">
                  {{newNotificationNumber.newGood>=100?'99+':newNotificationNumber.newGood}}
                </label>
                <label class="fans-number" v-if="newNotificationNumber&&newNotificationNumber.newFans>0">
                  {{newNotificationNumber.newFans>=100?'99+':newNotificationNumber.newFans}}
                </label>
              </div>
            </div>
            <div class="chat-message" tabindex="1" @focusout="clearNewChatNumber">
              <img src="/icon/msg.png">
              <div class="red-circle" v-if="exitNewChatMsg"></div>
              <div class="popup border-shadow">
                <div class="banner">最近的私信</div>
                <ul class="content" @scroll="onChatMsgContentScroll">
                  <li class="item" v-for="val in chatMsg" v-show="chatMsg&&chatMsg.length>0">
                    <span class="green">{{val.author}}</span>：{{val.content}}<span class="datetime">{{$formatDatetime(val.datetime)}}</span>
                  </li>
                  <li class="word" v-show="!chatMsg||chatMsg.length===0">没有人给你发私信</li>
                </ul>
                <div class="popup-bottom">
                  <span>查看全部</span>
                </div>
              </div>
            </div>
            <div class="user" @mouseenter="avatarMouseEnter" @mouseleave="avatarMouseLeave">
              <div class="avatar">
                <img :src="user.avatar?user.avatar:defaultAvatar">
                <div class="mask"></div>
              </div>
              <div class="popup" v-show="showPopup">
                <div class="popup-top">
                  <div class="prestige">{{$formatNumber(user.prestige)}} 声望</div>
                  <div class="star">
                    <div class="icon1">
                      <img src="/icon/star-white.png">
                    </div>
                    {{$formatNumber(user.star1,99)}}
                  </div>
                  <div class="star">
                    <div class="icon2">
                      <img src="/icon/star-white.png">
                    </div>
                    {{$formatNumber(user.star2,99)}}
                  </div>
                  <div class="star">
                    <div class="icon3">
                      <img src="/icon/star-white.png">
                    </div>
                    {{$formatNumber(user.star3,99)}}
                  </div>
                </div>
                <div class="center">
                  <ul>
                    <li>我的笔记</li>
                    <li>我的收藏</li>
                    <li>受邀回答</li>
                    <li>付费问答</li>
                  </ul>
                  <ul>
                    <li>我的主页</li>
                    <li>我的档案</li>
                    <li>我的资产</li>
                    <li>个人设置</li>
                    <li>退出</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="md-avatar" @click="showLoginCard=true" v-show="!user">
            <img src="/icon/user.png">
          </div>
        </div>
      </section>
      <section class="hot-tag-group default-container" v-show="showTagGroup">
        <nuxt-link v-for="(val,index) in hotTagsGroup" :to="val.to" :key="index">{{val.name}}</nuxt-link>
      </section>
      <section class="bottom-menu" v-show="showHeaderBottom">
        <nuxt-link to="/">
          <img src="/icon/home-black.png" v-if="activeLi!=='首页'">
          <img src="/icon/home-green.png" v-else>
        </nuxt-link>
        <nuxt-link to="/">
          <img src="/icon/ask-black.png" v-if="activeLi!=='问答'">
          <img src="/icon/ask-green.png" v-else>
        </nuxt-link>
        <nuxt-link to="/article-channels">
          <img src="/icon/article-black.png" v-if="activeLi!=='专栏'">
          <img src="/icon/article-green.png" v-else>
        </nuxt-link>
        <img src="/icon/classroom-black.png">
        <div class="more" tabindex="3">
          <img src="/icon/more-black.png">
          <ul class="popup border-shadow">
            <li>职位</li>
            <li>活动</li>
            <li>标签</li>
            <li>徽章</li>
          </ul>
        </div>
      </section>
    </header>
    <section ref="banner" class="banner" v-if="showBanner">
      <section class="default-container container">
        <section class="left">
          <h1>在 SegmentFault，学习技能、解决问题</h1>
          <p>每个月，我们帮助 1000 万的开发者解决各种各样的技术问题。并助力他们在
            技术能力、职业生涯、影响力上获得提升。</p>
        </section>
        <section class="right">
          <button class="register-button" @click="showRegisterCard=true">免费注册</button>
          <button class="login-button" @click="showLoginCard=true">立即登陆</button>
        </section>
      </section>
      <img class="close" src="/icon/close-banner.png" @click="showBanner=false">
    </section>
    <nuxt></nuxt>
    <footer>
      <ul v-for="(val,index) in footerData">
        {{val.name}}
        <li class="item" v-for="item in val.children">
          <a tabindex="9" :href="item.url" target="_blank">{{item.name}}</a>
        </li>
        <li class="app" v-if="index+1===footerData.length">
          <img src="/app.png">
          扫一扫下载App
        </li>
      </ul>
    </footer>
    <div class="to-top" v-show="showToTop" @click="toTop">回<br/>顶<br/>部</div>
    <div class="login-card" v-show="showLoginCard">
      <div class="mask" @click="showLoginCard=false"></div>
      <div class="card">
        <div class="top">
          登陆
          <div class="close" @click="showLoginCard=false"></div>
        </div>
        <div class="body">
          <div class="content">
            <span class="warn">{{warnMsg}}</span>
            <p>手机号或Email</p>
            <input class="common-input" v-model="username" placeholder="11位手机号或Email">
            <p>密码
              <label>忘记密码</label>
            </p>
            <input class="common-input" type="password" v-model="password" @keypress.enter="login" placeholder="请输入密码" maxlength="12">
            <button class="login" @click="login">登陆</button>
            <button class="to-register" @click="showRegisterCard=true">注册新账号</button>
          </div>
        </div>
      </div>
    </div>
    <div class="register-card" v-show="showRegisterCard">
      <div class="mask" @click="showRegisterCard=false"></div>
      <div class="card">
        <div class="top">
          注册
          <div class="close" @click="showRegisterCard=false"></div>
        </div>
        <div class="body">
          <div class="content">
            <span class="warn">{{warnMsg}}</span>
            <p>你的名字</p>
            <input class="common-input" v-model="username" placeholder="真实姓名或常用昵称" maxlength="12">
            <p>手机号</p>
            <input class="common-input" v-model="phone" placeholder="11位手机号">
            <div class="valid-code">
              <input class="common-input" v-model="validCode" placeholder="右侧的验证码" maxlength="4">
              <label @click="createRealValidateCode">{{realValidateCode}}</label>
            </div>
            <p>密码</p>
            <input class="common-input" type="password" v-model="password" @keypress.enter="register" placeholder="不少于6位的密码" maxlength="12">
            <button class="register" @click="register">注册</button>
            <button class="to-login" @click="showLoginCard=true">已有账号登陆</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mock from 'mockjs'
  import {
    GET_CHECK_CHAT_MESSAGE,
    GET_CHECK_NEW_ARTICLE_NOTIFICATION,
    GET_CHECK_NEW_CHAT_NOTIFICATION,
    GET_CHECK_NEW_FANS_NOTIFICATION,
    GET_CHECK_NEW_GOOD_NOTIFICATION,
    GET_CHECK_NEW_NOTIFICATION_NUMBER,
    POST_CHECK_READ_ALL_ARTICLE_NOTIFICATION,
    POST_CHECK_READ_ALL_CHAT_NOTIFICATION,
    POST_CHECK_READ_ALL_FANS_NOTIFICATION,
    POST_CHECK_READ_ALL_GOOD_NOTIFICATION,
    POST_REGISTER
  } from '../assets/js/api'
  import {
    DEFAULT_LAYOUT_SCROLL_TO,
    eventBus,
    FORCE_EMIT_DEFAULT_LAYOUT_SCROLL,
    ON_DEFAULT_LAYOUT_SCROLL,
    SET_TAG_GROUP_STATUS,
    SHOW_LOGIN__CARD,
    SHOW_REGISTER_CARD,
    SUCCESS_LOGIN
  } from "../assets/js/event-bus";
  import {LS_ACCOUNT} from "../assets/js/const";
  import Logo from "../components/Logo";

  const r = mock.Random
  let sendingLogin = false, sendingRegister = false;
  let fetchingArticle = false, fetchingChat = false, fetchingGood = false, fetchingFans = false, fetchingChatMsg = false

  export default {
    name: "default",
    components: {Logo},
    props: {},
    data() {
      return {
        showBanner: true,
        showPopup: false,
        showLoginCard: false,
        showRegisterCard: false,
        showHeaderBottom: false,
        showToTop: false,
        showTagGroup: false,
        containerRef: undefined,
        notificationPopupBannerIndex: 0,
        searchTxt: '',
        phone: '',
        username: '',
        password: '',
        validCode: '',
        realValidateCode: '',
        warnMsg: '',
        defaultAvatar: require('static/icon/user.png'),
        handler: undefined,
        newNotificationNumber: undefined,
        articleNotifications: undefined,
        chatNotification: undefined,
        goodNotification: undefined,
        fansNotification: undefined,
        chatMsg: [],
        footerData: [
          {
            name: '产品',
            children: [
              {
                name: '热门问答',
                url: ''
              }, {
                name: '热门专栏',
                url: ''
              }, {
                name: '热门课程',
                url: ''
              }, {
                name: '最新活动',
                url: ''
              }, {
                name: '技术圈',
                url: ''
              }, {
                name: '酷工作',
                url: ''
              }, {
                name: '移动客户端',
                url: ''
              }
            ]
          },
          {
            name: '课程',
            children: [
              {
                name: 'Java开发课程',
                url: ''
              }, {
                name: 'PHP开发课程',
                url: ''
              }, {
                name: 'Python开发课程',
                url: ''
              }, {
                name: '前端开发课程',
                url: ''
              }, {
                name: '移动开发课程',
                url: ''
              }
            ]
          },
          {
            name: '资源',
            children: [
              {
                name: '每周精选',
                url: ''
              }, {
                name: '用户排行榜',
                url: ''
              }, {
                name: '徽章',
                url: ''
              }, {
                name: '帮助中心',
                url: ''
              }, {
                name: '声望与权限',
                url: ''
              }, {
                name: '社区服务中心',
                url: ''
              }
            ]
          },
          {
            name: '合作',
            children: [
              {
                name: '关于我们',
                url: ''
              }, {
                name: '广告投放',
                url: ''
              }, {
                name: '职业发布',
                url: ''
              }, {
                name: '讲师招募',
                url: ''
              }, {
                name: '联系我们',
                url: ''
              }
            ]
          },
          {
            name: '关注',
            children: [
              {
                name: '产品技术日志',
                url: ''
              }, {
                name: '社区运营日志',
                url: ''
              }, {
                name: '市场运营日志',
                url: ''
              }, {
                name: '团队日志',
                url: ''
              }, {
                name: '社区访谈',
                url: ''
              }
            ]
          },
          {
            name: '条款',
            children: [
              {
                name: '服务条款',
                url: ''
              }, {
                name: '隐私政策',
                url: ''
              }
            ]
          },
        ],
        hotTagsGroup: [
          {
            name: '全部',
            to: '/questions'
          }, {
            name: 'iOS开发',
            to: '/tag?name=iOS开发'
          },
          {
            name: 'webpack',
            to: '/tag?name=webpack'
          }, {
            name: 'docker',
            to: '/tag?name=docker'
          }, {
            name: 'html',
            to: '/tag?name=html'
          }, {
            name: 'css',
            to: '/tag?name=css'
          }, {
            name: 'nodejs',
            to: '/tag?name=nodejs'
          }, {
            name: 'html5',
            to: '/tag?name=html5'
          }, {
            name: 'javascript',
            to: '/tag?name=javascript'
          }, {
            name: 'mysql',
            to: '/tag?name=mysql'
          }, {
            name: 'visual-studio-code',
            to: '/tag?name=visual-studio-code'
          }, {
            name: '前端',
            to: '/tag?name=前端'
          }, {
            name: 'android',
            to: '/tag?name=android'
          }, {
            name: 'php',
            to: '/tag?name=php'
          }, {
            name: 'vue.js',
            to: '/tag?name=vue.js'
          }, {
            name: 'java',
            to: '/tag?name=java'
          }, {
            name: 'css3',
            to: '/tag?name=css3'
          }, {
            name: '热门标签',
            to: '/tags'
          },
        ],
        previous: 0,
      }
    },
    watch: {
      showRegisterCard(val) {
        sendingRegister = false
        if (val) {
          this.showLoginCard = false
        }
        this.phone = ''
        this.username = ''
        this.password = ''
        this.validCode = ''
        this.warnMsg = ''
        this.createRealValidateCode()
      },
      showLoginCard(val) {
        sendingLogin = false
        if (val) {
          this.showRegisterCard = false
        }
        this.username = '12345678909'
        this.password = 'qwertyu'
        this.warnMsg = ''
      },
      notificationPopupBannerIndex(val) {
        switch (val) {
          case 0:
            if (!this.articleNotifications && !fetchingArticle) {
              fetchingArticle = true
              this.$axios.get(GET_CHECK_NEW_ARTICLE_NOTIFICATION).then(response => {
                fetchingArticle = false
                this.articleNotifications = response.data
              })
            }
            break
          case 1:
            if (!this.chatNotification && !fetchingChat) {
              fetchingChat = true
              this.$axios.get(GET_CHECK_NEW_CHAT_NOTIFICATION).then(response => {
                fetchingChat = false
                this.chatNotification = response.data
              })
            }
            break
          case 2:
            if (!this.goodNotification && !fetchingGood) {
              fetchingGood = true
              this.$axios.get(GET_CHECK_NEW_GOOD_NOTIFICATION).then(response => {
                fetchingGood = false
                this.goodNotification = response.data
              })
            }
            break
          case 3:
            if (!this.fansNotification && !fetchingFans) {
              fetchingFans = true
              this.$axios.get(GET_CHECK_NEW_FANS_NOTIFICATION).then(response => {
                fetchingFans = false
                this.fansNotification = response.data
              })
            }
            break
          default:
            return
        }
      },
      showBanner() {
        this.computeTopHeight()
      }
    },
    computed: {
      eventsDescription() {
        return this.$store.state.eventsDescriptionLess
      },
      eventsDescriptionInMenu() {
        if (this.eventsDescription) {
          const len = this.eventsDescription.length
          return len === 5 ? this.eventsDescription.slice(0, 4) : this.eventsDescription
        } else {
          return undefined
        }
      },
      activeLi() {
        return this.$store.state.homeActiveMenu
      },
      user() {
        return this.$store.state.user
      },
      exitNewNotification() {
        return this.newNotificationNumber && (this.newNotificationNumber.newArticle > 0 ||
          this.newNotificationNumber.newChat > 0 ||
          this.newNotificationNumber.newGood > 0 ||
          this.newNotificationNumber.newFans > 0)
      },
      exitNewChatMsg() {
        return this.newNotificationNumber && this.newNotificationNumber.newChatMsg > 0
      },
      showNotificationLoading() {
        switch (this.notificationPopupBannerIndex) {
          case 0:
            return !this.articleNotifications || this.articleNotifications.length < this.newNotificationNumber.totalArticle
          case 1:
            return !this.chatNotification || this.chatNotification.length < this.newNotificationNumber.totalChat
          case 2:
            return !this.goodNotification || this.goodNotification.length < this.newNotificationNumber.totalGood
          case 3:
            return !this.fansNotification || this.fansNotification.length < this.newNotificationNumber.totalFans
          default:
            return false
        }
      },
    },
    methods: {
      computeTopHeight() {
        let height = this.$refs['default-layout-header'].getBoundingClientRect().height
        if (this.showBanner && this.$refs.banner) {
          height += this.$refs.banner.getBoundingClientRect().height
        }
        this.$store.commit('setDefaultLayoutTopHeight', height)
      },
      toTop() {
        const container = this.containerRef
        container.scrollTop = 0
      },
      onContainerScroll(force) {
        const now = Date.now()
        if (force || now - this.previous >= 100) {
          const top = this.containerRef.scrollTop
          const width = window.innerWidth
          this.showHeaderBottom = width <= 992 && top <= 50
          this.showToTop = width > 992 && top > 50
          eventBus.$emit(ON_DEFAULT_LAYOUT_SCROLL, top)
          this.previous = now
        }
      },
      readAll() {
        let arr, route, attrName
        switch (this.notificationPopupBannerIndex) {
          case 0:
            arr = this.articleNotifications
            route = POST_CHECK_READ_ALL_ARTICLE_NOTIFICATION
            attrName = 'newArticle'
            break
          case 1:
            arr = this.chatNotification
            route = POST_CHECK_READ_ALL_CHAT_NOTIFICATION
            attrName = 'newChat'
            break
          case 2:
            arr = this.goodNotification
            route = POST_CHECK_READ_ALL_GOOD_NOTIFICATION
            attrName = 'newGood'
            break
          case 3:
            arr = this.fansNotification
            route = POST_CHECK_READ_ALL_FANS_NOTIFICATION
            attrName = 'newFans'
            break
        }
        arr.forEach(val => val.read = true)
        this.$axios.post(route).then(() => {
          this.newNotificationNumber[attrName] = 0
        })
      },
      fetchNotifications() {
        switch (this.notificationPopupBannerIndex) {
          case 0:
            if (this.showNotificationLoading && !fetchingArticle) {
              fetchingArticle = true
              this.$axios.get(GET_CHECK_NEW_ARTICLE_NOTIFICATION).then(response => {
                fetchingArticle = false
                this.articleNotifications ? response.data.forEach(val => this.articleNotifications.push(val)) : this.articleNotifications = response.data
              })
            }
            break
          case 1:
            if (this.showNotificationLoading && !fetchingChat) {
              fetchingChat = true
              this.$axios.get(GET_CHECK_NEW_CHAT_NOTIFICATION).then(response => {
                fetchingChat = false
                this.chatNotification ? response.data.forEach(val => this.chatNotification.push(val)) : this.chatNotification = response.data
              })
            }
            break
          case 2:
            if (this.showNotificationLoading && !fetchingGood) {
              fetchingGood = true
              this.$axios.get(GET_CHECK_NEW_GOOD_NOTIFICATION).then(response => {
                fetchingGood = false
                this.goodNotification ? response.data.forEach(val => this.goodNotification.push(val)) : this.goodNotification = response.data
              })
            }
            break
          case 3:
            if (this.showNotificationLoading && !fetchingFans) {
              fetchingFans = true
              this.$axios.get(GET_CHECK_NEW_FANS_NOTIFICATION).then(response => {
                fetchingFans = false
                this.fansNotification ? response.data.forEach(val => this.fansNotification.push(val)) : this.fansNotification = response.data
              })
            }
            break
          default:
            return
        }
      },
      async fetchChatMsg() {
        if (fetchingChatMsg || (this.newNotificationNumber && this.chatMsg.length >= this.newNotificationNumber.totalChatMsg)) {
          return
        }
        fetchingChatMsg = true
        const data = await this.$axios.$get(GET_CHECK_CHAT_MESSAGE)
        fetchingChatMsg = false
        data.forEach(val => this.chatMsg.push(val))
      },
      onChatMsgContentScroll(event) {
        const target = event.target
        const scrollTop = target.scrollTop
        const bias = target.scrollHeight - target.clientHeight
        const reachDown = Math.abs(scrollTop - bias) <= 30
        if (reachDown) {
          this.fetchChatMsg()
        }
      },
      onNotificationContentScroll(event) {
        const target = event.target
        const scrollTop = target.scrollTop
        const bias = target.scrollHeight - target.clientHeight
        const reachDown = Math.abs(scrollTop - bias) <= 30
        if (reachDown) {
          this.fetchNotifications()
        }
      },
      clearNewNotificationNumber() {
        this.newNotificationNumber.newArticle = 0
        this.newNotificationNumber.newChat = 0
        this.newNotificationNumber.newGood = 0
        this.newNotificationNumber.newFans = 0
      },
      clearNewChatNumber() {
        this.newNotificationNumber.newChatMsg = 0
      },
      validPhone(phone) {
        return /^1\d{10}$/.test(phone)
      },
      validEmail(email) {
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
      },
      validUsername(name) {
        return /^[^@#$%&*(),.\/\\<>?|;':"`~\-=+]{6,12}$/.test(name)
      },
      validPassword(password) {
        return /^\w[\w!]{5,11}$/.test(password)
      },
      createRealValidateCode() {
        this.realValidateCode = ''
        for (let i = 0; i < 4; i++) {
          if (r.boolean()) {
            this.realValidateCode += r.integer(0, 9)
          } else {
            this.realValidateCode += r.character()
          }
        }
      },
      avatarMouseEnter() {
        clearTimeout(this.handler)
        this.showPopup = true
      },
      avatarMouseLeave() {
        clearTimeout(this.handler)
        this.handler = setTimeout(() => {
          this.showPopup = false
        }, 1000)
      },
      search() {
        alert(this.searchTxt)
        //  todo search
      },
      onSuccessLogin() {
        this.showLoginCard = false
        sendingLogin = false
        this.showBanner = false
        this.$axios.get(GET_CHECK_NEW_NOTIFICATION_NUMBER).then(response => {
          this.newNotificationNumber = response.data
          if (this.newNotificationNumber.totalArticle > 0) {
            this.$axios.get(GET_CHECK_NEW_ARTICLE_NOTIFICATION).then(response => {
              this.articleNotifications = response.data
            })
          }
          this.fetchChatMsg()
        })
      },
      login() {
        if (sendingLogin) {
          return
        }
        sendingLogin = true
        this.warnMsg = ''
        if (this.validEmail(this.username) || this.validPhone(this.username)) {
          if (!this.validPassword(this.password)) {
            this.warnMsg = '6~12位密码，以字母或数字或下划线开头'
          } else {
            this.$ajax_login({
              account: this.username,
              password: this.password
            })
          }
        } else {
          this.warnMsg = '无效的手机号或邮箱'
        }
      },
      register() {
        if (sendingRegister) {
          return;
        }
        sendingRegister = true
        this.warnMsg = ''
        if (!this.validUsername(this.username)) {
          this.warnMsg = '无效的名字'
          return
        }
        if (!this.validPhone(this.phone)) {
          this.warnMsg = '无效的手机号'
          return
        }
        if (!this.validPassword(this.password)) {
          this.warnMsg = '无效的密码'
          return
        }
        if (this.validCode !== this.realValidateCode) {
          this.warnMsg = '验证码错误'
          return
        }
        this.$axios.post(POST_REGISTER).then(() => {
          // todo after register
          this.showLoginCard = true
          sendingRegister = false
        })
      },
      toNotes() {
        if (this.user) {
          this.$router.push({path: '/notes'})
        } else {
          eventBus.$emit(SHOW_LOGIN__CARD)
        }
      }
    },
    mounted() {
      this.showTagGroup = false
      this.computeTopHeight()
      eventBus.$on(DEFAULT_LAYOUT_SCROLL_TO, (position) => {
        this.containerRef.scrollTop = position
      })
      eventBus.$on(SUCCESS_LOGIN, () => this.onSuccessLogin())
      eventBus.$on(SHOW_LOGIN__CARD, () => this.showLoginCard = true)
      eventBus.$on(SHOW_REGISTER_CARD, () => this.showRegisterCard = true)
      eventBus.$on(FORCE_EMIT_DEFAULT_LAYOUT_SCROLL, () => {
        this.onContainerScroll(true)
      })
      eventBus.$on(SET_TAG_GROUP_STATUS, (status) => {
        this.showTagGroup = status
      })
      this.containerRef = this.$refs['container']
      window.onresize = () => this.onContainerScroll()
      this.onContainerScroll()
      const account = JSON.parse(localStorage.getItem(LS_ACCOUNT))
      if (account) {
        const expires = account.expires
        if (Date.now() <= expires) {
          this.$ajax_login(account)
        } else {
          localStorage.removeItem(LS_ACCOUNT)
        }
      }
    },
    created() {
    },
    destroyed() {
      window.onresize = null
      eventBus.$off(SUCCESS_LOGIN)
      eventBus.$off(SHOW_LOGIN__CARD)
      eventBus.$off(SHOW_REGISTER_CARD)
      eventBus.$off(FORCE_EMIT_DEFAULT_LAYOUT_SCROLL)
      eventBus.$off(SET_TAG_GROUP_STATUS)
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #Default {
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;

    header {
      background-color: #FAFAFA;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);

      .top {
        height: 3px;
        background-color: $green;
      }

      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;

        .side {
          display: none;
          width: 20px;
          height: 20px;
          cursor: pointer;
          opacity: 0.7;

          @media(max-width: 992px) {
            display: block;
          }
        }

        .left {
          display: flex;
          align-items: center;

          .menu {
            margin-left: 10px;
          }

          ul {
            display: flex;
            align-items: center;

            li {
              position: relative;
              padding: 0 12px;
              font-weight: 500;
              font-size: 1.6rem;
              cursor: pointer;
              color: #757575;
              line-height: 34px;
              border-radius: 4px;

              .triangle {
                display: inline-block;
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-top-color: #757575;
                margin-left: 5px;
                transform: translateY(2px);
              }

              .popup {
                position: absolute;
                left: 0;
                width: 380px;
                background-color: white;
                display: none;
                z-index: 100;

                .left-side {
                  min-width: 115px;
                  background-color: #FAFAFA;
                  display: block;

                  .left-item {
                    padding: 2px 20px 2px 10px;
                    display: flex;
                    align-items: center;

                    &:hover {
                      text-decoration: none;
                      color: $green;
                    }

                    a {
                      flex-grow: 1;
                    }

                    .img {
                      padding: 2px;
                      background-color: #F5A623;
                      margin-left: 5px;

                      img {
                        width: 7px;
                        height: 7px;
                        transform: rotate(-135deg);
                      }
                    }
                  }
                }

                .right-side {
                  position: relative;
                  flex-grow: 1;
                  display: block;
                  cursor: default;

                  .right-item {
                    margin-top: 15px;
                    padding: 0 15px;
                    box-sizing: border-box;
                    cursor: default;

                    p {
                      color: $green;
                      font-size: 1.5rem;
                      line-height: 1.2;
                      cursor: pointer;

                      &:hover {
                        text-decoration: underline;
                      }
                    }

                    div {
                      font-size: 1.2rem;
                      color: gray;
                      line-height: 1.2;
                      margin-top: 5px;

                      .joining {
                        color: #F5A623;
                      }
                    }

                    &:hover {
                      background-color: white;
                    }
                  }

                  .more {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    text-align: center;
                    color: gray;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 2px 0;
                  }
                }
              }

              &:hover {
                background-color: #F5F5F5;

                .popup {
                  display: flex;
                }
              }
            }

            .active-li {
              color: $green;
              font-weight: 600;
            }

            @media(max-width: 992px) {
              display: none;
            }
          }

          .search-box {
            position: relative;
            width: 240px;
            margin-left: 30px;

            img {
              position: absolute;
              width: 16px;
              height: 16px;
              top: 7px;
              right: 5px;
              opacity: 0.5;
              cursor: pointer;
            }

            @media(max-width: 992px) {
              display: none;
            }
          }
        }

        .right {
          .no-login {
            display: flex;
            align-items: center;

            .login-button {
              background-color: transparent;
              font-size: 1.4rem;
              color: $green;
              margin-right: 10px;
              padding: 5px 10px;
              border-radius: 4px;

              &:hover {
                background-color: #F5F5F5;
              }
            }

            .register-button {
              background-color: $green;
              font-size: 1.4rem;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;

              &:hover {
                background-color: $darker-green;
              }
            }

            @media(max-width: 992px) {
              display: none;
            }
          }

          .already-login {
            display: flex;
            align-items: center;

            .user {
              position: relative;

              .avatar {
                border-radius: 50%;
                overflow: hidden;
                max-width: 32px;
                min-width: 32px;
                max-height: 32px;
                min-height: 32px;
                cursor: pointer;
                position: relative;

                .mask {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.1);
                  display: none;
                }

                &:hover {
                  .mask {
                    display: block;
                  }
                }
              }

              .popup {
                position: absolute;
                right: 0;
                top: 100%;
                width: 240px;
                z-index: 100;
                margin-top: 5px;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
                background-color: white;

                .popup-top {
                  display: flex;
                  align-items: center;
                  padding: 10px 15px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #dddddd;

                  .prestige {
                    font-weight: bold;
                    font-size: 1.4rem;
                    margin-right: 15px;
                  }

                  .star {
                    font-size: 1.2rem;
                    color: rgba(0, 0, 0, 0.5);
                    line-height: 15px;
                    margin-right: 5px;

                    .icon1, .icon2, .icon3 {
                      width: 14px;
                      height: 14px;
                      border-radius: 50%;
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;

                      img {
                        width: 12px;
                        height: 12px;
                      }
                    }

                    .icon1 {
                      background-color: gold;
                    }

                    .icon2 {
                      background-color: gray;
                    }

                    .icon3 {
                      background-color: brown;
                    }
                  }
                }

                .center {
                  display: flex;
                  padding: 10px 0;

                  ul {
                    width: 50%;

                    li {
                      padding: 2px 0;
                      font-size: 1.4rem;
                      cursor: pointer;
                      text-align: center;

                      &:hover {
                        background-color: #F5F5F5;
                      }
                    }
                  }
                }
              }
            }

            .notification {
              position: relative;
              padding: 5px 10px;
              width: fit-content;
              cursor: pointer;
              border-radius: 4px;
              margin-right: 5px;

              img {
                width: 20px;
                height: 20px;
              }

              .popup {
                position: absolute;
                right: 0;
                top: 110%;
                width: 300px;
                display: none;
                background-color: white;
                z-index: 100;
                cursor: default;

                .banner {
                  background-color: #F5F5F5;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
                  display: flex;
                  align-items: flex-end;
                  justify-content: space-between;

                  .item {
                    flex-grow: 1;
                    border-bottom: 2px solid transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 0;
                    cursor: pointer;

                    img {
                      opacity: 0.7;
                    }

                    &:hover {
                      border-bottom-color: $green;

                      img {
                        opacity: 1;
                      }
                    }
                  }

                  .item-active {
                    border-bottom-color: $green;

                    img {
                      opacity: 1;
                    }
                  }
                }

                .content {
                  height: 250px;
                  overflow: auto;

                  .article-notification {
                    li {
                      border-bottom: 1px solid #F5F5F5;
                      padding: 2px 10px;
                      box-sizing: border-box;
                      color: $green;
                      font-size: 1.4rem;

                      span {
                        color: #333333;
                        padding: 0 5px;
                      }
                    }
                  }

                  .chat-notification {
                    li {
                      border-bottom: 1px solid #F5F5F5;
                      padding: 2px 10px;
                      box-sizing: border-box;
                      color: #333333;
                      font-size: 1.4rem;

                      .green {
                        color: $green;
                        padding: 0 5px;
                      }

                      label {
                        font-size: 1.1rem;
                        color: gray;
                        padding-left: 5px;
                      }
                    }
                  }

                  .good-notification {
                    li {
                      border-bottom: 1px solid #F5F5F5;
                      padding: 2px 10px;
                      box-sizing: border-box;
                      color: #333333;
                      font-size: 1.4rem;

                      span {
                        color: $green;
                        padding: 0 5px;
                      }

                      label {
                        padding: 0;
                      }

                      .datetime {
                        font-size: 1.1rem;
                        color: gray;
                        padding-left: 5px;
                      }
                    }
                  }

                  .fans-notification {
                    li {
                      border-bottom: 1px solid #F5F5F5;
                      padding: 2px 10px;
                      box-sizing: border-box;
                      color: #333333;
                      font-size: 1.4rem;

                      span {
                        color: $green;
                        padding: 0 5px;
                      }

                      label {
                        font-size: 1.1rem;
                        color: gray;
                        padding-left: 5px;
                      }
                    }
                  }

                  .no-read {
                    background-color: #FCF8E3;
                  }

                  .loading {
                    width: 16px;
                    height: 16px;
                    margin: 5px auto;
                    animation: rotate 3s linear infinite;
                    @keyframes rotate {
                      from {
                        transform: rotate(0deg);
                      }
                      to {
                        transform: rotate(360deg);
                      }
                    }
                  }
                }

                .popup-bottom {
                  border-top: 1px solid rgba(0, 0, 0, 0.075);
                  background-color: #F5F5F5;
                  padding: 10px 10px;
                  box-sizing: border-box;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  font-size: 1.3rem;
                  color: gray;

                  .read-all {
                    cursor: pointer;

                    img {
                      width: 13px;
                      height: 13px;
                      margin-right: 2px;
                      display: inline-block;
                      transform: translateY(-2px);
                    }
                  }

                  .see-all {
                    cursor: pointer;
                  }
                }

                .number {
                  position: absolute;
                  top: 5px;
                  width: fit-content;
                  background-color: red;
                  color: white;
                  padding: 0 5px;
                  border-radius: 20px;
                  overflow: hidden;
                  font-size: 1.1rem;
                  line-height: 1.1;
                }

                .article-number {
                  @extend .number;
                  left: 40px;
                  top: 5px;
                }

                .chat-number {
                  @extend .number;
                  left: 115px;
                }

                .good-number {
                  @extend .number;
                  left: 190px;
                }

                .fans-number {
                  @extend .number;
                  left: 265px;
                }
              }

              &:hover {
                background-color: #F5F5F5;
              }

              &:focus {
                background-color: #F5F5F5;

                .popup {
                  display: block;
                }
              }
            }

            .creation {
              font-size: 1.4rem;
              border-radius: 4px;
              border: 1px solid #dddddd;
              padding: 5px 10px;
              position: relative;
              color: #333333;
              cursor: pointer;
              background-color: white;
              margin-right: 5px;

              .cross {
                display: none;
                width: 16px;
                height: 16px;
              }

              .triangle {
                margin-left: 2px;
                display: inline-block;
                width: 0;
                height: 0;
                border: 4px solid transparent;
                border-top-color: #333333;
                transform: translateY(2px);
              }

              .popup {
                display: none;
                position: absolute;
                left: 0;
                top: 110%;
                width: 100px;
                background-color: white;

                .popup-top {
                  li {
                    padding: 5px 15px;
                    box-sizing: border-box;
                    cursor: pointer;

                    &:hover {
                      background-color: #dddddd;
                    }
                  }
                }

                .popup-bottom {
                  border-top: 1px solid #dddddd;
                  padding: 7px 15px;
                  box-sizing: border-box;
                  cursor: pointer;

                  &:hover {
                    background-color: #dddddd;
                  }
                }
              }

              &:hover {
                background-color: #dddddd;
              }

              &:focus {
                background-color: #dddddd;

                .popup {
                  display: block;
                }
              }

              @media(min-width: 993px) {
                &:focus {
                  box-shadow: inset 0 0 7px rgba(0, 0, 0, 0.2);
                }
              }
              @media(max-width: 992px) {
                background-color: transparent;
                border: none;
                .cross {
                  display: block;
                }
                .word {
                  display: none;
                }
              }
            }

            .chat-message {
              position: relative;
              padding: 5px 10px;
              width: fit-content;
              cursor: pointer;
              border-radius: 4px;
              margin-right: 5px;

              .popup {
                position: absolute;
                right: 0;
                top: 110%;
                width: 300px;
                display: none;
                background-color: white;
                z-index: 100;
                cursor: default;

                .banner {
                  background-color: #F5F5F5;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
                  font-size: 1.4rem;
                  color: gray;
                  padding: 7px 10px;
                }

                .content {
                  height: 250px;
                  overflow: auto;

                  .item {
                    border-bottom: 1px solid #F5F5F5;
                    padding: 2px 10px;
                    box-sizing: border-box;
                    font-size: 1.4rem;

                    .green {
                      color: $green;
                      padding: 0 5px;
                    }

                    .datetime {
                      font-size: 1.1rem;
                      color: gray;
                      padding-left: 5px;
                    }
                  }

                  .word {
                    font-size: 1.4rem;
                    padding: 5px 0;
                    color: #333333;
                    text-align: center;
                  }

                  .loading {
                    width: 16px;
                    height: 16px;
                    margin: 5px auto;
                    animation: rotate 3s linear infinite;
                    @keyframes rotate {
                      from {
                        transform: rotate(0deg);
                      }
                      to {
                        transform: rotate(360deg);
                      }
                    }
                  }
                }

                .popup-bottom {
                  background-color: #F5F5F5;
                  padding: 10px 10px;
                  box-sizing: border-box;
                  text-align: right;
                  font-size: 1.3rem;
                  border-top: 1px solid rgba(0, 0, 0, 0.075);
                  color: gray;

                  span {
                    cursor: pointer;
                  }
                }
              }

              &:hover {
                background-color: #F5F5F5;
              }

              &:focus {
                background-color: #F5F5F5;

                .popup {
                  display: block;
                }
              }
            }

            .red-circle {
              position: absolute;
              top: 5px;
              right: 10px;
              border-radius: 50%;
              width: 6px;
              height: 6px;
              background-color: red;
            }

            @media(max-width: 992px) {
              .notification, .chat-message {
                display: none;
              }
            }
          }

          .md-avatar {
            display: none;
            border-radius: 50%;
            overflow: hidden;
            width: 24px;
            height: 24px;
            cursor: pointer;

            @media(max-width: 992px) {
              display: inline-block;
            }
          }
        }

        @media(max-width: 992px) {
          height: 40px;
        }
      }

      .hot-tag-group {
        border-top: 1px solid #dddddd;
        padding: 15px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.4rem;
        color: #777777;
        flex-wrap: wrap;

        a:hover {
          color: #333333;
        }

        @media(max-width: 992px) {
          justify-content: flex-start;
          padding-left: 20px;
          box-sizing: border-box;
          a {
            margin-right: 20px;
          }
        }
      }

      .bottom-menu {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 5px 0;
        background-color: #FAFAFA;
        align-items: center;
        justify-content: space-around;
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
        z-index: 100;

        img {
          width: 24px;
          height: 35px;
          cursor: pointer;
        }

        .more {
          .popup {
            position: absolute;
            right: 10px;
            bottom: 110%;
            display: none;
            background-color: white;
            width: 120px;
            padding: 5px 0;

            li {
              font-size: 1.5rem;
              padding: 4px 20px;
              box-sizing: border-box;
              cursor: pointer;
              color: #333333;

              &:hover {
                background-color: #dddddd;
              }
            }
          }

          &:focus {
            .popup {
              display: block;
            }
          }
        }
      }
    }

    .banner {
      position: relative;
      background-color: $green;
      @media(max-width: 500px) {
        display: none;
      }

      .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
        background: url('/banner-bg.svg') right center no-repeat;
        background-size: 50%;
        padding-top: 30px;
        padding-bottom: 30px;

        .left {
          width: 50%;

          h1 {
            font-size: 3rem;
            margin-bottom: 15px;
          }

          p {
            font-size: 1.8rem;
            line-height: 1.5;
          }
        }

        .right {
          .register-button, .login-button {
            font-size: 1.8rem;
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid white;
          }

          .login-button {
            background-color: $green;

            &:hover {
              background-color: $darker-green;
            }
          }

          .register-button {
            background-color: white;
            margin-right: 20px;
            color: $green;
          }
        }

        @media(max-width: 992px) {
          display: none;
        }
      }

      .close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 17px;
        height: 15px;
        cursor: pointer;
      }
    }

    footer {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 10px 0 30px 0;
      border-top: 1px solid #dddddd;

      ul {
        margin-top: 20px;
        font-size: 1.4rem;
        font-weight: bold;
        color: #333333;

        li {
          font-size: 1.3rem;
          font-weight: normal;
          color: #888888;
          padding: 3px 0;
          background-color: white;

          a {
            &:hover, &:focus {
              text-decoration: underline;
            }
          }
        }

        li:nth-child(1) {
          padding-top: 20px;
        }

        .app {
          img {
            width: 64px;
            height: 64px;
            margin-top: 7px;
            margin-bottom: 10px;
            cursor: pointer;
          }
        }

        @media(max-width: 992px) {
          width: 33%;
          display: flex;
          align-items: center;
          flex-direction: column;
          text-align: center;
          .app {
            img {
              margin: 7px auto 10px;
            }
          }
        }
        @media(max-width: 500px) {
          width: 50%;
        }
      }
    }

    .to-top {
      position: fixed;
      bottom: 40px;
      right: 20px;
      padding: 10px;
      font-size: 1.4rem;
      line-height: 1.25;
      color: #999999;
      border: 1px solid #dddddd;
      cursor: pointer;
      background-color: white;

      &:hover {
        background-color: #dddddd;
      }
    }

    .login-card, .register-card {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;

      .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
      }

      .card {
        margin: 7% auto auto;
        border-radius: 4px;
        overflow: hidden;
        width: 40%;
        min-width: 300px;
        position: relative;
        z-index: 101;

        .top {
          background-color: #F3F3F3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #333333;
          font-size: 18px;
          padding: 15px 10px;

          .close {
            cursor: pointer;
            position: relative;
            width: 13px;
            height: 13px;
            transform: translateY(5px);

            &:after, &:before {
              content: '';
              position: absolute;
              width: 100%;
              height: 3px;
              border-radius: 2px;
              background-color: #C2C2C2;
              transform: rotate(-45deg);
            }

            &:before {
              content: '';
              transform: rotate(45deg);
            }
          }
        }

        .body {
          background-color: white;

          .content {
            width: 70%;
            min-width: 200px;
            margin: auto;
            padding: 30px 0;

            .warn {
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              color: red;
            }

            p {
              font-size: 14px;
              color: #333333;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-weight: bold;

              label {
                font-weight: normal;
                color: $green;
                cursor: pointer;

                &:hover {
                  color: $darker-green;
                  text-decoration: underline;
                }
              }
            }

            input {
              margin-top: 5px;
              margin-bottom: 10px;
            }

            .login, .register, .to-register, .to-login {
              width: 100%;
              color: white;
              font-size: 14px;
              padding: 5px 0;
              background-color: $green;
              text-align: center;
              margin-top: 10px;
              border-radius: 4px;

              &:hover {
                background-color: $darker-green;
              }
            }

            .to-register, .to-login {
              margin-top: 20px;
              color: #333333;
              background-color: white;
              border: 1px solid #dddddd;

              &:hover {
                background-color: #F3F3F3;
              }
            }

            .valid-code {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 10px;

              input {
                width: 60%;
              }

              label {
                flex-grow: 1;
                text-align: center;
                color: #333333;
                font-size: 20px;
              }
            }
          }
        }
      }
    }

    .register-card {
      .card {
        margin-top: 50px;
      }
    }
  }
</style>
