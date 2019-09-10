<template>
  <div id="notes" class="default-container">
    <ul class="labels">
      <li :class="{active:activeLabelIndex===0}" @click="activeLabelIndex=0">我的笔记</li>
      <li :class="{active:activeLabelIndex===1}" @click="activeLabelIndex=1">推荐笔记</li>
    </ul>
    <ul class="note-list">
      <li v-for="(val,index) in notesArray[page]">
        <section class="info">
          <div class="avatar" v-show="activeLabelIndex===1">
            <img :src="val.avatar">
          </div>
          <div class="txt">
            <nuxt-link class="top" :to="'/note?id='+val.id">
              <img src="/icon/lock.png" v-show="val.isPrivate">
              {{val.name}}
            </nuxt-link>
            <p class="bottom">
              <nuxt-link class="author" :to="'/user?id='+val.id">{{val.author}}</nuxt-link>
              发布于<span class="datetime">{{$formatDatetime(val.datetime)}}</span>
              <span class="fork-num" v-show="val.forkNum>0"><strong>{{val.forkNum}}</strong>分支</span>
            </p>
          </div>
        </section>
        <md-render :content="val.firstPara" :key="index"></md-render>
      </li>
    </ul>
    <pagination :page="page+1" @page-change="fetchMoreNotes" :total="total"></pagination>
  </div>
</template>

<script>
  import Pagination from "../components/Pagination";
  import {GET_CHECK_NOTES, GET_CHECK_NOTES_NUMBER} from "../assets/js/api";
  import MdRender from "../components/MdRender";

  export default {
    name: "notes",
    components: {MdRender, Pagination},
    props: {},
    head() {
      let prefix = '笔记'
      if (this.activeLabelIndex === 1) {
        prefix = '公开的笔记'
      }
      return {title: prefix + ' - SegmentFault 思否'}
    },
    async asyncData({app}) {
      const noteNum = await app.$axios.$get(GET_CHECK_NOTES_NUMBER)
      return {noteNum}
    },
    data() {
      return {
        activeLabelIndex: 1,
        page: 0,
        myNotes: [],
        recommendNotes: [],
        size: 20
      }
    },
    watch: {
      activeLabelIndex() {
        this.fetchMoreNotes(1)
      }
    },
    computed: {
      notesArray() {
        return this.activeLabelIndex === 0 ? this.myNotes : this.recommendNotes
      },
      total() {
        return this.activeLabelIndex === 0 ? this.noteNum.my : this.noteNum.all
      },
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      fetchMoreNotes(page) {
        this.page = page - 1
        const array = this.notesArray
        if (array[this.page]) {
          return
        }
        this.$axios.$get(GET_CHECK_NOTES, {
          params: {page: this.page, size: this.size, type: this.activeLabelIndex}
        }).then(res => {
          array[this.page] = res
          this.$forceUpdate()
        })
      },
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '')
      this.fetchMoreNotes(1)
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #notes {
    padding: 20px 0;
    @media(max-width: 768px) {
      padding: 20px;
      box-sizing: border-box;
    }

    .labels {
      border-bottom: 2px solid #dddddd;
      margin-bottom: 20px;

      li {
        display: inline-block;
        font-size: 1.4rem;
        color: #333333;
        padding: 0 20px 5px;
        border-bottom: 3px solid transparent;
        transform: translateY(2px);
        cursor: pointer;
      }

      .active {
        border-bottom-color: $green;
      }
    }

    .note-list {
      padding-bottom: 20px;

      li {
        border-bottom: 1px solid #dddddd;
        margin-bottom: 10px;

        .info {
          display: flex;
          align-items: center;

          .avatar {
            min-width: 40px;
            max-width: 40px;
            min-height: 40px;
            max-height: 40px;
            border-radius: 50%;
            overflow: hidden;
          }

          .txt {
            flex-grow: 1;
            margin-left: 10px;

            .top {
              font-size: 1.6rem;
              color: $green;
              padding-bottom: 5px;
              display: flex;
              align-items: center;

              img {
                width: 16px;
                height: 16px;
                margin-right: 5px;
              }

              &:hover {
                color: $darker-green;
              }
            }

            .bottom {
              display: flex;
              align-items: center;
              font-size: 1.4rem;
              color: #777777;
              flex-wrap: wrap;

              .author {
                margin-right: 5px;
              }

              .datetime {
                margin-right: 5px;
              }

              strong {
                color: #333333;
              }
            }
          }
        }
      }
    }
  }
</style>
