<template>
  <div id="Groups" class="default-container default-content-layout">
    <section class="left-part">
      <h1>圈子</h1>
      <p class="banner">这里是程序员的聚集地，根据你的兴趣认识更多的朋友</p>
      <tabs :labels="labels" @active-change="activeChange" v-show="showCommon">
        <group-topics ref="groupTopics0" :fetch-topic="fetchTopic" :identifier="tabIndex" :page="page"></group-topics>
      </tabs>
      <section v-show="showMyTopics">
        <group-topics ref="groupTopics1" :fetch-topic="fetchMyTopic" :identifier="0" :page="page"></group-topics>
      </section>
      <section v-show="showMyReply">
        <group-topics ref="groupTopics2" :fetch-topic="fetchMyReplyTopic"
                      :identifier="0" :page="page"></group-topics>
      </section>
      <pagination :page="page+1" :total="total" @page-change="onPageChange"></pagination>
      <br/>
      <section class="to-all-group">
        加入自己感兴趣的圈子吧
        <nuxt-link to="/all-group">发现圈子</nuxt-link>
      </section>
    </section>
    <section class="right-part">
      <section class="box">
        <h2>今日热议</h2>
        <nuxt-link :to="'/topic?id='+hotTopic.id">{{hotTopic.name}}</nuxt-link>
        <span>{{hotTopic.commentsNum}}讨论</span>
      </section>
      <section class="box">
        <h2>发现圈子
          <nuxt-link to="/all-group">更多</nuxt-link>
        </h2>
        <ul>
          <li v-for="val in recommendGroups">
            <div class="img">
              <img :src="val.img">
            </div>
            <div class="info">
              <nuxt-link :to="'/group?id='+val.id">{{val.name}}</nuxt-link>
              <span>{{val.commentsNum}}讨论</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="my-groups">
        <h2>我的圈子</h2>
        <div class="my-focus">
          我加入的圈子：
          <nuxt-link to="/all-group?index=1">（{{myFocusGroup.length}}）</nuxt-link>
        </div>
        <div class="button-group">
          <button class="my-topics" @click="showMyTopics=true">我的主题</button>
          <button class="my-reply" @click="showMyReply=true">我的回复</button>
          <button class="common" @click="showCommon=true">通常</button>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
  import {GET_CHECK_MY_FOCUS_GROUP, GET_CHECK_TOPIC_NUM, GET_HOT_TOPIC_TODAY, GET_RECOMMEND_GROUP, GET_TOPIC} from "../assets/js/api";
  import Tabs from "../components/Tabs";
  import GroupTag from "../components/GroupTag";
  import Editor from "../components/Editor";
  import MButton from "../components/MButton";
  import GroupTopics from "../components/GroupTopics";
  import Pagination from "../components/Pagination";

  export default {
    name: "groups",
    components: {Pagination, GroupTopics, MButton, Editor, GroupTag, Tabs},
    props: {},
    head() {
      return {title: '技术圈 - SegmentFault 思否'}
    },
    async asyncData({app}) {
      const [hotTopic, recommendGroups, myFocusGroup, topicNumber] = await Promise.all([
        app.$axios.$get(GET_HOT_TOPIC_TODAY),
        app.$axios.$get(GET_RECOMMEND_GROUP),
        app.$axios.$get(GET_CHECK_MY_FOCUS_GROUP),
        app.$axios.$get(GET_CHECK_TOPIC_NUM)
      ])
      return {hotTopic, recommendGroups, myFocusGroup, topicNumber}
    },
    data() {
      return {
        tabIndex: 0,
        labels: ['全部', '我关注的', '技术', '创意', '好玩', '酷工作', '其他'],
        showMyReply: false,
        showCommon: true,
        showMyTopics: false,
        page: 0
      }
    },
    watch: {
      showMyReply(val) {
        if (val) {
          this.showCommon = false
          this.showMyTopics = false
        }
      },
      showCommon(val) {
        if (val) {
          this.showMyReply = false
          this.showMyTopics = false
        }
      },
      showMyTopics(val) {
        if (val) {
          this.showMyReply = false
          this.showCommon = false
        }
      },
    },
    computed: {
      total() {
        switch (this.tabIndex) {
          case 0:
            return this.topicNumber.all
          case 1:
            return this.topicNumber.myFocus
          case 2:
            return this.topicNumber.tech
          case 3:
            return this.topicNumber.mind
          case 4:
            return this.topicNumber.fun
          case 5:
            return this.topicNumber.job
          case 6:
            return this.topicNumber.other
        }
      }
    },
    methods: {
      activeChange(index) {
        this.tabIndex = index
      },
      onPageChange(page) {
        this.page = page - 1
        if (this.showCommon) {
          this.$refs.groupTopics0.$emit('force-fetch')
        } else if (this.showMyTopics) {
          this.$refs.groupTopics1.$emit('force-fetch')
        } else if (this.showMyReply) {
          this.$refs.groupTopics2.$emit('force-fetch')
        }
      },
      fetchTopic(topicArray, identifier, finish, clearPage) {
        if (clearPage) {
          this.page = 0
        }
        if (topicArray[identifier] && topicArray[identifier][this.page]) {
          return
        }
        this.$axios.$get(GET_TOPIC, {
          params: {index: identifier, page: this.page, size: 20}
        }).then(res => {
          if (!topicArray[identifier]) {
            topicArray[identifier] = []
          }
          topicArray[identifier][this.page] = res
          finish()
        })
      },
      fetchMyTopic(topicArray, identifier, finish, clearPage) {
        if (clearPage) {
          this.page = 0
        }
        if (topicArray[identifier] && topicArray[identifier][this.page]) {
          return
        }
        this.$axios.$get(GET_TOPIC, {
          params: {index: identifier, page: this.page, size: 20, userId: this.$store.state.user.id}
        }).then(res => {
          topicArray[identifier][this.page] = res
          finish()
        })
      },
      fetchMyReplyTopic(topicArray, identifier, finish, clearPage) {
        if (clearPage) {
          this.page = 0
        }
        if (topicArray[identifier] && topicArray[identifier][this.page]) {
          return
        }
        this.$axios.$get(GET_TOPIC, {
          params: {index: identifier, page: this.page, size: 20, userId: this.$store.state.user.id, userReply: true}
        }).then(res => {
          topicArray[identifier][this.page] = res
          finish()
        })
      },
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '圈子')
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #Groups {
    padding-top: 30px;
    padding-bottom: 30px;
    font-size: 1.4rem;
    color: #333333;

    .left-part {
      h1 {
        font-size: 2.4rem;
      }

      .banner {
        color: #666666;
      }

      .to-all-group {
        text-align: center;
        font-size: 1.4rem;
        color: #333333;

        a {
          color: $green;
          border: 1px solid #dddddd;
          border-radius: 25px;
          padding: 5px 10px;
          margin-left: 3px;

          &:hover {
            text-decoration: none;
            background-color: #dddddd;
          }
        }
      }
    }

    .right-part {
      @media(max-width: 768px) {
        padding-top: 30px;
        padding-left: 0;
      }

      .box {
        padding-bottom: 10px;
        border-bottom: 1px solid #dddddd;
        margin-bottom: 10px;

        h2 {
          font-size: 1.6rem;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 5px;

          a {
            color: $green;
            font-size: 1.4rem;

            &:hover {
              color: $darker-green;
            }
          }
        }

        a {
          font-size: 1.4rem;
          line-height: 1.8;
          color: $green;
          padding-right: 5px;
        }

        span {
          font-size: 1.3rem;
          color: #777777;
        }

        li {
          display: flex;
          align-items: center;
          padding: 5px 0;

          .img {
            min-width: 40px;
            max-width: 40px;
            min-height: 40px;
            max-height: 40px;
          }

          .info {
            padding-left: 10px;
            box-sizing: border-box;
          }
        }
      }

      .my-groups {
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #dddddd;

        h2 {
          background-color: #F5F5F5;
          font-size: 1.6rem;
          color: #333333;
          padding: 5px 20px;
          box-sizing: border-box;
          margin-bottom: 15px;
        }

        .my-focus {
          font-size: 1.4rem;
          color: #777777;
          padding-bottom: 10px;
          padding-left: 15px;
          padding-right: 15px;
          box-sizing: border-box;

          a {
            color: $green;

            &:hover {
              color: $darker-green;
              text-decoration: none;
            }
          }
        }

        .button-group {
          padding-bottom: 10px;
          padding-left: 15px;
          padding-right: 15px;
          box-sizing: border-box;

          button {
            margin-right: 10px;
            margin-bottom: 5px;
            color: $green;
            font-size: 1.4rem;

            &:hover {
              color: $darker-green;
            }
          }
        }
      }
    }
  }
</style>
