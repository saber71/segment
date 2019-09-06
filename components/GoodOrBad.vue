<template>
  <div id="GoodOrBad" class="good-or-bad" :class="{'active-button':isGood||isBad}">
    <div class="triangle-top" :class="{active:isGood}" @click="good"
         @mouseenter="showGoodPopup=true" @mouseleave="showGoodPopup=false"></div>
    {{$formatNumber(goodNum)}}
    <div class="triangle-bottom" :class="{active:isBad}" @click="bad"
         @mouseenter="showBadPopup=true" @mouseleave="showBadPopup=false"></div>
    <div class="good-popup" v-show="showGoodPopup">{{question?'问题对人有帮助，内容完整，我也想知道答案':'答案对人有帮助，有参考价值'}}</div>
    <div class="bad-popup" v-show="showBadPopup">{{question?'问题没有实际价值，缺少关键内容，没有改进余地':'答案对人没帮助，是错误的答案，答非所问'}}</div>
  </div>
</template>

<script>
  import {POST_CHECK_BAD_ANSWER, POST_CHECK_BAD_QUESTION, POST_CHECK_GOOD_ANSWER, POST_CHECK_GOOD_QUESTION} from "../assets/js/api";

  export default {
    name: "GoodOrBad",
    props: {
      goodNum: {
        type: Number,
        required: true
      },
      param: {
        type: Object,
        required: true
      },
      question: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        showGoodPopup: false,
        showBadPopup: false
      }
    },
    watch: {},
    computed: {
      isGood() {
        return this.param.isGood
      },
      isBad() {
        return this.param.isBad
      }
    },
    methods: {
      good() {
        this.$axios.$post(this.getGoodUrl(), {
          questionId: this.param.id,
          answerId: this.param.id,
          status: !this.isGood
        }).then(() => {
          this.param.isGood = !this.isGood
          this.param.isBad = false
          if (this.param.isGood) {
            this.param.goodNum++
          } else {
            this.param.goodNum--
          }
          this.$forceUpdate()
        })
      },
      bad() {
        this.$axios.$post(this.getBadUrl(), {
          questionId: this.param.id,
          answerId: this.param.id,
          status: !this.isGood
        }).then(() => {
          this.param.isBad = !this.isBad
          this.param.isGood = false
          if (this.param.isBad) {
            this.param.goodNum--
          } else {
            this.param.goodNum++
          }
          this.$forceUpdate()
        })
      },
      getGoodUrl() {
        return this.question ? POST_CHECK_GOOD_QUESTION : POST_CHECK_GOOD_ANSWER
      },
      getBadUrl() {
        return this.question ? POST_CHECK_BAD_QUESTION : POST_CHECK_BAD_ANSWER

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

  #GoodOrBad {
    position: relative;
    min-width: 40px;
    max-width: 40px;
    min-height: 56px;
    max-height: 56px;
    border: 1px solid #ADADAD;
    font-size: 1.6rem;
    color: #333333;
    line-height: 2.4rem;
    border-radius: 4px;
    text-align: center;

    .triangle-bottom, .triangle-top {
      cursor: pointer;
      padding: 1px 0;

      &:after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: 7px solid transparent;
        border-bottom-color: #333333;
        margin: auto;
      }

      &:hover {
        &:after {
          border-bottom-color: #ffb741;
        }
      }
    }

    .triangle-bottom {
      transform: rotate(180deg);
    }

    .active {
      &:after {
        border-bottom-color: $green;
      }

      &:hover {
        &:after {
          border-bottom-color: $green;
        }
      }
    }

    .good-popup, .bad-popup {
      position: absolute;
      left: -80px;
      bottom: 120%;
      width: 200px;
      color: #ffffff;
      font-size: 1.3rem;
      line-height: 1.5;
      text-align: center;
      background-color: black;
      border-radius: 5px;
      z-index: 100;
      padding: 5px 10px;
      box-sizing: border-box;

      &:after {
        content: '';
        position: absolute;
        left: 90px;
        bottom: 0;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-top-color: black;
        transform: translateY(15px);
      }
    }

    .bad-popup {
      bottom: -110%;

      &:after {
        transform: rotate(180deg) translateY(-5px);
        bottom: 100%;
      }
    }
  }

  .good-or-bad {
    background-color: white;
  }
</style>
