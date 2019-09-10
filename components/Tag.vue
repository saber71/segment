<template>
  <div id="Tag" @mouseenter="hover" @mouseleave="leave">
    <div ref="tag" class="tag" :class="{'active':selected,'closable':close}"
         @click="onClick" tabindex="1">
      <img :src="iconPath" v-if="iconPath">{{tag}}
    </div>
    <img class="close" v-show="close" src="/icon/close-black.svg" @click="onClose">
    <section class="popup border-shadow" v-show="showPopup" :style="{left,width:width+'px'}">
      <div class="loading" v-if="!tagData">Loading......</div>
      <section class="content-side" v-else>
        <span class="name">{{tagData.name}}</span>
        <p class="description" v-if="tagData.description">
          <multi-line-text :line-num="3" :line-height="20" :txt="tagData.description"
                           font-size="1.3rem"></multi-line-text>
        </p>
        <p class="font-size: 1.3rem" v-else>暂无简介</p>
        <section class="bottom">
          <div class="left-side">
            <nuxt-link :to="'/tag?name='+tagData.name">查看</nuxt-link>
            <!--            <nuxt-link :to="'/tag?name='+tagData.name+'&&index=编辑'">编辑</nuxt-link>-->
            <!--            <nuxt-link>订阅</nuxt-link>-->
          </div>
          <div class="right-side">
            {{$formatNumber(tagData.focusNum)}}人
            <m-button class="focus-button" :click="focus" :class="{'active-focus':tagData.isFocus}">{{tagData.isFocus?'已关注':'关注'}}</m-button>
          </div>
        </section>
      </section>
      <div class="triangle"></div>
    </section>
  </div>
</template>

<script>
  import {GET_TAG_DATA, POST_CHECK_FOCUS_TAG} from "../assets/js/api";
  import MButton from "./MButton";
  import MultiLineText from "./MultiLineText";

  export default {
    name: "Tag",
    components: {MultiLineText, MButton},
    props: {
      tag: {
        type: String,
        required: true
      },
      click: {
        type: Function,
        default: undefined
      },
      await: {
        type: Boolean,
        default: true
      },
      param: {
        default: undefined
      },
      selected: {
        type: Boolean,
        default: false
      },
      close: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        awaiting: false,
        left: 0,
        width: 300,
        showPopup: false,
        tagData: undefined,
        enterHandler: undefined,
        leaveHandler: undefined
      }
    },
    watch: {
      showPopup(val) {
        if (val && !this.tagData) {
          this.$axios.$get(GET_TAG_DATA + '?name=' + this.tag).then(res => {
            this.tagData = res
          })
        }
      }
    },
    computed: {
      iconPath() {
        return this.$getTagIcon(this.tag)
      },
    },
    methods: {
      onClose() {
        this.$emit('close', this.param)
      },
      focus(finish) {
        this.$axios.$post(POST_CHECK_FOCUS_TAG, {
          tags: [this.tag],
          status: !this.tagData.isFocus
        }).then(() => {
          this.tagData.isFocus = !this.tagData.isFocus
          finish()
        })
      },
      onClick() {
        if (this.click) {
          if (this.awint && this.awaiting) {
            return
          }
          this.awaiting = true
          this.click(this.tag, () => {
            this.awaiting = false
          }, this.param)
        } else {
          this.$router.push({path: '/tag', query: {name: this.tag}})
        }
      },
      hover() {
        if (this.leaveHandler) {
          clearTimeout(this.leaveHandler)
          this.leaveHandler = undefined
        }
        if (this.showPopup) {
          return
        }
        this.enterHandler = setTimeout(() => {
          if (this.enterHandler) {
            clearTimeout(this.enterHandler)
            this.enterHandler = undefined
            this.showPopup = true
          }
        }, 1000)
      },
      leave() {
        if (this.enterHandler) {
          clearTimeout(this.enterHandler)
          this.enterHandler = undefined
        }
        if (!this.showPopup) {
          return
        }
        this.leaveHandler = setTimeout(() => {
          if (this.leaveHandler) {
            clearTimeout(this.leaveHandler)
            this.leaveHandler = undefined
            this.showPopup = false
          }
        }, 500)
      }
    },
    mounted() {
      const tagRef = this.$refs['tag']
      const width = tagRef.getBoundingClientRect().width / 2
      this.left = (width - this.width / 2) + 'px'
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #Tag {
    position: relative;

    .tag {
      color: #017E66;
      background-color: #ebf5f3;
      font-size: 13px;
      padding: 0 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      border-radius: 1px;

      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
        margin-top: 0;
      }

      &:hover {
        background-color: #017E66;
        color: white;
      }
    }

    .closable {
      padding-right: 25px;
    }

    .close {
      position: absolute;
      right: 10px;
      top: 5px;
      width: 7px;
      height: 7px;
      cursor: pointer;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }

    .active {
      background-color: #017E66;
      color: white;
    }

    .popup {
      position: absolute;
      left: 0;
      bottom: 30px;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      background-color: white;
      z-index: 100;
      border-radius: 4px;
      overflow: initial;
      @media(max-width: 992px) {
        display: none;
      }

      .loading {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        color: #555555;
      }

      .content-side {
        color: #333333;

        .name {
          display: block;
          font-size: 1.6rem;
          padding-bottom: 10px;
          font-weight: bold;
        }

        .description {
        }

        .no-description {
          font-size: 1.3rem;
        }

        .bottom {
          margin-top: 10px;
          padding: 5px 5px;
          box-sizing: border-box;
          border-top: 1px solid #dddddd;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1.3rem;

          .left-side {
            a {
              color: $green;

              &:hover {
                color: $darker-green;
              }
            }
          }

          .right-side {
            color: #777777;

            .focus-button {
              margin-left: 5px;
              border: 1px solid #dddddd;
              padding: 0 5px;
              border-radius: 5px;

              &:hover {
                background-color: #dddddd;
              }
            }

            .active-focus {
              background-color: #dddddd;
              box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
            }
          }
        }
      }

      .triangle {
        position: absolute;
        left: calc(50% - 2px);
        bottom: 0;
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-top-color: white;
        transform: translateY(8px);
      }
    }
  }

</style>
