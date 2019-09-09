<template>
  <div id="InputDatetime" tabindex="1" @click="onRootClick">
    <div class="txt-board">{{datetime}}</div>
    <section class="border-shadow popup">
      <section class="date">
        <section class="top-arrows">
          <section class="top-left">
            <img @click="prevMonth" class="prev" src="/icon/triangle-black-down.svg">
            <img class="home" @click="setNow" src="/icon/home-black.svg">
          </section>
          <section class="top-right">
            <section class="month" @mouseenter="showMonthList=true" @mouseleave="showMonthList=false">
              <label>{{$getChineseNumber(month)}}月</label>
              <ul ref="monthList" class="border-shadow month-list" v-show="showMonthList">
                <li v-for="(val,index) in monthList" :class="{'month-active':index+1===month}" @click="month=index+1">{{val}}</li>
              </ul>
            </section>
            <section class="year" @mouseenter="showYearList=true" @mouseleave="showYearList=false">
              <label>{{year}}</label>
              <ul ref="yearList" class="border-shadow year-list" v-show="showYearList">
                <li v-for="(val) in yearList" :class="{'year-active':year===val}" @click="year=val">{{val}}</li>
              </ul>
            </section>
            <img @click="nextMonth" class="next" src="/icon/triangle-black-down.svg">
          </section>
        </section>
        <section class="date-list">
          <ul class="th">
            <li>周日</li>
            <li>周一</li>
            <li>周二</li>
            <li>周三</li>
            <li>周四</li>
            <li>周五</li>
            <li>周六</li>
          </ul>
          <section v-for="count in [0,1,2,3,4]">
            <ul class="row">
              <li v-for="(val,index) in dateList.slice(count*7,(count+1)*7)"
                  :class="{'date-active':isActiveDate(val),'not-same-month':!isSameMonth(val)}"
                  @click="setDate(count*7+index)">{{getDate(val)}}
              </li>
            </ul>
          </section>
        </section>
      </section>
      <section class="time">
        <section class="top">
          <img class="up" @click="upHour" src="/icon/triangle-black-down.svg">
        </section>
        <ul ref="middle" class="middle">
          <li v-for="(val,index) in hourList" :class="{active:isActiveHour(index)}"
              @click="time=val">{{val}}
          </li>
        </ul>
        <section class="bottom">
          <img class="triangle" @click="downHour" src="/icon/triangle-black-down.svg">
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import {eventBus} from "../assets/js/event-bus";

  const now = new Date()

  function nowTime() {
    return eventBus.$fillZero(now.getHours(), 10) + ":" + eventBus.$fillZero(now.getMinutes(), 10)
  }

  export default {
    name: "InputDatetime",
    model: {
      prop: 'datetime',
      event: 'change'
    },
    props: {
      datetime: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate(),
        time: nowTime(),
        hourList: [],
        yearList: [],
        monthList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        showMonthList: false,
        showYearList: false,
        dateList: [],
        result: '',
      }
    },
    watch: {
      showMonthList(val) {
        if (val) {
          this.$nextTick(() => {
            const ref = this.$refs.monthList
            const active = document.getElementsByClassName('month-active').item(0)
            ref.scrollTop = active.offsetTop
          })
        }
      },
      showYearList(val) {
        if (val) {
          this.$nextTick(() => {
            const ref = this.$refs.yearList
            const active = document.getElementsByClassName('year-active').item(0)
            ref.scrollTop = active.offsetTop
          })
        }
      },
      year() {
        this.computeDateList(this.year, this.month)
        this.computeResult()
      },
      month() {
        this.computeDateList(this.year, this.month)
        this.computeResult()
      },
      date() {
        this.computeResult()
        this.selectDatetime()
      },
      time() {
        this.computeResult()
        this.selectDatetime()
      }
    },
    computed: {},
    methods: {
      computeTimeScroll() {
        const ref = this.$refs.middle
        ref.scrollTop = document.getElementsByClassName('active').item(0).offsetTop
      },
      isActiveHour(index) {
        const hour = parseInt(this.time.match(/\d*/))
        return hour === index
      },
      isSameMonth(val) {
        const date = new Date(val)
        return this.month === date.getMonth() + 1
      },
      isActiveDate(time) {
        const date = new Date(time)
        return date.getMonth() + 1 === this.month && date.getFullYear() === this.year && date.getDate() === this.date
      },
      setDate(index) {
        const date = new Date(this.dateList[index])
        this.month = date.getMonth() + 1
        this.date = date.getDate()
      },
      getDate(val) {
        return new Date(val).getDate()
      },
      upHour() {
        const hour = parseInt(this.time.match(/\d*/))
        if (hour > 0) {
          this.time = this.$fillZero(hour - 1, 10) + ':00'
        }
      },
      downHour() {
        const hour = parseInt(this.time.match(/\d*/))
        if (hour < 23) {
          this.time = this.$fillZero(hour + 1, 10) + ':00'
        }
      },
      prevMonth() {
        this.month--
        if (this.month === 0) {
          this.month = 12
          this.year--
        }
      },
      nextMonth() {
        this.month++
        if (this.month === 13) {
          this.month = 1
          this.year++
        }
      },
      onRootClick() {
        this.computeDateList(this.year, this.month)
      },
      computeResult() {
        this.result = this.year + '-' + this.$fillZero(this.month, 10) + '-' +
          this.$fillZero(this.date, 10) + ' ' + this.time
      },
      selectDatetime() {
        this.$emit('change', this.result)
      },
      setNow() {
        this.year = now.getFullYear()
        this.month = now.getMonth() + 1
        this.date = now.getDate()
        this.time = nowTime()
      },
      computeDateList(year, month) {
        const oneDay = 86400000
        let startDate = this.$getDate(0, 0, 0, 1, month, year)
        startDate = startDate.getTime() - startDate.getDay() * oneDay
        this.dateList = []
        for (let i = 0; i < 35; i++) {
          this.dateList.push(i * oneDay + startDate)
        }
      }
    },
    mounted() {
      this.computeTimeScroll()
    },
    created() {
      for (let i = 1970; i <= 2050; i++) {
        this.yearList.push(i)
      }
      for (let i = 0; i < 24; i++) {
        this.hourList.push(this.$fillZero(i, 10) + ':00')
      }
      this.computeResult()
      this.selectDatetime()
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">

  $hoverColor: #FAC42D;

  #InputDatetime {
    position: relative;
    font-size: 1.4rem;
    z-index: 10000;

    .txt-board {
      border-radius: 3px;
      border: 1px solid #dddddd;
      color: #555555;
      height: 34px;
      padding: 5px 10px;
      box-sizing: border-box;
      cursor: text;
    }

    .popup {
      position: absolute;
      width: 100%;
      min-width: 320px;
      padding: 10px;
      box-sizing: border-box;
      z-index: 20000;
      display: none;
      background-color: white;
      border: 1px solid #dddddd;
      overflow: initial;

      .triangle, .home {
        width: 14px;
        min-width: 14px;
        height: 14px;
        min-height: 14px;
        opacity: 0.7;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }
      }

      .prev {
        @extend .triangle;
        transform: rotate(90deg);
        margin-right: 5px;
      }

      .next {
        @extend .triangle;
        transform: rotate(-90deg);
        margin-left: 10px;
      }

      .up {
        @extend .triangle;
        transform: rotate(180deg);
      }

      .date {
        width: 80%;
        padding-right: 5px;
        box-sizing: border-box;

        .top-arrows {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .top-left, .top-right {
            display: flex;
            align-items: center;
          }

          .year, .month {
            position: relative;
            margin-left: 15px;

            label {
              font-weight: bold;
              opacity: 0.7;
              cursor: pointer;
            }

            .month-list, .year-list {
              position: absolute;
              left: -10px;
              width: 80px;
              max-height: 200px;
              overflow-y: auto;
              font-weight: bold;
              background-color: white;
              z-index: 30000000;
              border: 1px solid #dddddd;

              li {
                padding: 5px 0 5px 10px;
                box-sizing: border-box;
                cursor: pointer;

                &:hover {
                  background-color: $hoverColor;
                }
              }

              .year-active, .month-active {
                color: white;
                background-color: cornflowerblue;

                &:hover {
                  background-color: cornflowerblue;
                }
              }
            }

            &:hover {
              label {
                opacity: 1;
                text-decoration: underline;
              }
            }
          }
        }

        .date-list {
          border-left: 1px solid #dddddd;
          border-bottom: 1px solid #dddddd;
          font-size: 1.2rem;
          background-color: #F6F6F6;

          .th {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #999999;
            background-color: #dddddd;

            li {
              flex-grow: 1;
            }
          }

          .row {
            display: flex;
            align-items: center;
            justify-content: space-between;

            li {
              width: calc(100% / 7);
              color: #777777;
              cursor: pointer;
              padding: 3px 0;

              &:hover {
                background-color: #ffb741;
                color: #ffffff;
              }
            }

            .date-active {
              color: #ffffff;
              background-color: cornflowerblue;

              &:hover {
                background-color: cornflowerblue;
              }
            }

            .not-same-month {
              opacity: 0.5;
            }
          }

          li {
            border-right: 1px solid #dddddd;
            border-top: 1px solid #dddddd;
            text-align: center;
          }
        }
      }

      .time {
        flex-grow: 1;
        padding-left: 5px;
        box-sizing: border-box;

        .top, .bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20px;
        }

        .middle {
          height: 146px;
          overflow-y: auto;
          font-size: 1.3rem;
          border: 1px solid #dddddd;

          li {
            cursor: pointer;
            color: #777777;
            padding: 3px 0;
            text-align: center;

            &:hover {
              background-color: #ffb741;
              color: #ffffff;
            }
          }

          .active {
            color: #ffffff;
            background-color: cornflowerblue;

            &:hover {
              background-color: cornflowerblue;
            }
          }

        }
      }
    }

    &:focus {
      .popup {
        display: flex;
      }
    }
  }
</style>
