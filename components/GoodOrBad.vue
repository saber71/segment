<template>
  <div id="GoodOrBad" :class="{'active-button':isGood||isBad}">
    <div class="triangle-top" :class="{active:isGood}" @click="good"></div>
    {{$formatNumber(goodNum)}}
    <div class="triangle-bottom" :class="{active:isGood}" @click="bad"></div>
    <div class="good-popup" v-show="showGoodPopup">问题对人有帮助，内容完整，我也想知道答案</div>
    <div class="bad-popup" v-show="showBadPopup">问题没有实际价值，缺少关键内容，没有改进余地</div>
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
    min-width: 38px;
    max-width: 38px;
    background-color: white;
    border: 1px solid #ADADAD;
    font-size: 1.6rem;
    color: #333333;
    line-height: 2.4rem;

    .triangle-bottom, .triangle-top {
      cursor: pointer;
      padding: 2px 0;

      &:after {
        content: '';
        width: 0;
        height: 0;
        border: 7px solid transparent;
        border-bottom-color: #333333;
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
      border-bottom-color: $green;

      &:hover {
        &:after {
          border-bottom-color: $green;
        }
      }
    }

    .good-popup, .bad-popup {
      position: absolute;
      left: -31px;
      top: 110%;
      width: 100px;
      color: #ffffff;
      font-size: 1.3rem;
      line-height: 1.5;
      text-align: center;
      background-color: black;
      z-index: 100;

      &:after {
        content: '';
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-top-color: black;
      }
    }
  }
</style>
