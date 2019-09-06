<template>
  <div id="QuestionAuthor">
    <section class="inner">
      <section class="left-side">
        <m-button class="focus" v-if="question" :click="focus" :class="{'active-button':param.isFocus}">
          <span class="txt">{{param.isFocus?'已关注':'关注'}}</span>{{$formatNumber(param.focusNum)}}
        </m-button>
        <m-button class="collect" v-if="question" :click="collect" :class="{'active-button':param.isCollect}">
          <span class="txt">{{param.isCollect?'已收藏':'收藏'}}</span>{{$formatNumber(param.collectNum)}}
        </m-button>
        <span class="sub-comments" @click="showSubComments=!showSubComments">
        评论{{param.subCommentsNumber>0?`（${param.subCommentsNumber}）`:''}}
        </span>
      </section>
      <section class="right-side">
        <div class="avatar">
          <img :src="param.avatar">
        </div>
        <section class="txt">
          <section class="top">
            <nuxt-link :to="'/user?id='+param.authorId">{{param.author}}</nuxt-link>
            <img src="/icon/rp.PNG">
            <span class="rp">{{$formatNumber(param.rp)}}</span>
          </section>
          <span class="datetime">{{$formatDatetime(param.datetime)}}</span>
        </section>
      </section>
    </section>
    <sub-comment :comment="param" v-show="showSubComments"></sub-comment>
  </div>
</template>

<script>
  import MButton from "./MButton";
  import {POST_CHECK_COLLECT_QUESTION, POST_CHECK_FOCUS_QUESTION} from "../assets/js/api";
  import {COLLECT_QUESTION, eventBus} from "../assets/js/event-bus";
  import SubComment from "./SubComment";

  export default {
    name: "QuestionAuthor",
    components: {SubComment, MButton},
    props: {
      param: {
        type: Object,
        required: true
      },
      question: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showSubComments: false
      }
    },
    watch: {},
    computed: {},
    methods: {
      focus(finish) {
        this.$axios.$post(POST_CHECK_FOCUS_QUESTION, {
          questionId: this.param.id,
          status: !this.param.isFocus
        }).then(() => {
          this.param.isFocus = !this.param.isFocus
          if (this.param.isFocus) {
            this.param.focusNum++
          } else {
            this.param.focusNum--
          }
          finish()
        })
      },
      collect(finish) {
        if (this.param.isCollect) {
          this.$axios.$post(POST_CHECK_COLLECT_QUESTION, {
            packageName: this.param.inPackageName,
            questionId: this.param.id,
            status: false
          }).then(() => {
            this.param.isCollect = false
            this.param.collectNum--
            finish()
          })
        } else {
          eventBus.$emit(COLLECT_QUESTION, this.param)
          finish()
        }
      },
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

  #QuestionAuthor {
    .inner {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-side {
        .focus, .collect {
          color: #ffffff;
          font-size: 1.2rem;
          padding: 3px 7px;
          background-color: $green;
          margin-right: 10px;
          border-radius: 4px;

          .txt {
            padding-right: 5px;
            border-right: 1px solid white;
            margin-right: 5px;
          }
        }

        .collect {
          color: #333333;
          background-color: white;
          border: 1px solid #dddddd;

          .txt {
            border-right: 1px solid #333333;
          }
        }

        .sub-comments {
          font-size: 1.2rem;
          color: #666666;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .right-side {
        display: flex;
        align-items: center;

        .avatar {
          min-width: 40px;
          max-width: 40px;
          min-height: 40px;
          max-height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 5px;
        }

        .txt {
          width: 200px;

          .top {
            display: flex;
            align-items: center;
            font-size: 1.4rem;

            a {
              max-width: 60%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              padding-bottom: 5px;
              margin-right: 5px;
              color: $green;
            }

            img {
              width: 16px;
              height: 12px;
              margin-right: 5px;
            }

            .rp {
              color: #BF7158;
            }
          }

          .datetime {
            color: #777777;
            padding-top: 10px;
            font-size: 1.4rem;
          }
        }
      }
    }
  }
</style>
