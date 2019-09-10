<template>
  <div id="events" class="default-container">
    <section class="top-filter">
      <section class="txt">
        <label class="title">最新活动</label>
        <section class="select-city" tabindex="4">
          <div class="selected">{{city}}</div>
          <ul class="popup border-shadow">
            <li v-for="(val) in hotCityArray"
                :class="{active:val===city}" @click="city=val">{{val}}
            </li>
          </ul>
        </section>
        <section class="select-type" tabindex="2">
          <div class="selected">{{selectTypeName}}</div>
          <ul class="popup border-shadow">
            <li v-for="(val,index) in ['所有类型','黑客马拉松','线上活动','线下活动']"
                :class="{active:index===type}" @click="type=index">{{val}}
            </li>
          </ul>
        </section>
      </section>
      <button class="create-event" @click="toCreateEvent">提交活动</button>
    </section>
    <section class="event-banner">
      <section class="carousel">
        <carousel :len="recommendEvents.length">
          <carousel-item v-for="(val,index) in $readyForCarousel(recommendEvents)" :key="index">
            <img class="event-img" :src="val.img" :style="{height:imgHeight}">
          </carousel-item>
        </carousel>
      </section>
      <section class="date">
        <ul class="table-header">
          <li>周日</li>
          <li>周一</li>
          <li>周二</li>
          <li>周三</li>
          <li>周四</li>
          <li>周五</li>
          <li>周六</li>
        </ul>
        <section class="row" v-for="(index) in [0,1,2,3,4,5]">
          <ul class="line">
            <li class="col" :class="{'different-month':!sameMonth(val),active:eventLinkCount===index*10+count}"
                @mouseenter="hoverCol=index*10+count" @mouseleave="hoverCol=-1"
                @click="hiddenEventLink"
                v-for="(val,count) in dayRange.slice(index*7,index*7+7)">
              <span>{{getDate(val)}}</span>
              <div class="circle-group">
                <div class="circle" v-for="e in dayRangeEvents[val]">
                  <div class="circle-popup">{{e.name}}</div>
                </div>
              </div>
              <div class="popup" v-show="hoverCol===index*10+count&&dayRangeEvents[val].length>0"
                   @click.stop="showEventLink(index,index*10+count,dayRangeEvents[val])">
                <img src="/icon/arrow-down-white.png">
              </div>
            </li>
          </ul>
          <ul class="event-link-popup" v-show="eventLinkIndex===index">
            <li v-for="val in eventLinkArray">
              <nuxt-link :to="'/event?id='+val.id">{{val.name}}</nuxt-link>
            </li>
          </ul>
        </section>
      </section>
    </section>
    <ul class="event-array">
      <li v-for="v in events[page]">
        <img :src="v.img">
        <section class="body">
          <nuxt-link :to="'/event?id='+v.id">{{v.name}}</nuxt-link>
          <p class="datetime">时间：{{$formatDatetime(v.datetime)}}</p>
          <p>城市：{{v.city}}</p>
        </section>
      </li>
    </ul>
    <br/>
    <pagination :page="page+1" @page-change="fetchEevents" :total="totalEvents"></pagination>
  </div>
</template>

