<template>
  <div id="QuestionBanner">
    <div class="block">
      {{question.goodNum}}<br/>
      <span>得票</span>
    </div>
    <m-button class="block" :class="[question.answerNum===0?'none-answer':'exit-answer',question.complete?'complete':'']">
      {{question.answerNum}}<br/>
      <span>{{question.complete?'解决':'回答'}}</span>
    </m-button>
    <div class="block view">
      {{$formatNumber(question.viewNum)}}<br/>
      <span>浏览</span>
    </div>
    <section class="main">
      <div class="top">
        <div v-if="question.answerNum===0">
          <nuxt-link :to="'/user?id='+question.authorId">{{question.author}}</nuxt-link>
          <nuxt-link :to="'/question/'+question.id">{{$formatDatetime(question.activeDatetime)}}提出问题</nuxt-link>
        </div>
        <div v-else>
          <nuxt-link :to="'/user?id='+question.newestAnswerAuthorId">{{question.newestAnswerAuthor}}</nuxt-link>
          <nuxt-link :to="'/question/'+question.id">{{$formatDatetime(question.activeDatetime)}}回答问题</nuxt-link>
        </div>
      </div>
      <div class="bottom">
        <nuxt-link :to="'/question?id='+question.id">{{question.name}}</nuxt-link>
        <tag class="tag" v-for="(val,index) in question.tags" :tag="val" :key="index"></tag>
      </div>
    </section>
  </div>
</template>

<script>
  import MButton from "./MButton";
  import Tag from "./Tag";

  export default {
    name: "QuestionBanner",
    components: {Tag, MButton},
    props: {
      question: {
        type: Object,
        required: true
      }
    },
    data() {
      return {}
    },
    watch: {},
    computed: {},
    methods: {},
    mounted() {
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #QuestionBanner {
    display: flex;
    align-items: center;
    @media(max-width: 550px) {
      flex-wrap: wrap;
    }

    .block {
      width: 45px;
      min-width: 45px;
      height: 42px;
      min-height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 1.6rem;
      color: #757575;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 4px;

      span {
        font-size: 1.2rem;
      }

      @media(max-width: 768px) {
        font-size: 1.3rem;
      }
    }

    .view {
      color: #999999;
    }

    .none-answer {
      color: #ad3a37;
    }

    .exit-answer {
      color: #017E66;
      background-color: rgba(1, 126, 102, 0.08);
      border: 1px solid #C5DCCC;
    }

    .complete {
      color: white;
      border: 1px solid $green;
      background-color: $green;
    }

    .main {
      padding-left: 10px;
      box-sizing: border-box;

      .top {
        font-size: 1.3rem;
        color: #999999;
        padding-bottom: 5px;

        a {
          margin-right: 10px;

          &:hover {
            color: #555555;
          }
        }

        @media(max-width: 768px) {
          font-size: 1.1rem;
        }
      }

      .bottom {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        font-size: 1.6rem;
        color: #333333;

        a {
          line-height: 1.6;
        }

        .tag {
          margin-left: 5px;
        }

        @media(max-width: 768px) {
          font-size: 1.4rem;
        }
      }
    }
  }
</style>
