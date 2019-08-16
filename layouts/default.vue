<template>
  <div id="Default">
    <header>
      <section class="top"></section>
      <section class="default-container bottom">
        <div class="side">
          <img src="/icon/search-dark.png" @click="">
        </div>
        <div class="left">
          <div class="logo" @mouseenter="showImg2=true" @mouseleave="showImg2=false">
            <img class="img1" src="/logo.svg">
            <img class="img2" src="/logo-tooltip.png" v-show="showImg2">
          </div>
          <ul>
            <li :class="{'active-li':activeLi==='首页'}">首页</li>
            <li :class="{'active-li':activeLi==='问答'}">问答</li>
            <li :class="{'active-li':activeLi==='专栏'}">专栏</li>
            <li :class="{'active-li':activeLi==='课程'}">课程</li>
            <li :class="{'active-li':activeLi==='圈子'}">圈子</li>
            <li :class="{'active-li':activeLi==='发现'}" @mouseenter="fetchEventsDescription">发现
              <div class="triangle"></div>
              <div class="popup border-shadow">
                <ul class="left-side">
                  <li class="left-item">活动</li>
                  <li class="left-item">标签</li>
                  <li class="left-item">酷工作</li>
                  <li class="left-item">排行榜</li>
                  <li class="left-item">徽章</li>
                  <li class="left-item">笔记</li>
                  <li class="left-item">开发手册
                    <img src="/icon/down-arrow-white.png">
                  </li>
                  <li class="left-item">广告投放
                    <img src="/icon/down-arrow-white.png">
                  </li>
                </ul>
                <ul class="right-side">
                  <li class="right-item" v-for="val in eventsDescription">
                    <p>{{val.name}}</p>
                    <div>
                      {{val.city}} · {{val.date}} {{$getWeekDay(val.date)}} · <span class="joining" v-if="val.joining">报名中</span> <span class="joining-end" v-else>报名结束</span>
                    </div>
                  </li>
                  <li class="more">查看更多活动</li>
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
            <div class="notification" tabindex="0" @focusout="newNotificationNumber=undefined">
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
                <div class="content">
                  <div class="article-notification" v-show="notificationPopupBannerIndex===0"></div>
                  <div class="chat-notification" v-show="notificationPopupBannerIndex===1"></div>
                  <div class="good-notification" v-show="notificationPopupBannerIndex===2"></div>
                  <div class="fans-notification" v-show="notificationPopupBannerIndex===3"></div>
                </div>
                <div class="popup-bottom"></div>
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
            <div class="user" @mouseenter="avatarMouseEnter" @mouseleave="avatarMouseLeave">
              <div class="avatar">
                <img :src="user.avatar?user.avatar:defaultAvatar">
                <div class="mask"></div>
              </div>
              <div class="popup" v-show="showPopup">
                <div class="popup-top">
                  <div class="prestige">{{user.prestige>=1000?'999+':user.prestige}} 声望</div>
                  <div class="star">
                    <div class="icon1">
                      <img src="/icon/star-white.png">
                    </div>
                    {{user.star1>=100?'99+':user.star1}}
                  </div>
                  <div class="star">
                    <div class="icon2">
                      <img src="/icon/star-white.png">
                    </div>
                    {{user.star2>=100?'99+':user.star2}}
                  </div>
                  <div class="star">
                    <div class="icon3">
                      <img src="/icon/star-white.png">
                    </div>
                    {{user.star3>=100?'99+':user.star3}}
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
          <div class="md-avatar" @click="showLoginCard=true">
            <img :src="user?user.avatar?user.avatar:defaultAvatar:defaultAvatar">
          </div>
        </div>
      </section>
    </header>
    <nuxt></nuxt>
    <footer></footer>
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
  import {GET_CHECK_NEW_NOTIFICATION_NUMBER, GET_EVENTS_DESCRIPTION_LESS, POST_REGISTER} from '../assets/js/api'

  const r = mock.Random
  let sendLogin = false, sendRegister = false;

  export default {
    name: "default",
    props: {},
    data() {
      return {
        showImg2: false,
        showPopup: false,
        showLoginCard: false,
        showRegisterCard: false,
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
        eventsDescription: undefined,
        newNotificationNumber: undefined
      }
    },
    watch: {
      showRegisterCard(val) {
        sendRegister = false
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
        sendLogin = false
        if (val) {
          this.showRegisterCard = false
        }
        this.username = '12345678909'
        this.password = 'qwertyu'
        this.warnMsg = ''
      }
    },
    computed: {
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
      }
    },
    methods: {
      async fetchEventsDescription() {
        if (!this.eventsDescription) {
          this.eventsDescription = await this.$axios.$get(GET_EVENTS_DESCRIPTION_LESS)
        }
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
      login() {
        if (sendLogin) {
          return
        }
        sendLogin = true
        this.warnMsg = ''
        if (this.validEmail(this.username) || this.validPhone(this.username)) {
          if (!this.validPassword(this.password)) {
            this.warnMsg = '6~12位密码，以字母或数字或下划线开头'
          } else {
            this.$ajax_login({
              account: this.username,
              password: this.password
            }, () => {
              this.showLoginCard = false
              sendLogin = false
              this.$axios.get(GET_CHECK_NEW_NOTIFICATION_NUMBER).then(response => {
                this.newNotificationNumber = response.data
              })
            })
            // this.$axios.post(POST_LOGIN, {
            //   account: this.username,
            //   password: this.password
            // }).then(async () => {
            //   const data = await this.$axios.$get(GET_CHECK_USER_DATA_AFTER_LOGIN)
            //   this.$store.commit('setUser', data)
            //   this.showLoginCard = false
            // })
          }
        } else {
          this.warnMsg = '无效的手机号或邮箱'
        }
      },
      register() {
        if (sendRegister) {
          return;
        }
        sendRegister = true
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
          sendRegister = false
        })
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

  #Default {
    height: 100vh;
    overflow-y: scroll;

    .default-container {
      width: 100%;
      margin: auto;
      box-sizing: border-box;
      padding: 0 20px;

      @media(min-width: 768px) {
        width: 730px;
        padding: 0;
      }
      @media(min-width: 992px) {
        width: 970px;
      }
      @media(min-width: 1200px) {
        width: 1140px;
      }
    }

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

          .logo {
            position: relative;
            width: 150px;
            cursor: pointer;
            margin-right: 30px;

            .img2 {
              position: absolute;
              right: -10px;
              top: 100%;
              width: 146px;
              z-index: 100;
            }
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

                    img {
                      display: inline-block;
                      width: 10px;
                      height: 10px;
                      padding: 5px;
                      margin-left: 5px;
                      background-color: #F5A623;
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

                      .joining-end {
                        color: black;
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
                width: 32px;
                height: 32px;
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

              img {
                width: fit-content;
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
                }

                .popup-bottom {
                  background-color: #F5F5F5;
                  padding: 0 10px;
                  box-sizing: border-box;
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

            @media(max-width: 992px) {
              display: none;
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
    }

    .login-card, .register-card {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .card {
        margin: 7% auto auto;
        border-radius: 4px;
        overflow: hidden;
        width: 40%;
        min-width: 300px;
        position: relative;
        z-index: 1;

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
