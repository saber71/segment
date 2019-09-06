<template>
  <div id="questions" class="default-container default-content-layout">
    <section class="left-part">
      <tabs :labels="labels" @active-change="onTabChange">
        <p class="sort" v-show="tabActiveIndex===3">
          排序：
          <button @click="clickSort(0)" :class="{'active-button':hottestBy===0}">日热门</button>
          <button @click="clickSort(1)" :class="{'active-button':hottestBy===1}">周热门</button>
          <button @click="clickSort(2)" :class="{'active-button':hottestBy===2}">月热门</button>
        </p>
        <ul>
          <li v-for="val in array[tabActiveIndex][page]">
            <question-banner :question="val"></question-banner>
          </li>
        </ul>
      </tabs>
      <button class="create-question" @click="createQuestion">+ 提问题</button>
      <br/>
      <pagination :page="page+1" :total="totalQuestionNum" @page-change="fetchData"></pagination>
    </section>
    <section class="right-part">
      <recommend-lesson></recommend-lesson>
      <br/>
      <section class="rp-board">
        <div class="banner">
          <label>排行榜</label>
          <label>
            <span :class="{'disabled':rpType!==0}" @mouseenter="rpType=0">今天</span>&nbsp;
            <span :class="{'disabled':rpType!==2}" @mouseenter="rpType=2">本周</span>&nbsp;
            <nuxt-link to="/rp-board">全部</nuxt-link>&nbsp;
          </label>
        </div>
        <r-p-board :show-icon="true" :array="rpBoard[rpType]" v-if="rpBoard[rpType]"></r-p-board>
      </section>
    </section>
  </div>
</template>

<script>
  import Tabs from "../components/Tabs";
  import {GET_QUESTIONS, GET_RP_INCREASE_BOARD, GET_TOTAL_QUESTION} from "../assets/js/api";
  import QuestionBanner from "../components/QuestionBanner";
  import Pagination from "../components/Pagination";
  import MButton from "../components/MButton";
  import {eventBus, SET_TAG_GROUP_STATUS, SHOW_LOGIN__CARD} from "../assets/js/event-bus";
  import RecommendLesson from "../components/RecommendLesson";
  import RPBoard from "../components/RPBoard";

  export default {
    name: "questions",
    components: {RPBoard, RecommendLesson, MButton, Pagination, QuestionBanner, Tabs},
    props: {},
    head() {
      const suffix = ' - SegmentFault 思否'
      let prefix
      switch (this.tabActiveIndex) {
        case 0:
          prefix = '最新的问题'
          break
        case 1:
          prefix = '为我推送的问题'
          break
        case 2:
          prefix = '未回答的问题'
          break
        case 3:
          prefix = '热门的问题'
          break
        case 4:
          prefix = '专家列表'
          break
      }
      return {
        title: prefix + suffix
      }
    },
    async asyncData({app}) {
      const totalQuestionNum = await app.$axios.$get(GET_TOTAL_QUESTION)
      return {totalQuestionNum}
    },
    data() {
      return {
        labels: ['最新问答', '为我推送', '等待回答', '热门回答'],
        tabActiveIndex: 0,
        array: [[], [], [], []],
        page: 0,
        size: 20,
        hottestBy: 0,
        rpBoard: [[]],
        rpType: 0
      }
    },
    watch: {
      rpType() {
        this.fetchRpBoard()
      }
    },
    computed: {},
    methods: {
      createQuestion() {
        if (this.$store.state.user) {
          this.$router.push({path: '/create-question'})
        } else {
          eventBus.$emit(SHOW_LOGIN__CARD)
        }
      },
      clickSort(by) {
        this.hottestBy = by
        this.array[this.tabActiveIndex] = []
        this.fetchData(1)
      },
      onTabChange(activeIndex) {
        this.tabActiveIndex = activeIndex
        this.hottestBy = 0
        this.fetchData(1)
      },
      fetchData(page) {
        this.page = page - 1
        if (this.array[this.tabActiveIndex][this.page]) {
          return
        }
        this.$axios.$get(GET_QUESTIONS, {
          params: {
            page: this.page,
            size: this.size,
            type: this.tabActiveIndex,
            by: this.hottestBy
          }
        }).then(res => {
          this.array[this.tabActiveIndex][this.page] = res
          this.$forceUpdate()
        })
      },
      fetchRpBoard() {
        if (this.rpBoard[this.rpType] && this.rpBoard[this.rpType].length > 0) {
          return
        }
        this.$axios.$get(GET_RP_INCREASE_BOARD, {
          params: {
            by: this.rpType,
            size: 10
          }
        }).then(res => {
          this.rpBoard[this.rpType] = res
          this.$forceUpdate()
        })
      }
    },
    mounted() {
      eventBus.$emit(SET_TAG_GROUP_STATUS, true)
      this.$store.commit('setHomeActiveMenu', '问答')
      this.fetchData(1)
      this.fetchRpBoard()
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

  #questions {
    padding: 30px 0;

    .left-part {
      position: relative;

      .sort {
        font-size: 1.4rem;
        color: #777777;
        padding-top: 10px;

        button {
          font-size: 1.2rem;
          padding: 5px;
          border: 1px solid #dddddd;
          color: #333333;
          border-radius: 4px;
        }
      }

      ul {
        padding-top: 10px;

        li {
          padding: 20px 0;
          border-bottom: 1px solid #dddddd;
        }
      }

      .create-question {
        position: absolute;
        right: 0;
        top: -15px;
        width: fit-content;
        padding: 5px 10px;
        background-color: $green;
        color: #fff;
        font-size: 1.4rem;
        border-radius: 5px;

        &:hover {
          background-color: $darker-green;
        }
      }
    }

    .right-part {
      .rp-board {
        .banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;

          label {
            font-size: 1.6rem;
            color: #999999;
          }

          span, a {
            font-size: 1.3rem;
            color: $green;
            cursor: pointer;
          }

          .disabled {
            color: #999999;
          }
        }
      }
    }
  }
</style>
