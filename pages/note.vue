<template>
  <div id="Note" class="default-container default-content-layout">
    <section class="left-part">
      <section class="info">
        <section class="name">
          <div class="logo">记</div>
          <img src="/icon/lock.png" v-show="note.isPrivate">
          {{note.name}}
        </section>
        <section class="author">
          <div class="avatar">
            <img :src="note.avatar">
          </div>
          <nuxt-link class="author-name" :to="'/user?id='+note.authorId">{{note.author}}</nuxt-link>
          <img class="rp-icon" src="/icon/rp.png">
          <span class="rp">{{note.rp}}</span>
          <span class="datetime">{{$formatDatetime(note.datetime)}}发布</span>
        </section>
      </section>
      <md-render :content="note.content" :thin="false"></md-render>
      <br/>
      <section class="buttons">
        <m-button class="fork" :class="{'active-button':note.isFork}" :click="fork">{{note.isFork?'已分支':'分支'}}</m-button>
        <m-button class="collect" :class="{'active-button':note.isCollect}" :click="collect">{{note.isCollect?'已收藏':'收藏'}}</m-button>
      </section>
      <comments :comments="note.comments" :total="note.commentsNum"
                :target-id="note.id" :target="target" @push="pushComment"></comments>
    </section>
    <section class="right-part">
      <section class="box">
        <section class="fork">
          <m-button :click="fork" :class="{'active-button':note.isFork}">{{note.isFork?'已分支':'分支'}}</m-button>
          <strong>{{note.forkNum}}</strong>分支
        </section>
        <section class="collect">
          <m-button :click="collect" :class="{'active-button':note.isCollect}">{{note.isCollect?'已收藏':'收藏'}}</m-button>
          <strong>{{note.collectNum}}</strong>收藏
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import {GET_CHECK_NOTE, POST_CHECK_COLLECT_NOTE, POST_CHECK_FORK_NOTE} from "../assets/js/api";
  import MdRender from "../components/MdRender";
  import MButton from "../components/MButton";
  import Comments from "../components/Comments";
  import {TARGET_NOTE} from "../assets/js/const";

  export default {
    name: "note",
    components: {Comments, MButton, MdRender},
    props: {},
    head() {
      return {title: this.note.name + ' - SegmentFault 思否'}
    },
    async asyncData({app, query}) {
      const note = await app.$axios.$get(GET_CHECK_NOTE + "?id=" + query.id)
      return {note}
    },
    data() {
      return {
        target: TARGET_NOTE,
        page: 0
      }
    },
    watch: {},
    computed: {},
    methods: {
      fork(finish) {
        this.$axios.$post(POST_CHECK_FORK_NOTE, {
          id: this.note.id, status: !this.note.isFork
        }).then(() => {
          this.note.isFork = !this.note.isFork
          finish()
        })
      },
      collect(finish) {
        this.$axios.$post(POST_CHECK_COLLECT_NOTE, {
          id: this.note.id, status: !this.note.isCollect
        }).then(() => {
          this.note.isCollect = !this.note.isCollect
          finish()
        })
      },
      pushComment(val) {
        this.note.comments.push(val)
      }
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

  #Note {
    padding-top: 20px;
    padding-bottom: 20px;

    .left-part {
      .info {
        padding-bottom: 20px;

        .name {
          font-size: 2.4rem;
          color: #333;
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            max-width: 28px;
            min-height: 28px;
            max-height: 28px;
            border-radius: 50%;
            overflow: hidden;
            color: $green;
            font-size: 1.6rem;
            margin-right: 10px;
            border: 1px solid $green;
          }

          img {
            width: 16px;
            height: 16px;
            margin-right: 10px;
          }
        }

        .author {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          font-size: 1.4rem;
          color: #777777;

          .avatar {
            min-width: 24px;
            max-width: 24px;
            min-height: 24px;
            max-height: 24px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 5px;
          }

          .author-name {
            color: $green;
            margin-right: 5px;

            &:hover {
              color: $darker-green;
            }
          }

          .rp-icon {
            width: 16px;
            height: 16px;
            margin-right: 2px;
          }

          .rp {
            font-weight: bold;
            color: #333333;
            margin-right: 5px;
          }
        }
      }

      .buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        button {
          margin-bottom: 10px;
        }

        .fork, .collect {
          border-radius: 4px;
          font-size: 1.8rem;
          padding: 5px 15px;
        }

        .fork {
          color: #ffffff;
          background-color: $green;
          margin-right: 5px;

          &:hover {
            background-color: $darker-green;
          }
        }

        .collect {
          color: #333333;
          border: 1px solid #dddddd;
          margin-left: 5px;

          &:hover {
            background-color: #dddddd;
          }
        }
      }
    }

    .right-part {
      color: #333;
      @media(max-width: 768px) {
        display: none;
      }

      .box {
        position: sticky;
        top: 20px;

        .fork, .collect {
          font-size: 1.4rem;
          margin-bottom: 10px;
        }

        .fork button {
          background-color: $green;
          padding: 5px 10px;
          color: #ffffff;
          border-radius: 4px;
          margin-right: 10px;

          &:hover {
            background-color: $darker-green;
          }
        }

        .collect button {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #dddddd;
          margin-right: 10px;

          &:hover {
            background-color: #ddd;
          }
        }
      }
    }
  }
</style>
