<template>
  <div id="Comments">
    <h3 class="number">{{total}}条评论</h3>
    <section class="content-part">
      <section class="comment" v-for="val in comments">
        <nuxt-link :to="{name:'user',query:{id:val.authorId}}">
          <img :src="val.avatar">
        </nuxt-link>
        <section class="text">
          <p>
            <nuxt-link :to="{name:'user',query:{id:val.authorId}}">
              <span class="author">{{val.author}}</span>
            </nuxt-link>
            <span class="date">{{$formatDate(val.datetime)}}</span>
          </p>
          <p class="content">{{val.content}}</p>
          <p class="good-reply">
            <img class="good-icon" @click="goodComment(val)" :class="{'active':val.isGood}" src="/icon/good-green-full.png">
            <span class="good-num">{{val.isGood?'已赞':'赞'}}{{val.goodNum>0?'x '+val.goodNum:''}}</span>
            <button class="reply" @click="reply(val)">{{val.reply?'取消回复':'回复'}}</button>
          </p>
          <sub-comment :target="target" :comment="val" v-show="val.subComments.length>0||val.reply"></sub-comment>
        </section>
      </section>
      <m-button class="fetch-comment" :callback="fetch" v-show="currentComments<total">点击加载更多</m-button>
      <section class="reply-comment">
        <section class="inner">
          <div class="avatar">
            <img :src="user?user.avatar:defaultAvatar">
          </div>
          <div class="input">
            <textarea class="common-input" rows="3" v-model="commentTxt" placeholder="说话文明礼貌"></textarea>
            <m-button class="button" :callback="postComment">发布评论</m-button>
          </div>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import MButton from "./MButton";
  import SubComment from "./SubComment";
  import {TARGET_ARTICLE} from "../assets/js/const";
  import {GET_COMMENT, POST_CHECK_COMMENT_COMMIT, POST_CHECK_GOOD_COMMENT} from "../assets/js/api";
  import MdRender from "./MdRender";

  export default {
    name: "Comments",
    components: {MdRender, SubComment, MButton},
    props: {
      targetId: {//文章、笔记、帖子的id
        type: Number,
        required: true
      },
      comments: {
        type: Array,
        required: true
      },
      total: {
        type: Number,
        required: true
      },
      target: {//评论的类型，
        type: Number,
        default: TARGET_ARTICLE
      }
    },
    data() {
      return {
        defaultAvatar: require('static/icon/user.png'),
        commentTxt: '',
        page: 0,
        size: 10,
        currentComments: 0,
      }
    },
    watch: {},
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      prepare(comments) {
        comments.forEach(val => {
          val.replyTxt = ''
          val.reply = false
        })
      },
      fetch(finish) {
        this.$axios.$get(GET_COMMENT, {
          params: {
            page: this.page++,
            size: this.size,
            id: this.targetId
          }
        }).then(res => {
          this.prepare(res)
          this.computeCurrentComponentNum(res)
          finish()
        })
      },
      computeCurrentComponentNum(res) {
        res.forEach(val => {
          this.comments.push(val)
          this.currentComments += val.totalSubComments + 1
        })
      },
      postComment(finish) {
        this.$axios.$post(POST_CHECK_COMMENT_COMMIT, {
          content: this.commentTxt, target: this.target
        }).then(() => {
          const obj = {
            content: this.commentTxt.replace(/^@.*\s/, ''),
            author: this.user.name,
            authorId: this.user.id,
            datetime: new Date().toString(),
            subComments: [],
            goodNum: 0,
            avatar: this.user.avatar
          }
          this.$emit('push', obj)
          this.commentTxt = ''
          finish()
        })
      },
      goodComment(comment) {
        this.$axios.$post(POST_CHECK_GOOD_COMMENT + '?commentId=' + comment.id + '&target=' + this.target, undefined).then(() => {
          comment.isGood = !comment.isGood
          if (comment.isGood) {
            comment.goodNum++
          } else {
            comment.goodNum--
          }
        })
      },
      reply(comment, replyTo, id) {
        comment.replyTo = replyTo
        comment.replyToId = id
        if (replyTo) {
          comment.reply = true
          comment.replyTxt = '@' + replyTo + ' '
        } else {
          comment.reply = !comment.reply
          comment.replyTo = undefined
          comment.replyTxt = ''
        }
        this.$forceUpdate()
      },
    },
    mounted() {
      this.prepare(this.comments)
      this.computeCurrentComponentNum(this.comments)
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #Comments {
    .number {
      font-size: 1.6rem;
      font-weight: bold;
      padding: 10px 0;
    }

    .content-part {
      .comment {
        display: flex;
        margin-bottom: 10px;
        padding-top: 10px;
        border-top: 1px solid #dddddd;

        a {
          width: 32px;
          min-width: 32px;
          height: 32px;
          min-height: 32px;
          border-radius: 50%;
          overflow: hidden;
        }

        .text {
          flex-grow: 1;
          padding-left: 20px;
          box-sizing: border-box;
          @media(max-width: 550px) {
            padding-left: 10px;
          }

          .author {
            font-size: 1.3rem;
            color: $green;
            margin-right: 10px;
          }

          .date {
            font-size: 1.2rem;
            color: #777;
          }

          .content {
            font-size: 1.4rem;
            line-height: 1.5;
            padding: 10px 0;
          }

          .good-reply {
            display: flex;
            align-items: center;

            .good-icon {
              width: 12px;
              height: 12px;
              margin-right: 10px;
              cursor: pointer;
              filter: grayscale(100%);

              &:hover {
                filter: grayscale(0);
              }
            }

            .active {
              filter: grayscale(0);
            }

            .good-num {
              font-size: 1.3rem;
              margin-right: 10px;
              color: #777;
            }

            .reply {
              color: #777;
              font-size: 1.3rem;

              &:hover {
                color: #333;
              }
            }
          }

          .button-group {
            padding-left: 50px;
            box-sizing: border-box;

            .more, .reply {
              font-size: 1.3rem;
              color: blue;
              margin-right: 10px;
              padding: 5px 0;
            }
          }
        }
      }

      .fetch-comment {
        display: block;
        font-size: 1.4rem;
        padding: 5px 10px;
        color: $green;
        margin: auto;
        border-radius: 5px;
        border: 1px solid #dddddd;

        &:hover {
          color: white;
          background-color: $green;
        }
      }

      .reply-comment {
        background-color: #fafafa;
        margin-top: 20px;
        border-top: 1px solid #dddddd;

        .inner {
          max-width: 1000px;
          margin: auto;
          display: flex;
          padding: 30px;
          box-sizing: border-box;
          @media(max-width: 992px) {
            max-width: 100%;
          }
          @media(max-width: 550px) {
            padding: 10px;
          }

          .avatar {
            max-width: 40px;
            min-width: 40px;
            max-height: 40px;
            min-height: 40px;
            border-radius: 50%;
            overflow: hidden;
            @media(max-width: 550px) {
              display: none;
            }
          }

          .input {
            padding-left: 20px;
            box-sizing: border-box;
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            flex-grow: 1;
            @media(max-width: 550px) {
              padding-left: 0;
            }

            textarea {
              width: 100%;
              height: 50px;
            }

            .button {
              background-color: $green;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              margin-top: 10px;
              font-size: 1.4rem;
            }
          }
        }
      }
    }
  }
</style>
