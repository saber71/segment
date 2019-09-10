<template>
  <section id="sub-comments" v-show="comment.subComments.length>0">
    <section class="sub-comment" v-for="v in comment.subComments">
      <div class="info">
        <p class="content-part">
          <nuxt-link v-if="v.replyTo" :to="'/user/'+v.replyToId">@{{v.replyTo}}</nuxt-link>
          <md-render :content="v.content"></md-render>
        </p>
        <div class="author-reply">
          <nuxt-link :to="'/user?id='+v.authorId"><span class="author">{{v.author}}</span></nuxt-link>
          <span class="date">{{$formatDate(v.datetime)}}</span>
          <button class="reply" @click="reply(comment,v.author,v.authorId)">回复</button>
          <div class="good-part">
            <img class="good-icon" @click="goodComment(v)" :class="{'active':v.isGood}" src="/icon/good-green-full.png">
            x {{v.goodNum}}
          </div>
        </div>
      </div>
    </section>
    <p class="button-group">
      <m-button class="more" :callback="fetchMoreSubComment" :param="comment" v-show="comment.subComments.length<totalSubComments">查看更多</m-button>
      <button class="reply" @click="reply(comment)">{{comment.reply?'取消回复':'回复'}}</button>
    </p>
    <p class="reply-input-p" v-show="comment.reply">
      <textarea class="common-input comment-reply" v-model="comment.replyTxt"></textarea>
      <m-button class="reply-button" :callback="postSubComment" :param="comment">添加回复</m-button>
    </p>
  </section>
</template>

<script>
  import MButton from "./MButton";
  import {GET_SUB_COMMENT_MORE, POST_CHECK_GOOD_COMMENT, POST_CHECK_SUB_COMMENT_COMMIT} from "../assets/js/api";
  import MdRender from "./MdRender";
  import {TARGET_ARTICLE} from "../assets/js/const";

  const base64 = require('js-base64').Base64
  export default {
    name: "SubComment",
    components: {MdRender, MButton},
    props: {
      comment: {
        type: Object,
        required: true
      },
      target: {
        type: Number,
        default: TARGET_ARTICLE
      }
    },
    data() {
      return {
        page: 1,
        subCommentPageSize: 4
      }
    },
    watch: {},
    computed: {
      user() {
        return this.$store.state.user
      },
      totalSubComments() {
        const subCommentsNumber = this.comment.subCommentsNumber
        if (subCommentsNumber === undefined || subCommentsNumber === null) {
          return this.comment.totalSubComments
        }
        return subCommentsNumber
      }
    },
    methods: {
      fetchMoreSubComment(comment, finish) {
        this.$axios.$get(GET_SUB_COMMENT_MORE, {
          params: {
            page: this.page++,
            commentId: comment.id,
            size: this.subCommentPageSize,
            target: this.target
          }
        }).then(res => {
          res.forEach(val => comment.subComments.push(val))
          finish()
        })
      },
      postSubComment(comment, finish) {
        this.$axios.$post(POST_CHECK_SUB_COMMENT_COMMIT, {
          replyTxt: base64.encode(comment.replyTxt),
          replyTo: comment.replyTo,
          replyId: comment.replyId,
          id: comment.id,
          target: this.target
        }).then(() => {
          const subComment = {
            author: this.user.name,
            authorId: this.user.id,
            content: base64.encode(comment.replyTxt.replace(/^@.*\s/, '')),
            datetime: new Date().toString(),
            replyTo: comment.replyTo,
            replyToId: comment.replyToId,
            goodNum: 0,
          }
          comment.replyTxt = ''
          comment.replyTo = undefined
          comment.reply = false
          comment.replyToId = undefined
          comment.subComments.push(subComment)
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
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #sub-comments {
    background-color: #fafafa;
    padding: 10px 20px;
    box-sizing: border-box;
    margin-top: 20px;
    margin-bottom: 20px;

    .sub-comment {
      display: flex;
      font-size: 1.3rem;
      padding-top: 10px;

      .info {
        .content-part {
          line-height: 1.5;

          a {
            color: $green;
            margin-right: 5px;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .author-reply {
          display: flex;
          align-items: center;
          padding-top: 10px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #dddddd;
          flex-wrap: wrap;

          &:before {
            content: '';
            width: 20px;
            height: 1px;
            background-color: black;
          }

          a {
            width: fit-content;
            height: fit-content;
            display: inline-block;
            border-radius: 0;
            margin-left: 2px;
            color: $green;
          }

          .date {
            margin-left: 10px;
            color: #777777;
            font-size: 1.2rem;
          }

          .reply {
            display: inline-block;
            margin-left: 10px;
            color: #777777;

            &:hover {
              color: #333333;
            }
          }

          .good-part {
            margin-left: 10px;
            color: #777777;
            display: flex;
            align-items: center;

            .good-icon {
              max-width: 12px;
              max-height: 12px;
              margin-left: 5px;
              cursor: pointer;
              filter: grayscale(100%);
              margin-right: 5px;

              &:hover {
                filter: grayscale(0);
              }
            }

            .active {
              filter: grayscale(0);
            }
          }

        }
      }
    }

    .reply-input-p {
      display: flex;
      flex-wrap: wrap;

      .comment-reply {
        flex-grow: 1;
      }

      .reply-button {
        padding: 5px 10px;
        border: 1px solid #dddddd;
        font-size: 1.4rem;
        margin-left: 10px;
        white-space: nowrap;

        &:hover {
          background-color: #dddddd;
        }
      }

      @media(max-width: 550px) {
        .comment-reply {
          margin-bottom: 5px;
        }
        .comment-reply, .reply-button {
          width: 100%;
          margin-left: 0;
        }
      }
    }

    .button-group {
      .more, .reply {
        font-size: 1.3rem;
        color: blue;
        margin-right: 10px;
        padding: 5px 0;
      }
    }
  }
</style>
