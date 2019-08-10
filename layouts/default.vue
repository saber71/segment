<template>
  <div id="Default">
    <header>
      <section class="top"></section>
      <section class="default-container bottom">
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
            <li :class="{'active-li':activeLi==='发现'}">发现
              <div class="triangle"></div>
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
            <div class="user" @mouseenter="avatarMouseEnter" @mouseleave="avatarMouseLeave">
              <div class="avatar">
                <img :src="user.avatar?user.avatar:defaultAvatar">
                <div class="mask"></div>
              </div>
              <div class="popup" v-show="showPopup">
                <div class="popup-top">
                  <div class="prestige">{{user.prestige}} 声望</div>
                  <div class="star">
                    <div class="icon1">
                      <img src="/icon/star-white.png">
                    </div>
                    {{user.star1}}
                  </div>
                  <div class="star">
                    <div class="icon2">
                      <img src="/icon/star-white.png">
                    </div>
                    {{user.star2}}
                  </div>
                  <div class="star">
                    <div class="icon3">
                      <img src="/icon/star-white.png">
                    </div>
                    {{user.star3}}
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
            <p>手机号或Email</p>
            <input class="common-input" v-model="user" placeholder="11位手机号或Email">
            <p>密码
              <label>忘记密码</label>
            </p>
            <input class="common-input" v-model="password" placeholder="请输入密码">
            <button class="login">登陆</button>
            <button class="to-register" @click="showLoginCard=true">注册新账号</button>
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
            <p>你的名字</p>
            <input class="common-input" v-model="username" placeholder="真实姓名或常用昵称">
            <p>手机号</p>
            <input class="common-input" v-model="phone" placeholder="11位手机号">
            <div class="valid-code">
              <input class="common-input" v-model="validCode" placeholder="右侧的验证码">
              <label>{{realValidateCode}}</label>
            </div>
            <p>密码</p>
            <input class="common-input" v-model="password" placeholder="不少于6位的密码">
            <button class="register">注册</button>
            <button class="to-login" @click="showRegisterCard=true">已有账号登陆</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import mock from 'mockjs'

    const r = mock.Random
    export default {
        name: "default",
        props: {},
        data() {
            return {
                showImg2: false,
                showPopup: false,
                showLoginCard: false,
                showRegisterCard: false,
                searchTxt: '',
                phone: '',
                username: '',
                password: '',
                validCode: '',
                realValidateCode: '',
                defaultAvatar: require('static/icon/user.png'),
                handler: undefined,
            }
        },
        watch: {
            showRegisterCard(val) {
                if (val) {
                    this.showLoginCard = false
                }
                this.phone = ''
                this.username = ''
                this.password = ''
                this.validCode = ''
                this.createRealValidateCode()
            },
            showLoginCard(val) {
                if (val) {
                    this.showRegisterCard = false
                }
                this.username = ''
                this.password = ''
            }
        },
        computed: {
            activeLi() {
                return this.$store.state.homeActiveMenu
            },
            user() {
                return this.$store.state.user
            }
        },
        methods: {
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
                this.showLoginCard = true
            },
            register() {
                //  todo register
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
        width: 750px;
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
              display: flex;
              align-items: center;
              padding: 0 12px;
              font-weight: 500;
              font-size: 1.6rem;
              cursor: pointer;
              color: #757575;
              line-height: 34px;
              border-radius: 4px;

              &:hover {
                background-color: #F5F5F5;
              }

              .triangle {
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-top-color: #757575;
                margin-left: 5px;
                transform: translateY(2px);
              }
            }

            .active-li {
              color: $green;
              font-weight: 600;
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
                width: 200px;
                z-index: 100;
                margin-top: 5px;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
                background-color: white;

                .popup-top {
                  display: flex;
                  align-items: center;
                  padding: 10px 20px;
                  box-sizing: border-box;
                  border-bottom: 1px solid #dddddd;

                  .prestige {
                    font-weight: bold;
                    font-size: 1.4rem;
                    margin-right: 20px;
                  }

                  .star {
                    font-size: 1.4rem;
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
          }
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
