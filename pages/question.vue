<template>
  <div id="question" ref="question" class="default-container default-content-layout">
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
      <h3 id="answers" class="answer-num">{{question.answerNum}}个回答</h3>
      <ul class="answer-list">
        <li v-for="val in answer[page]">
          <section class="block">
            <div class="left">
              <good-or-bad :param="val" :question="false" :is-bad="val.isBad" :is-good="val.isGood" :good-num="val.goodNum"></good-or-bad>
            </div>
            <div class="right">
              <md-render :content="val.content"></md-render>
              <question-author :param="val"></question-author>
            </div>
          </section>
        </li>
      </ul>
      <pagination :page="page+1" :total="question.answerNum" @page-change="onPageChange"></pagination>
      <h3 class="write-answer">撰写答案<span>图片必须为jpg格式，小于2Mb</span></h3>
      <editor ref="editorRef" :save="save" :subfield="true" v-model="answerTxt"></editor>
      <!--      <mavon-editor ref="mavonRef" v-model="answerTxt" :autofocus="false"-->
      <!--                    :imageFilter="imageFilter" @imgAdd="imgAdd" @imgDel="imgDel" @save="save"></mavon-editor>-->
      <div class="button-group">
        <m-button class="save-to-draft" :click="saveToDraft" v-show="draftId<0">保存到草稿箱</m-button>
        <div class="already-save" v-show="draftId>=0">
          已保存到草稿箱
          <m-button class="remove-draft" :click="removeDraft">[舍弃]</m-button>
        </div>
        <button class="save" :click="postAnswer">提交答案</button>
      </div>
    </section>
    <section class="right-part" ref="right">
      <ul ref="similarQuestionsRef">
        <li>相似问题</li>
        <li v-for="val in similarQuestions">
          <nuxt-link :to="'/question?id='+val.id">{{val.name}}</nuxt-link>
        </li>
        <li>找不到问题？可以
          <nuxt-link to="/create-question">创建问题</nuxt-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import {GET_ANSWER, GET_QUESTION, GET_SIMILAR_QUESTIONS, POST_CHECK_ANSWER_QUESTION, POST_CHECK_REMOVE_DRAFT, POST_CHECK_SAVE_TO_DRAFT} from "../assets/js/api";
  import Breadcrumb from "../components/Breadcrumb";
  import ArticleTitle from "../components/ArticleTitle";
  import GoodOrBad from "../components/GoodOrBad";
  import MdRender from "../components/MdRender";
  import QuestionAuthor from "../components/QuestionAuthor";
  import DownFetchContent from "../components/DownFetchContent";
  import MButton from "../components/MButton";
  import {eventBus, SET_TAG_GROUP_STATUS} from "../assets/js/event-bus";
  import Pagination from "../components/Pagination";
  import Editor from "../components/Editor";

  const size = 10
  export default {
    name: "question",
    components: {Editor, Pagination, MButton, DownFetchContent, QuestionAuthor, MdRender, GoodOrBad, ArticleTitle, Breadcrumb},
    props: {},
    head() {
      const title = this.question.tags[0] + ' - ' + this.question.name + ' - SegmentFault 思否'
      return {title}
    },
    async asyncData({app, query}) {
      const id = query.id
      const [question, answerPage0] = await Promise.all([
        app.$axios.$get(GET_QUESTION + '?name=' + id),
        app.$axios.$get(GET_ANSWER + '?questionId=' + id + '&&page=0&&size=' + size),
      ])
      const answer = []
      answer[0] = answerPage0
      const similarQuestions = await app.$axios.$get(GET_SIMILAR_QUESTIONS + '?id=' + question.id)
      return {question, answer, similarQuestions}
    },
    data() {
      return {
        page: 0,
        router: [
          {
            text: '问答',
            href: '/questions'
          }, {
            text: '问答详情'
          }
        ],
        answerTxt: '',
        imageArray: {},
        draftId: -1,
      }
    },
    watch: {
      '$route': async function (val) {
        const id = val.query.id
        this.imageArray = []
        this.draftId = -1
        this.page = 0
        const [question, answer] = await Promise.all([
          this.$axios.$get(GET_QUESTION + '?name=' + id),
          this.$axios.$get(GET_ANSWER + '?questionId=' + id + '&&page=0&&size=' + size),
        ])
        const similarQuestions = await this.$axios.$get(GET_SIMILAR_QUESTIONS + '?id=' + question.id)
        this.question = question
        this.answer = []
        this.answer[this.page] = answer
        this.similarQuestions = similarQuestions
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      onPageChange(page) {
        this.page = page - 1
        this.fetchMoreAnswer()
      },
      fetchMoreAnswer() {
        if (this.answer[this.page]) {
          return
        }
        this.$axios.$get(GET_ANSWER + '?questionId=' + this.question.id + '&&page=' + (this.page) + '&&size=' + size).then(res => {
          this.answer[this.page] = res
          this.$forceUpdate()
        })
      },
      save(finish) {
        const base64 = require('js-base64').Base64
        const txt = base64.encode(this.answerTxt)
        this.$axios.$post(POST_CHECK_ANSWER_QUESTION, {
          txt,
          questionId: this.question.id
        }).then(() => {
          this.answer.push({
            content: txt,
            goodNum: 0,
            author: this.user.name,
            authorId: this.user.id,
            avatar: this.user.avatar,
            rp: this.user.prestige,
            datetime: new Date(),
            subCommentsNumber: 0,
            subComments: []
          })
          this.answerTxt = ''
          if (finish) {
            finish()
          }
        })
      },
      saveToDraft(finish) {
        const base64 = require('js-base64').Base64
        this.$axios.$post(POST_CHECK_SAVE_TO_DRAFT, {
          txt: base64.encode(this.answerTxt),
          draftId: this.draftId
        }).then(res => {
          this.draftId = res
          finish()
        })
      },
      removeDraft(finish) {
        this.$axios.$post(POST_CHECK_REMOVE_DRAFT, this.draftId).then(() => {
          this.draftId = -1
          finish()
        })
      },
      postAnswer() {
        this.$refs.editorRef.$emit('save')
      }
    },
    mounted() {
      eventBus.$emit(SET_TAG_GROUP_STATUS, true)
      this.$store.commit('setHomeActiveMenu', '问答')
    },
    created() {
    },
    destroyed() {
      eventBus.$emit(SET_TAG_GROUP_STATUS, false)
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #question {
    padding-top: 30px;
    padding-bottom: 30px;

    .left-part {
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

      .answer-num, .write-answer, .preview {
        font-size: 2.4rem;
        color: #333333;
        font-weight: normal;
        padding: 15px 0;
        border-bottom: 1px solid #dddddd;

        span {
          font-size: 1.4rem;
          color: #777777;
          margin-left: 10px;
        }
      }

      .answer-list {
        padding-bottom: 15px;

        li {
          padding: 20px 0;
          border-bottom: 1px solid #dddddd;
        }
      }

      .button-group {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-top: 10px;

        .save-to-draft, .already-save {
          color: #777777;
          font-size: 1.3rem;
          margin-right: 10px;

          .remove-draft {
            font-size: 1.1rem;
            color: $green;
            margin-left: 5px;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .save {
          color: #ffffff;
          font-size: 1.6rem;
          background-color: $green;
          padding: 10px;
          border-radius: 5px;

          &:hover {
            background-color: $darker-green;
          }
        }
      }
    }

    .right-part {
      position: relative;

      ul {
        position: sticky;
        top: 0;
        left: 20px;
        padding-left: 20px;
        box-sizing: border-box;

        li {
          max-width: 100%;
          list-style: disc;
          font-size: 1.4rem;
          padding: 5px 0;

          a {
            color: $green;

            &:hover {
              color: $darker-green;
            }
          }
        }

        li:nth-child(1) {
          color: #777777;
          font-size: 1.6rem;
          padding-bottom: 10px;
          list-style: none;

          &:hover {
            color: #777777;
          }
        }
      }
    }
  }
</style>
