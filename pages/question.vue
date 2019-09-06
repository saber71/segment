<template>
  <div id="question" class="default-container default-content-layout">
    <section class="left-part">
      <breadcrumb :router="router"></breadcrumb>
      <article-title :article="question"></article-title>
      <section class="block">
        <div class="left">
          <good-or-bad :param="question" :question="true" :is-bad="question.isBad" :is-good="question.isGood" :good-num="question.goodNum"></good-or-bad>
        </div>
        <div class="right">
          <md-render :content="question.content"></md-render>
        </div>
      </section>
      <question-author :param="question" :question="true"></question-author>
    </section>
    <section class="right-part"></section>
  </div>
</template>

<script>
  import {GET_ANSWER, GET_QUESTION} from "../assets/js/api";
  import Breadcrumb from "../components/Breadcrumb";
  import ArticleTitle from "../components/ArticleTitle";
  import GoodOrBad from "../components/GoodOrBad";
  import MdRender from "../components/MdRender";
  import QuestionAuthor from "../components/QuestionAuthor";

  const size = 10
  export default {
    name: "question",
    components: {QuestionAuthor, MdRender, GoodOrBad, ArticleTitle, Breadcrumb},
    props: {},
    head() {
      const title = this.question.tags[0] + ' - ' + this.question.name + ' - SegmentFault 思否'
      return {title}
    },
    async asyncData({app, params}) {
      const id = params.id
      const [question, answer] = await Promise.all([
        app.$axios.$get(GET_QUESTION + '?name=' + id),
        app.$axios.$get(GET_ANSWER + '?questionId=' + id + '&&page=0&&size=' + size)
      ])
      return {question, answer}
    },
    data() {
      return {
        page: 1,
        router: [
          {
            text: '问答',
            href: '/questions'
          }, {
            text: '问答详情'
          }
        ]
      }
    },
    watch: {},
    computed: {},
    methods: {},
    mounted() {
      this.$store.commit('setHomeActiveMenu', '问答')
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #question {
    padding-top: 30px;

    .block {
      display: flex;

      .left {
        padding-right: 10px;
      }

      .right {
        flex-grow: 1;
      }
    }
  }
</style>
