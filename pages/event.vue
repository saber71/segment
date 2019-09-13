<template>
  <div id="event" class="default-container">
    <h1>
      <label class="icon">活</label>
      {{event.name}}
    </h1>
    <div class="banner">
      <img :src="event.img">
      <div class="info">
        <p>开始时间：{{$formatNumber(event.startDatetime)}} {{$getWeekDay(event.startDatetime)}}</p>
        <p>结束时间：{{$formatNumber(event.endDatetime)}} {{$getWeekDay(event.endDatetime)}}</p>
        <p>举办地点：{{event.city}}</p>
        <p>主板方：
          <nuxt-link :to="'/user?id='+event.authorId">{{event.author}}</nuxt-link>
        </p>
        <p>报名截止：<span>{{endTimeTxt}}</span></p>
      </div>
    </div>
    <md-render :content="event.content"></md-render>
    <br/>
    <comments :target-id="event.id" :target="target" :total="event.commentsNum" :comments="comments"></comments>
  </div>
</template>

<script>
  import {GET_EVENT} from "../assets/js/api";
  import {ranInteger} from "../assets/js/mock-random";
  import MdRender from "../components/MdRender";
  import Comments from "../components/Comments";
  import {TARGET_EVENT} from "../assets/js/const";

  const oneDay = 86400000

  export default {
    name: "event",
    components: {Comments, MdRender},
    props: {},
    head() {
      return {title: '活动邀请 | ' + this.event.name + ' - SegemntFault 思否'}
    },
    async asyncData({app, query}) {
      const id = query.id
      const event = await app.$axios.$get(GET_EVENT + '?id=' + id)
      return {event}
    },
    data() {
      return {
        endTimeTxt: '',
        endTime: ranInteger(oneDay / 2, oneDay * 100),
        handler: 0,
        target: TARGET_EVENT,
        comments: []
      }
    },
    watch: {},
    computed: {},
    methods: {
      computeEndTime() {
        const day = parseInt(this.endTime / oneDay)
        let bias = this.endTime - day * oneDay
        const hour = parseInt(bias / 3600000)
        bias = bias - hour * 3600000
        const minute = parseInt(bias / 60000)
        bias -= minute * 60000
        const second = parseInt(bias / 1000)
        this.endTimeTxt = (day > 0 ? day + '天' : '') + (hour > 0 ? hour + '时' : '') + (minute > 0 ? minute + '分' : '') + second + '秒'
      }
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '')
      this.handler = setInterval(() => {
        this.endTime -= 1000
        this.computeEndTime()
      }, 1000)
    },
    created() {
    },
    beforeDestroy() {
      clearInterval(this.handler)
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #event {
    padding-top: 30px;
    padding-bottom: 30px;

    h1 {
      font-size: 2.4rem;
      color: #333333;
      padding-bottom: 10px;
      display: flex;
      align-items: center;

      .icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid $green;
        font-size: 1.6rem;
        margin-right: 10px;
        color: $green;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    }

    .banner {
      margin-bottom: 10px;
      background-color: #F6F6F6;
      display: flex;
      flex-wrap: wrap;

      img {
        width: 40%;
      }

      .info {
        padding: 20px;
        box-sizing: border-box;
        flex-grow: 1;

        p {
          font-size: 1.4rem;
          color: #777777;
          padding-bottom: 5px;

          a {
            color: $green;
          }

          span {
            color: #333333;
          }
        }
      }

      @media(max-width: 768px) {
        img {
          width: 100%;
        }
      }
    }
  }
</style>
