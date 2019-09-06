<template>
  <div id="rp-board" class="default-container">
    <h1>用户排行榜</h1>
    <p class="declare">这里是活跃用户们的贡献排行榜，他们为社区贡献了不可磨灭的力量，让更多人得到了成长。</p>
    <section class="board-array">
      <section class="board-20">
        <div class="border-20-inner">
          <h2>今天<span>还剩{{surplusDay}}</span></h2>
          <section class="inner">
            <div class="board">
              <RPBoard :array="boardAll.day"></RPBoard>
            </div>
            <div class="board">
              <RPBoard :array="boardAll.day" :start-index="10"></RPBoard>
            </div>
          </section>
        </div>
      </section>
      <section class="board-20">
        <div class="border-20-inner">
          <h2>综合<span>活跃度 + 声望</span></h2>
          <section class="inner">
            <div class="board">
              <RPBoard :array="boardAll.total" :sign="false"></RPBoard>
            </div>
            <div class="board">
              <RPBoard :array="boardAll.total" :start-index="10" :sign="false"></RPBoard>
            </div>
          </section>
        </div>
      </section>
      <section class="board-10">
        <div class="inner">
          <h2>本周<span>还剩{{surplusWeek}}天</span></h2>
          <RPBoard :array="boardAll.week"></RPBoard>
        </div>
      </section>
      <section class="board-10">
        <div class="inner">
          <h2>{{month}}月份<span>还剩{{surplusMonth}}天</span></h2>
          <RPBoard :array="boardAll.month"></RPBoard>
        </div>
      </section>
      <section class="board-10">
        <div class="inner">
          <h2>第{{season}}季度<span>还剩{{surplusSeason}}天</span></h2>
          <RPBoard :array="boardAll.season"></RPBoard>
        </div>
      </section>
      <section class="board-10">
        <div class="inner">
          <h2>{{year}}年度<span>还剩{{surplusYear}}天</span></h2>
          <RPBoard :array="boardAll.year"></RPBoard>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
  import {GET_RP_BOARD_ALL} from "../assets/js/api";
  import RPBoard from "../components/RPBoard";

  export default {
    name: "rp-board",
    components: {RPBoard},
    props: {},
    async asyncData({app}) {
      const boardAll = await app.$axios.$get(GET_RP_BOARD_ALL)
      return {boardAll}
    },
    data() {
      return {
        month: '',
        year: '',
        surplusDay: '',
        surplusWeek: '',
        surplusMonth: '',
        surplusSeason: '',
        surplusYear: '',
        handler: 0
      }
    },
    watch: {},
    computed: {
      season() {
        const res = this.month / 3
        if (res * 3 !== this.month) {
          return res + 1
        }
        return res
      }
    },
    methods: {
      computeSurplus() {
        const oneDay = 86400000
        const now = new Date()
        this.month = now.getMonth() + 1
        this.year = now.getFullYear()
        const copy = this.$getDate(0, 0, 0)
        const alreadyPassDay = now.getTime() - copy.getTime()
        const surplusDay = new Date(oneDay - alreadyPassDay)
        const hour = surplusDay.getHours() - 8
        const minute = surplusDay.getMinutes()
        const second = surplusDay.getSeconds()
        this.surplusDay = (hour > 0 ? hour + '小时' : '') + (minute > 0 ? minute + '分钟' : '') + second + '秒'
        this.surplusWeek = 7 - now.getDay()
        this.surplusMonth = this.$getMonthDay(now.getMonth() + 1, now.getFullYear()) - now.getDate()
        const seasonEnd = this.$getSeasonEnd(now)
        this.surplusSeason = parseInt((seasonEnd.getTime() - now.getTime()) / oneDay)
        this.surplusYear = parseInt((this.$getDate(23, 59, 59, 31, 12).getTime() - now.getTime()) / oneDay)
      }
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '')
      this.computeSurplus()
      this.handler = setInterval(() => {
        this.computeSurplus()
      }, 1000)
    },
    created() {
    },
    destroyed() {
      clearInterval(this.handler)
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #rp-board {
    padding-top: 30px;

    h1 {
      font-size: 2.4rem;
      color: #777777;
      padding-bottom: 10px;
    }

    .declare {
      font-size: 1.4rem;
      color: #777777;
      padding-bottom: 20px;
    }

    .banner {
      font-size: 2.4rem;
      color: #333333;
    }

    .board-array {
      display: flex;
      flex-wrap: wrap;

      .board-20 {
        width: 50%;
        padding: 20px 20px 20px 0;
        box-sizing: border-box;

        .border-20-inner {
          border-top: 1px solid #dddddd;

          h2 {
            font-size: 2.4rem;
            color: #333333;
            font-weight: bold;
            padding: 15px 0;

            span {
              font-size: 1.4rem;
              color: #999999;
              margin-left: 10px;
              font-weight: normal;
            }
          }

          .inner {
            display: flex;

            .board {
              width: 50%;
              padding-right: 30px;
              box-sizing: border-box;
            }
          }
        }

        @media(max-width: 550px) {
          .border-20-inner {
            .inner {
              flex-direction: column;

              .board {
                width: 100%;
                padding-right: 0;
              }
            }
          }
        }

        @media(max-width: 992px) {
          width: 100%;
          flex-direction: column;
          padding-right: 0;
        }
      }

      .board-10 {
        width: 25%;
        padding: 20px 20px 20px 0;
        box-sizing: border-box;

        .inner {
          display: block;
          border-top: 1px solid #dddddd;

          h2 {
            font-size: 2.4rem;
            color: #333333;
            font-weight: bold;
            padding: 15px 0;

            span {
              font-size: 1.4rem;
              color: #999999;
              margin-left: 10px;
              font-weight: normal;
            }
          }
        }

        @media(max-width: 992px) {
          width: 50%;
          padding-right: 0;
        }

        @media(max-width: 550px) {
          width: 100%;
        }
      }
    }
  }
</style>