<script>
  import {GET_EVENT_IN_DAY_RANGE, GET_EVENT_SUM, GET_EVENTS_DESCRIPTION, GET_EVENTS_DESCRIPTION_LESS} from "../assets/js/api";
  import {eventBus, SHOW_LOGIN__CARD} from "../assets/js/event-bus";
  import Carousel from "../components/Carousel";
  import CarouselItem from "../components/CarouselItem";
  import Pagination from "../components/Pagination";

  export default {
    name: "events",
    components: {Pagination, CarouselItem, Carousel},
    props: {},
    head() {
      return {title: '活动 - SegmentFault 思否'}
    },
    async asyncData({app}) {
      const oneDay = 86400000
      const dayRange = []
      let startDay = eventBus.$getDate(0, 0, 0, 1)
      const day = startDay.getDay()
      startDay = startDay.getTime() - day * oneDay
      for (let i = 0; i < 42; i++) {
        dayRange.push(i * oneDay + startDay)
      }
      const [dayRangeEvents, recommendEvents, totalEvents] = await Promise.all([
        app.$axios.$get(GET_EVENT_IN_DAY_RANGE, {
          params: {start: startDay, end: dayRange[dayRange.length - 1]}
        }),
        app.$axios.$get(GET_EVENTS_DESCRIPTION_LESS),
        app.$axios.$get(GET_EVENT_SUM)
      ])
      return {dayRangeEvents, recommendEvents, dayRange, totalEvents}
    },
    data() {
      return {
        city: '所有城市',
        type: 0,
        hotCityArray: ['所有城市', '北京', '南京', '武汉', '长沙', '上海', '深圳', '广州', '其他',],
        hoverCol: false,
        eventLinkIndex: -1,
        eventLinkCount: -1,
        eventLinkArray: [],
        events: [],
        page: 0,
        imgHeight: '305px'
      }
    },
    watch: {},
    computed: {
      selectTypeName() {
        switch (this.type) {
          case 0:
            return '所有类型'
          case 1:
            return '黑客马拉松'
          case 2:
            return '线上活动'
          case 3:
            return '线下活动'
        }
      },
    },
    methods: {
      getDate(val) {
        return new Date(val).getDate()
      },
      sameMonth(val) {
        return new Date(val).getMonth() === new Date().getMonth()
      },
      showEventLink(index, count, val) {
        this.eventLinkIndex = index
        this.eventLinkCount = count
        this.eventLinkArray = val
      },
      hiddenEventLink() {
        this.eventLinkIndex = -1
        this.eventLinkCount = -1
      },
      fetchEevents(page) {
        this.page = page - 1
        if (this.events[this.page]) {
          return
        }
        this.$axios.$get(GET_EVENTS_DESCRIPTION, {
          params: {city: this.city, type: this.type}
        }).then(res => {
          this.events[this.page] = res
          this.$forceUpdate()
        })
      },
      toCreateEvent() {
        if (this.$store.state.user) {
          this.$router.push({path: '/create-event'})
        } else {
          eventBus.$emit(SHOW_LOGIN__CARD)
        }
      }
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '')
      const onResize = () => {
        if (window.innerWidth <= 768) {
          this.imgHeight = undefined
        } else {
          this.imgHeight = '305px'
        }
      }
      window.onresize = onResize
      onResize()
      this.fetchEevents(1)
    },
    created() {
    },
    beforeDestroy() {
      window.onresize = undefined
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #events {
    padding-top: 30px;
    padding-bottom: 30px;
    font-size: 1.4rem;

    .top-filter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;

      .txt {
        .title {
          font-size: 2.4rem;
          color: #333;
          margin-right: 20px;
        }

        .select-type, .select-city {
          position: relative;
          margin-right: 20px;
          display: inline-block;

          .selected {
            color: $green;
            display: flex;
            align-items: center;
            cursor: pointer;

            &:after {
              content: '';
              width: 0;
              height: 0;
              border: 5px solid transparent;
              border-top-color: $green;
              margin-left: 5px;
              margin-top: 5px;
            }

            &:hover {
              color: $darker-green;
              text-decoration: underline;
            }
          }

          .popup {
            display: none;
            position: absolute;
            top: 110%;
            width: 130px;
            z-index: 100;
            background-color: white;

            li {
              cursor: pointer;
              color: #333;
              padding: 5px 20px;
            }

            .active {
              background-color: $green;
              color: #ffffff;
            }
          }

          &:focus {
            .popup {
              display: block;
            }
          }
        }

        @media(max-width: 768px) {
          .select-type, .select-city {
            display: none;
          }
          .title {
            font-size: 2rem;
          }
        }
      }

      .create-event {
        font-size: 1.2rem;
        color: #333;
        padding: 5px 10px;
        border-radius: 4px;
        border: 1px solid #dddddd;
      }
    }

    .event-banner {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;

      .carousel {
        width: 50%;
        padding-right: 10px;
        box-sizing: border-box;
        flex-grow: 1;
      }

      .date {
        width: 50%;
        padding-left: 10px;
        box-sizing: border-box;
        color: #333333;
        flex-grow: 1;

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-around;
          font-size: 1.4rem;
          font-weight: bold;
          padding: 3px 0;
          border: 1px solid #dddddd;
        }

        .row {
          position: relative;

          .line {
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:hover {
              background-color: #fafafa;
            }

            .col {
              width: calc(100% / 7);
              border-right: 1px solid #dddddd;
              border-bottom: 1px solid #dddddd;
              font-size: 2rem;
              text-align: center;
              padding-bottom: 15px;
              position: relative;

              &:hover {
                background-color: #dddddd;
              }

              span {
                cursor: default;
              }

              .circle-group {
                position: absolute;
                left: 0;
                top: 30px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .circle {
                  width: 7px;
                  height: 7px;
                  margin: 0 2px;
                  background-color: #7ED321;
                  cursor: default;
                  position: relative;
                  border-radius: 50%;

                  .circle-popup {
                    background-color: black;
                    color: #fff;
                    font-size: 1.2rem;
                    line-height: 1.5;
                    border-radius: 3px;
                    width: 150px;
                    position: absolute;
                    left: -72px;
                    bottom: 180%;
                    display: none;
                    z-index: 100;
                    padding: 5px 10px;
                    box-sizing: border-box;

                    &:after {
                      content: '';
                      width: 0;
                      height: 0;
                      border: 5px solid transparent;
                      border-top-color: black;
                      position: absolute;
                      top: 100%;
                      left: 71px;
                    }
                  }

                  &:hover {
                    .circle-popup {
                      display: block;
                    }
                  }
                }
              }

              .popup {
                position: absolute;
                left: calc(50% - 15px);
                top: 100%;
                cursor: pointer;
                width: 30px;
                height: 20px;
                border-radius: 2px;
                background-color: #dddddd;
                z-index: 100;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                  width: 12px;
                  height: 12px;
                  filter: invert(100%);
                }
              }
            }

            .active {
              background-color: #F6F6F6;
            }

            .col:nth-child(1) {
              background-color: #F6F6F6;
              border-left: 1px solid #dddddd;
              color: #d0021b;

              &:hover {
                background-color: #F6F6F6;
              }
            }

            .col:nth-child(7) {
              background-color: #F6F6F6;
              color: #d0021b;

              &:hover {
                background-color: #F6F6F6;
              }
            }

            .different-month span {
              opacity: 0.5;
            }
          }

          .event-link-popup {
            z-index: 1000;
            position: absolute;
            width: 100%;
            left: 0;
            top: 100%;
            background-color: #F6F6F6;
            padding: 5px 30px;
            box-sizing: border-box;
            border-bottom: 1px solid #dddddd;
            border-left: 1px solid #dddddd;
            border-right: 1px solid #dddddd;

            li {
              list-style: disc;
            }

            a {
              font-size: 1.3rem;
              color: $green;
              line-height: 2rem;

              &:hover {
                color: $green;
              }
            }
          }
        }
      }

      @media(max-width: 768px) {
        .date {
          display: none;
        }
        .carousel {
          width: 100%;
        }
      }
    }

    .event-array {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 25%;
        padding-right: 10px;
        padding-bottom: 10px;
        box-sizing: border-box;
        @media(max-width: 992px) {
          width: 50%;
        }
        @media(max-width: 768px) {
          width: 100%;
        }

        a {
          display: block;
          font-size: 1.6rem;
          color: #333333;
          padding-bottom: 5px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .body {
          background-color: #F3F3F3;
          padding: 10px;
          box-sizing: border-box;
        }

        p {
          font-size: 1.3rem;
          color: #999999;
        }

        .datetime {
          padding-bottom: 5px;
        }
      }
    }
  }
</style>
