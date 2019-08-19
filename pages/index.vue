<template>
  <div id="Index">
    <section class="banner" v-if="showBanner&&!user">
      <section class="container default-container">
        <section class="left">
          <h1>在 SegmentFault，学习技能、解决问题</h1>
          <p>每个月，我们帮助 1000 万的开发者解决各种各样的技术问题。并助力他们在
            技术能力、职业生涯、影响力上获得提升。</p>
        </section>
        <section class="right">
          <button class="register-button" @click="register">免费注册</button>
          <button class="login-button" @click="login">立即登陆</button>
        </section>
      </section>
      <img class="close" src="/icon/close-banner.png" @click="showBanner=false">
    </section>
    <section class=" default-container content">
      <section class="left">
        <ul class="top">
          <li class="tag" :class="{'active-tag':selectedTag==='为你推荐'}" @click="selectedTag='为你推荐'">
            <img src="/icon/board-black.png" v-show="selectedTag!=='为你推荐'">
            <img src="/icon/board-white.png" v-show="selectedTag==='为你推荐'">
            为你推荐
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
              :class="{'active-tag':selectedTag!=='最新内容'&&selectedTag!=='近期热门'&&selectedTag!=='为你推荐'}"
              @click="showTechTagsSelector=true">
            <img src="/icon/channel-black.png" v-show="selectedTag==='最新内容'||selectedTag==='近期热门'||selectedTag==='为你推荐'">
            <img src="/icon/channel-white.png" v-show="selectedTag!=='最新内容'&&selectedTag!=='近期热门'&&selectedTag!=='为你推荐'">
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
      <section class="center"></section>
      <section class="right"></section>
    </section>
  </div>
</template>

<script>
  import {LS_ACCOUNT} from "../assets/js/const";
  import {eventBus, FAIL_LOGIN, SHOW_LOGIN__CARD, SHOW_REGISTER_CARD} from "../assets/js/event-bus";

  export default {
    data() {
      return {
        showBanner: true,
        showTechTagsSelector: false,
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
        ]
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      clickTechTag(val) {
        this.showTechTagsSelector = false
        if (val === '更多标签') {
          // todo 跳转标签页
        } else {
          this.selectedTag = val
        }
      },
      login() {
        eventBus.$emit(SHOW_LOGIN__CARD)
      },
      register() {
        eventBus.$emit(SHOW_REGISTER_CARD)
      },
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '首页')
      const account = JSON.parse(localStorage.getItem(LS_ACCOUNT))
      if (account) {
        const expires = account.expires
        if (Date.now() <= expires) {
          this.showBanner = false
          eventBus.$on(FAIL_LOGIN, () => this.showBanner = true)
          this.$ajax_login(account)
        } else {
          localStorage.removeItem(LS_ACCOUNT)
        }
      }
    },
    destroyed() {
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
    .banner {
      position: relative;
      background-color: $green;

      .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
        background: url('/banner-bg.svg') right center no-repeat;
        background-size: 50%;
        padding: 30px 0;

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

    .content {
      display: flex;
      margin-top: 30px;
      padding-bottom: 30px;

      .left {
        flex-basis: 170px;
        box-sizing: border-box;
        padding-right: 10px;

        .tag {
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 3px;
          font-size: 1.4rem;
          color: #757575;
          display: flex;
          align-items: center;

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
        flex-grow: 1;
      }

      .right {
        width: 200px;
        padding-left: 10px;
        box-sizing: border-box;
        @media(max-width: 992px) {
          display: none;
        }
      }

      @media(max-width: 992px) {
        flex-direction: column;
      }
    }
  }
</style>
