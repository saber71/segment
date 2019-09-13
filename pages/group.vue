<template>
  <div id="group" class="default-container default-content-layout">
    <section class="left-part">
      <breadcrumb :router="router"></breadcrumb>
      <section class="group-description">
        <section class="name">
          <span>{{group.name}}</span>
          <m-button class="focus-button" :click="focus" :class="{'active-button':group.isFocus}">{{group.isFocus?'已关注':'关注圈子'}}</m-button>
        </section>
        <md-render :content="group.description"></md-render>
        <p class="datetime">创建于 {{$formatDatetime(group.datetime)}}</p>
      </section>
      <group-topics :fetch-topic="fetchTopic" :page="page" :identifier="0"></group-topics>
      <br/>
      <pagination :page="page+1" :total="group.topicNum"></pagination>
    </section>
    <section class="right-part">
      <section class="box">
        <h2>圈主</h2>
        <section class="info">
          <div class="avatar">
            <img :src="group.avatar">
          </div>
          <div class="txt">
            <nuxt-link :to="'/user?id='+group.managerId">{{group.manager}}</nuxt-link>
            <br/>
            <p class="description">{{manager.description}}</p>
          </div>
        </section>
      </section>
      <section class="box">
        <h2>
          <nuxt-link :to="'/group-user-list?id='+group.id+'&name='+group.name">{{group.focusNum}}</nuxt-link>
          人关注
        </h2>
        <ul class="avatar-list">
          <li v-for="val in userList">
            <img :src="val.avatar">
          </li>
        </ul>
      </section>
      <section class="box">
        <h2>这个圈子的人也喜欢去</h2>
        <ul>
          <li class="like-group" v-for="val in otherLikeGroups">
            <img :src="val.img">
            <div class="txt">
              <nuxt-link :to="'/group?id='+val.id">{{val.name}}</nuxt-link>
              <br/>
              <p>{{val.topicNum}}个帖子</p>
            </div>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>

<script>
  import {GET_GROUP, GET_GROUP_USER, GET_TOPIC, GET_USER_DATA, GET_USER_OTHER_LIKE_GROUP, POST_CHECK_FOCUS_GROUP} from "../assets/js/api";
  import Breadcrumb from "../components/Breadcrumb";
  import MdRender from "../components/MdRender";
  import MButton from "../components/MButton";
  import GroupTopics from "../components/GroupTopics";
  import Pagination from "../components/Pagination";

  export default {
    name: "group",
    components: {Pagination, GroupTopics, MButton, MdRender, Breadcrumb},
    props: {},
    head() {
      return {title: '圈子 - ' + this.group.name + ' - SegmentFault 思否'}
    },
    watchQuery: ['id'],
    async asyncData({app, query}) {
      const id = query.id
      const [group, userList, otherLikeGroups] = await Promise.all([
        app.$axios.$get(GET_GROUP + '?id=' + id),
        app.$axios.$get(GET_GROUP_USER, {
          params: {groupId: id, page: 0, size: 10}
        }),
        app.$axios.$get(GET_USER_OTHER_LIKE_GROUP + '?id=' + id)
      ])
      const manager = await app.$axios.$get(GET_USER_DATA + '?id=' + group.managerId)
      return {group, userList, manager, otherLikeGroups}
    },
    data() {
      return {
        router: [
          {
            text: '圈子',
            href: '/groups'
          }, {
            text: '圈子详情'
          }
        ],
        page: 0
      }
    },
    watch: {},
    computed: {},
    methods: {
      focus(finish) {
        this.$axios.$post(POST_CHECK_FOCUS_GROUP, {
          groupId: this.group.id, status: this.group.isFocus
        }).then(() => {
          this.group.isFocus = !this.group.isFocus
          if (this.group.isFocus) {
            this.group.focusNum++
          } else {
            this.group.focusNum--
          }
          finish()
        })
      },
      fetchTopic(topicArray, identifier, finish) {
        this.$axios.$get(GET_TOPIC, {
          params: {page: this.page, size: 20, groupId: this.group.id}
        }).then(res => {
          topicArray[identifier][this.page] = res
          finish()
        })
      },
    },
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

  #group {
    padding-top: 30px;
    padding-bottom: 30px;

    .left-part {
      .group-description {
        margin: 10px 0;
        padding: 20px;
        box-sizing: border-box;
        background-color: #FAFAFA;

        .name {
          padding-bottom: 10px;

          span {
            font-size: 2.0rem;
            color: #333333;
            padding-right: 10px;
          }

          .focus-button {
            background-color: $green;
            color: #ffffff;
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 1.3rem;

            &:hover {
              background-color: $darker-green;
            }
          }
        }

        .datetime {
          padding-top: 5px;
          font-size: 1.3rem;
          color: #777777;
        }
      }
    }

    .right-part {
      .box {
        padding-bottom: 10px;
        border-bottom: 1px solid #dddddd;
        margin-bottom: 10px;

        h2 {
          font-size: 1.8rem;
          color: #333333;
          padding-bottom: 10px;

          a {
            color: $green;

            &:hover {
              color: $darker-green;
            }
          }
        }

        .info {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding-top: 10px;

          .avatar {
            min-width: 30px;
            max-width: 30px;
            min-height: 30px;
            max-height: 30px;
            border-radius: 50%;
            overflow: hidden;
          }

          .txt {
            padding-left: 10px;
            box-sizing: border-box;

            a {
              font-size: 1.4rem;
              color: $green;
              padding-bottom: 5px;

              &:hover {
                color: $darker-green;
              }
            }

            .description {
              font-size: 1.2rem;
              color: #777777;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }

        .avatar-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          li {
            min-width: 30px;
            max-width: 30px;
            min-height: 30px;
            max-height: 30px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
            margin-bottom: 5px;
          }
        }

        .like-group {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding-top: 5px;
          padding-bottom: 5px;

          img {
            width: 40px;
            min-width: 40px;
            height: 40px;
            min-height: 40px;
          }

          .txt {
            padding-left: 10px;
            box-sizing: border-box;

            a {
              color: $green;
              font-size: 1.4rem;
              padding-bottom: 5px;

              &:hover {
                color: $green;
              }
            }

            p {
              font-size: 1.2rem;
              color: #777;
            }
          }
        }
      }
    }
  }
</style>
