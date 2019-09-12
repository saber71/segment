<template>
  <div id="GroupTopics">
    <section class="new">
      <label>最近的帖子</label>
      <button @click="showInputNewTopic=true">发新帖</button>
    </section>
    <section class="edit-new-topic" v-show="showInputNewTopic">
      <input class="common-input" v-model="newTopicName" placeholder="标题">
      <div class="select-group" tabindex="1">
        <div class="board">{{newTopicGroup?newTopicGroup.name:'选择发布到的圈子'}}
          <img src="/icon/triangle-black-down.svg">
        </div>
        <ul class="standby-group-list  border-shadow">
          <li class="type-name" v-for="(array,type) in groupMap">
            <strong>{{type}}</strong>
            <ul>
              <li class="item" v-for="val in array" @click="newTopicGroup=val">{{val.name}}</li>
            </ul>
          </li>
        </ul>
      </div>
      <editor v-model="newTopicContent"></editor>
      <section class="button-group">
        <button class="cancel" @click="showInputNewTopic=false">取消</button>
        <m-button class="save" :click="save">发布</m-button>
      </section>
    </section>
    <ul class="topic-list">
      <li v-for="(val) in array()">
        <div class="avatar">
          <img :src="val.avatar">
        </div>
        <section class="info">
          <section class="left">
            <nuxt-link class="topic-name" :to="'/topic?id='+val.id">{{val.name}}</nuxt-link>
            <section class="author">
              <nuxt-link class="author-name" :to="'/user?id='+val.authorId">{{val.author}}</nuxt-link>
              <span class="datetime">{{$formatDatetime(val.datetime)}}</span>
              <span class="last-reply" v-if="val.lastReplyName">最后回复
                    <nuxt-link :to="'/user?id='+val.lastReplyId">{{val.lastReplyName}}</nuxt-link>
                  </span>
            </section>
          </section>
          <group-tag class="tag" :txt="val.group" :group-id="val.groupId"></group-tag>
          <div class="comment-num">
            <img src="/icon/chat-black.png">{{$formatNumber(val.commentsNum)}}
          </div>
        </section>
      </li>
    </ul>
  </div>
</template>

<script>
  import GroupTag from "./GroupTag";
  import Editor from "./Editor";
  import MButton from "./MButton";
  import {GET_ALL_GROUP, POST_CHECK_NEW_TOPIC} from "../assets/js/api";

  export default {
    name: "GroupTopics",
    components: {MButton, Editor, GroupTag},
    props: {
      fetchTopic: {
        type: Function,//topicArray,identifier,finish,clearPage:true，page清零
        required: true
      },
      identifier: {
        type: Number,
        required: true
      },
      page: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        showInputNewTopic: false,
        newTopicName: '',
        newTopicContent: '',
        newTopicGroup: undefined,
        topicArray: [],
        groupMap: {}
      }
    },
    watch: {
      identifier() {
        this.fetchTopic(this.topicArray, this.identifier, this.finish, true)
      }
    },
    computed: {},
    methods: {
      array() {
        if (!this.topicArray[this.identifier]) {
          this.topicArray[this.identifier] = []
        }
        return this.topicArray[this.identifier][this.page]
      },
      finish() {
        this.$forceUpdate()
      },
      save(finish) {
        if (this.newTopicContent === '' || !this.newTopicGroup || this.newTopicName === '') {
          return
        }
        this.$axios.$post(POST_CHECK_NEW_TOPIC, {
          content: require('js-base64').Base64.encode(this.newTopicContent),
          groupId: this.newTopicGroup.id,
          name: this.newTopicName
        }).then(() => {
          this.showInputNewTopic = false
          finish()
          alert("发布成功！！！")
        })
      }
    },
    mounted() {
      this.$axios.$get(GET_ALL_GROUP).then(res => {
        this.groupMap = res
      })
      this.$on('force-fetch', () => {
        this.fetchTopic(this.topicArray, this.identifier, this.finish, false)
      })
      this.fetchTopic(this.topicArray, this.identifier, this.finish, true)
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #GroupTopics {
    .new {
      padding-bottom: 10px;
      padding-top: 10px;
      border-bottom: 1px solid #dddddd;

      label {
        font-size: 1.8rem;
        margin-right: 10px;
      }

      button {
        border-radius: 3px;
        font-size: 1.2rem;
        border: 1px solid #dddddd;
        padding: 0 5px;

        &:hover {
          background-color: #dddddd;
        }
      }
    }

    .edit-new-topic {
      background-color: #FCF8E3;
      padding: 20px;
      box-sizing: border-box;
      margin-top: 10px;
      margin-bottom: 10px;

      .common-input {
        display: block;
        margin-bottom: 10px;
      }

      .select-group {
        margin-bottom: 10px;
        position: relative;
        width: fit-content;
        min-width: 300px;

        .board {
          position: relative;
          border: 1px solid #dddddd;
          font-size: 1.4rem;
          color: #333333;
          padding-left: 10px;
          padding-right: 30px;
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          cursor: default;
          background-color: #fff;
          border-radius: 3px;

          img {
            position: absolute;
            right: 5px;
            top: 8px;
            width: 12px;
            height: 12px;
          }
        }

        .standby-group-list {
          display: none;
          position: absolute;
          top: 100%;
          z-index: 200000;
          background-color: white;
          font-size: 1.4rem;
          color: #333333;
          width: 100%;
          max-width: 300px;
          max-height: 300px;
          overflow-y: auto;

          .type-name {
            padding: 5px 15px 0;
            box-sizing: border-box;

            strong {
              font-size: 1.5rem;
            }

            .item {
              padding: 5px 15px;
              box-sizing: border-box;
              cursor: pointer;

              &:hover {
                background-color: #1e4bff;
                color: #ffffff;
              }
            }
          }
        }

        &:focus .standby-group-list {
          display: block;
        }

        @media(max-width: 550px) {
          min-width: 0;
        }
      }

      .button-group {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        margin-top: 10px;

        .cancel {
          border: 1px solid #dddddd;
          padding: 5px 10px;
          border-radius: 5px;
          background-color: #ffffff;
          margin-right: 10px;

          &:hover {
            background-color: #dddddd;
          }
        }

        .save {
          background-color: $green;
          color: #ffffff;
          padding: 5px 10px;
          border-radius: 5px;

          &:hover {
            background-color: $darker-green;
          }
        }
      }
    }

    .topic-list {
      padding-bottom: 30px;

      li {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #dddddd;
        padding-bottom: 10px;
        padding-top: 10px;

        .avatar {
          min-width: 40px;
          max-width: 40px;
          min-height: 40px;
          max-height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .info {
          padding-left: 10px;
          box-sizing: border-box;
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;

          .left {
            width: 50%;

            .topic-name {
              font-size: 1.6rem;
              color: $green;
              line-height: 1.7;
              display: block;

              &:hover {
                color: $darker-green;
              }
            }

            .author {
              display: block;
              font-size: 1.3rem;
              color: #999999;

              .author-name {
                margin-right: 10px;
              }

              .datetime {
                margin-right: 10px;
              }

              .last-reply a {
                margin-left: 5px;
              }
            }
          }

          .comment-num {
            display: flex;
            align-items: center;
            font-size: 1.6rem;
            opacity: 0.7;

            img {
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
          }

          @media(max-width: 550px) {
            .tag {
              display: none;
            }
            .left {
              flex-grow: 1;
              padding-right: 10px;
            }
          }
        }
      }
    }
  }
</style>
