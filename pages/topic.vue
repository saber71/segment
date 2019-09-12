<template>
  <div id="topic" class="default-container default-content-layout">
    <section class="left-part">
      <breadcrumb :router="router"></breadcrumb>
      <section class="title">
        <h1>{{topic.name}}</h1>
        <section class="info">
          <div class="avatar">
            <img :src="topic.avatar">
          </div>
          <nuxt-link class="author" :to="'/user?id='+topic.authorId">{{topic.author}}</nuxt-link>
          <span class="datetime">{{$formatDatetime(topic.datetime)}}</span>
        </section>
      </section>
      <section class="content">
        <md-render :content="content"></md-render>
      </section>
      <comments :target-id="topic.id" :target="commentTarget" :total="topic.commentsNum" :comments="topic.commentArray"></comments>
    </section>
    <section class="right-part">
      <section class="box">
        <h2>最新帖子</h2>
        <ul>
          <li v-for="val in newestTopic">
            <nuxt-link :to="'/topic?id='+val.id">{{val.name}}</nuxt-link>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>

<script>
  import {GET_GROUP_TOPIC_CONTENT, GET_NEWEST_TOPIC, GET_TOPIC_DETAIL} from "../assets/js/api";
  import Breadcrumb from "../components/Breadcrumb";
  import MdRender from "../components/MdRender";
  import Comments from "../components/Comments";
  import {TARGET_TOPIC} from "../assets/js/const";

  export default {
    name: "topic",
    components: {Comments, MdRender, Breadcrumb},
    props: {},
    head() {
      return {title: this.topic.group + ' - ' + this.topic.name + ' - SegmentFault 思否'}
    },
    watchQuery: ['id'],
    async asyncData({app, query}) {
      const topicId = query.id
      const [topic, content, newestTopic] = await Promise.all([
        app.$axios.$get(GET_TOPIC_DETAIL + '?id=' + topicId),
        app.$axios.$get(GET_GROUP_TOPIC_CONTENT + '?id=' + topicId),
        app.$axios.$get(GET_NEWEST_TOPIC)
      ])
      const router = [
        {
          text: '圈子',
          href: '/groups',
        }, {
          text: topic.group,
          href: '/group?id=' + topic.groupId
        }, {
          text: '讨论详情',
        }
      ]
      return {topic, router, content, newestTopic}
    },
    data() {
      return {
        commentTarget: TARGET_TOPIC
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

  #topic {
    padding-top: 30px;
    padding-bottom: 30px;
    color: #333333;

    .left-part {
      .title {
        padding-top: 10px;
        padding-bottom: 10px;

        h1 {
          font-size: 2.4rem;
          padding-bottom: 5px;
        }

        .info {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .avatar {
            min-width: 24px;
            max-width: 24px;
            min-height: 24px;
            max-height: 24px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
          }

          .author {
            font-size: 1.4rem;
            color: $green;
            margin-right: 10px;
          }

          .datetime {
            font-size: 1.3rem;
            color: #777777;
          }
        }
      }

      .content {
        padding-bottom: 30px;
      }
    }

    .right-part {
      .box {
        position: sticky;
        top: 0;

        h2 {
          color: #333333;
          font-size: 1.8rem;
          padding-bottom: 10px;
        }

        li {
          padding: 5px 0;

          a {
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
