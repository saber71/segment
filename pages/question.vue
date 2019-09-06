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
          <question-author :param="question" :question="true"></question-author>
        </div>
      </section>
      <h3 class="answer-num">{{question.answerNum}}个回答</h3>
      <down-fetch-content :end="answer.length>=question.answerNum" :fetch="fetchMoreAnswer">
        <ul class="answer-list">
          <li v-for="val in answer">
            <section class="block">
              <div class="left">
                <good-or-bad :param="val" :question="false" :is-bad="val.isBad" :is-good="val.isGood" :good-num="val.goodNum"></good-or-bad>
              </div>
              <div class="right">
                <md-render :content="question.content"></md-render>
                <question-author :param="val"></question-author>
              </div>
            </section>
          </li>
        </ul>
      </down-fetch-content>
      <h3 class="write-answer">撰写答案<span>图片必须为jpg格式，小于2Mb</span></h3>
      <mavon-editor v-model="answerTxt" :subfield="false" :defaultOpen="edit" codeStyle="md-style"
                    :imageFilter="imageFilter"></mavon-editor>
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
  import DownFetchContent from "../components/DownFetchContent";

  const size = 10
  export default {
    name: "question",
    components: {DownFetchContent, QuestionAuthor, MdRender, GoodOrBad, ArticleTitle, Breadcrumb},
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
        ],
        answerTxt: '',
        imageArray: [],
      }
    },
    watch: {},
    computed: {},
    methods: {
      fetchMoreAnswer(finish) {
        this.$axios.$get(GET_ANSWER + '?questionId=' + this.question.id + '&&page=' + (this.page++) + '&&size=' + size).then(res => {
          res.forEach(val => this.answer.push(val))
          finish()
        })
      },
      imageFilter(file) {
        const name = file.name.toLowerCase()
        if (!/.(jpg|jpeg)$/.test(name)) {
          return false
        }
        const size = file.size
        return size / 1024 <= 2
      }
    },
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
        padding-top: 30px;
      }

      .right {
        flex-grow: 1;
      }
    }

    .answer-num, .write-answer {
      font-size: 2.4rem;
      color: #333333;
      font-weight: normal;
      padding: 15px 0;
      border-bottom: 1px solid #dddddd;
    }

    .answer-list {
      padding-bottom: 15px;

      li {
        padding: 20px 0;
        border-bottom: 1px solid #dddddd;
      }
    }
  }
</style>
