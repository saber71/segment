<template>
  <div id="search">
    <section class="top">
      <section class="input-box default-container">
        <search-input ref="input" class="input" :icon="false" :fetch="search"></search-input>
        <m-button class="button" :click="toSearch">搜索</m-button>
      </section>
      <section class="labels default-container">
        <label @click="showIndex=1" :class="{active:showIndex===1}">问答</label>
        <label @click="showIndex=2" :class="{active:showIndex===2}">文章</label>
        <label :class="{active:showIndex===3}">讲堂</label>
        <label @click="showIndex=4" :class="{active:showIndex===4}">标签</label>
        <label @click="showIndex=5" :class="{active:showIndex===5}">用户</label>
        <label @click="showIndex=6" :class="{active:showIndex===6}">活动</label>
      </section>
    </section>
    <section class="body default-container">
      <p class="result-num">找到{{total}}条结果</p>
      <ul class="tag-list" v-if="showIndex===4">
        <li class="item" v-for="val in resultList[showIndex][page]">
          <section class="name">
            <tag class="tag" :tag="val.name"></tag>
          </section>
          <p>{{val.description}}</p>
        </li>
      </ul>
      <ul class="user-list" v-else-if="showIndex===5">
        <li v-for="val in resultList[showIndex][page]">
          <img class="avatar" :src="val.avatar">
          <div class="info">
            <nuxt-link :to="'/user?id='+val.id">{{val.name}}</nuxt-link>
            <br/>
            <p>
              <img class="rp-icon" src="/icon/rp.png">{{val.prestige}}
            </p>
          </div>
        </li>
      </ul>
      <ul class="list" v-else>
        <li v-for="val in resultList[showIndex][page]">
          <p class="name" v-html="getHtml(val.name)" @click="router(val)"></p>
          <p class="description" v-show="val.firstParagraph||val.description">
            {{$limitString(val.firstParagraph?val.firstParagraph:val.description,100)}}
          </p>
          <section class="bottom" v-show="showIndex===1||showIndex===2">
            <span>{{val.goodNum}}投票</span>
            <span v-if="showIndex===2">{{val.commentsNum}}评论</span>
            <span v-else>{{val.answerNum}}回答</span>
          </section>
        </li>
      </ul>
      <pagination :page="page+1" :total="total" @page-change="onPageChange"></pagination>
    </section>
  </div>
</template>

<script>
  import SearchInput from "../components/SearchInput";
  import MButton from "../components/MButton";
  import {GET_SEARCH, GET_SEARCH_TOTAL_NUM} from "../assets/js/api";
  import Tag from "../components/Tag";
  import Pagination from "../components/Pagination";

  export default {
    name: "search",
    components: {Pagination, Tag, MButton, SearchInput},
    props: {},
    head() {
      return {title: '搜索 - 博客社区'}
    },
    watchQuery: ['txt'],
    data() {
      return {
        showIndex: 1,
        resultList: [[], [], [], [], [], [], []],
        page: 0,
        size: 20,
        total: 0,
      }
    },
    watch: {
      showIndex() {
        this.page = 0
        this.search()
      }
    },
    computed: {
      searchText() {
        return this.$store.state.searchText
      }
    },
    methods: {
      router(val) {
        switch (this.showIndex) {
          case 1:
            this.$router.push({path: '/question?id=' + val.id})
            break
          case 2:
            this.$router.push({path: '/article/' + val.id})
            break
          case 6:
            this.$router.push({path: '/event?id=' + val.id})
            break
        }
      },
      onPageChange(page) {
        this.page = page - 1
        this.toSearch()
      },
      search(val) {
        if (this.resultList[this.showIndex][this.page]) {
          return
        }
        this.$axios.$get(GET_SEARCH, {
          params: {type: this.showIndex, txt: val, page: this.page, size: this.size}
        }).then(res => {
          this.resultList[this.showIndex][this.page] = res
          this.$forceUpdate()
        })
        this.$axios.$get(GET_SEARCH_TOTAL_NUM, {
          params: {type: this.showIndex, txt: val}
        }).then(res => {
          this.total = res
        })
      },
      toSearch() {
        this.$refs.input.$emit('search')
      },
      getHtml(val) {
        const result = `<strong>${this.searchText}</strong>`
        const reg = new RegExp(this.searchText, 'g')
        return val.replace(reg, result)
      }
    },
    mounted() {
      this.$store.commit('setHomeActiveMenu', '')
      this.toSearch()
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style lang="scss">
  @import "../assets/css/var";

  #search {
    .top {
      background-color: #F6F6F6;
      padding: 10px 0 5px;
      margin-bottom: 10px;

      .input-box {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        padding-top: 15px;

        .input {
          font-size: 1.8rem;
          flex-grow: 1;
        }

        .button {
          background-color: $green;
          color: #ffffff;
          font-size: 1.8rem;
          margin-left: 10px;
          white-space: nowrap;
          padding: 2px 20px;
          border-radius: 3px;

          &:hover {
            background-color: $darker-green;
          }
        }
      }

      .labels {

        label {
          display: inline-block;
          font-size: 1.4rem;
          color: $green;
          padding: 5px 20px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transform: translateY(4px);

          &:hover {
            background-color: #dddddd;
            border-radius: 3px 3px 0 0;
          }
        }

        .active {
          border-bottom-color: $green;
          color: #212121;

          &:hover {
            background-color: transparent;
          }
        }
      }
    }

    .body {
      padding-bottom: 30px;

      .result-num {
        color: #777777;
        font-size: 1.4rem;
        padding-bottom: 20px;
      }

      .tag-list {
        padding-bottom: 20px;

        .item {
          background-color: #F6F6F6;
          padding: 15px;
          box-sizing: border-box;
          font-size: 1.3rem;
          color: #666666;
          line-height: 1.8;
          margin-bottom: 20px;

          .name {
            padding-bottom: 10px;

            .tag {
              width: fit-content;
              font-size: 1.6rem;
            }
          }
        }
      }

      .list {
        padding-bottom: 20px;

        li {
          font-size: 1.3rem;
          color: #666666;
          padding-bottom: 20px;

          .name {
            color: $green;
            font-size: 1.6rem;
            cursor: pointer;
            padding-bottom: 10px;

            strong {
              color: red;
            }

            &:hover {
              color: $darker-green;
              text-decoration: underline;
            }
          }

          .description {
            line-height: 1.8;
            padding-bottom: 10px;
          }

          .bottom {
            span {
              margin-right: 10px;
            }
          }
        }
      }

      .user-list {
        padding-bottom: 20px;

        li {
          padding-bottom: 20px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

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
            flex-grow: 1;
            box-sizing: border-box;

            a {
              font-size: 1.6rem;
              color: $green;
              padding-bottom: 10px;

              &:hover {
                color: $darker-green;
              }
            }

            p {
              color: #333333;
              font-size: 1.2rem;
              display: flex;
              align-items: center;

              .rp-icon {
                width: 16px;
                height: 16px;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
