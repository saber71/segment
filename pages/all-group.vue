<template>
  <div id="all-group" class="default-content-layout default-container">
    <section class="left-part">
      <breadcrumb :router="router"></breadcrumb>
      <br/>
      <section class="group-box" v-for="(val,type) in groupMap" v-show="showIndex===0">
        <h2>{{type}}</h2>
        <ul>
          <li class="group" v-for="group in val">
            <div class="img">
              <img :src="group.img">
            </div>
            <div class="info">
              <nuxt-link :to="'/group?id='+group.id">{{group.name}}</nuxt-link>
              <br/>
              <span>{{group.commentsNum}}评论</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="group-wide-box" v-show="showIndex===1">
        <h2>我关注的圈子</h2>
        <ul>
          <li class="group" v-for="group in myFocusGroup">
            <div class="img">
              <img :src="group.img">
            </div>
            <div class="info">
              <nuxt-link :to="'/group?id='+group.id">{{group.name}}</nuxt-link>
              <br/>
              <span>{{group.commentsNum}}评论</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="group-wide-box" v-show="showIndex===2">
        <h2>我管理的圈子</h2>
        <ul>
          <li class="group" v-for="group in myGroup">
            <div class="img">
              <img :src="group.img">
            </div>
            <div class="info">
              <nuxt-link :to="'/group?id='+group.id">{{group.name}}</nuxt-link>
              <br/>
              <span>{{group.commentsNum}}评论</span>
            </div>
          </li>
        </ul>
      </section>
    </section>
    <section class="right-part">
      <section class="box">
        <ul class="button-list">
          <li @click="showIndex=0" :class="{active:showIndex===0}">全部圈子</li>
          <li @click="showIndex=1" :class="{active:showIndex===1}">我关注的圈子</li>
          <li @click="showIndex=2" :class="{active:showIndex===2}">我管理的圈子</li>
        </ul>
        <h2>常去的圈子</h2>
        <section class="favorite-list">
          <group-tag class="tag" v-for="(val,index) in favoriteGroup" :key="index" :group-id="val.id" :txt="val.name"></group-tag>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import Breadcrumb from "../components/Breadcrumb";
  import {GET_ALL_GROUP, GET_CHECK_FAVORITE_GROUP, GET_CHECK_MY_FOCUS_GROUP, GET_CHECK_MY_GROUP} from "../assets/js/api";
  import GroupTag from "../components/GroupTag";

  export default {
    name: "all-group",
    components: {GroupTag, Breadcrumb},
    head() {
      return {title: '技术圈 - SegmentFault 思否'}
    },
    props: {},
    async asyncData({app, query}) {
      let index = query.index
      if (!index) {
        index = 0
      }
      const [groupMap, myFocusGroup, myGroup, favoriteGroup] = await Promise.all([
        app.$axios.$get(GET_ALL_GROUP),
        app.$axios.$get(GET_CHECK_MY_FOCUS_GROUP),
        app.$axios.$get(GET_CHECK_MY_GROUP),
        app.$axios.$get(GET_CHECK_FAVORITE_GROUP),
      ])
      return {groupMap, myFocusGroup, myGroup, favoriteGroup, showIndex: parseInt(index)}
    },
    data() {
      return {
        router: [
          {
            text: '圈子',
            href: '/groups'
          }, {
            text: '发现圈子'
          }
        ],
      }
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

  #all-group {
    padding-top: 30px;
    padding-bottom: 30px;

    .left-part {
      .group {
        display: flex;
        align-items: center;

        .img {
          width: 40px;
          min-width: 40px;
          height: 40px;
          min-height: 40px;
        }

        .info {
          padding-left: 10px;
          box-sizing: border-box;

          a {
            color: $green;
            font-size: 1.4rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            padding-bottom: 5px;

            &:hover {
              color: $darker-green;
            }
          }

          span {
            color: #777777;
            font-size: 1.2rem;
          }
        }
      }

      .group-box, .group-wide-box {
        border-radius: 3px;
        border: 1px solid #dddddd;
        margin-bottom: 10px;

        h2 {
          font-size: 1.8rem;
          color: #333333;
          background-color: #F5F5F5;
          padding: 5px 5px 5px 20px;
        }

        ul {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding: 10px 10px 10px 15px;
          box-sizing: border-box;

          .group {
            width: calc(100% / 3);
            padding-left: 5px;
            padding-bottom: 10px;
            box-sizing: border-box;
            @media(max-width: 550px) {
              width: 100%;
            }
          }
        }
      }

      .group-wide-box {
        .group {
          min-width: 100%;

          .img {
            border-radius: 50%;
            overflow: hidden;
          }
        }
      }
    }

    .right-part {
      .box {
        position: sticky;
        top: 20px;

        .button-list {
          border-radius: 3px;
          border: 1px solid #dddddd;
          overflow: hidden;
          margin-bottom: 20px;

          li {
            color: #333333;
            font-size: 1.4rem;
            padding: 7px 5px 7px 20px;
            box-sizing: border-box;
            cursor: pointer;
            border-bottom: 1px solid #dddddd;
          }

          li:nth-child(3) {
            border-bottom: none;
          }

          .active {
            background-color: $green;
            color: #ffffff;
          }
        }

        h2 {
          font-size: 1.8rem;
          color: #333333;
          padding-bottom: 10px;
        }

        .favorite-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .tag {
            margin-right: 5px;
          }
        }
      }
    }
  }
</style>
