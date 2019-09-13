<template>
  <div id="SearchInput" @focusin="focus=true" tabindex="1" @focusout="focus=false">
    <section class="box">
      <input class="common-input"
             @input="fetchKeyWords" v-model="txt" @keypress.enter="search" placeholder="搜索问题或关键字">
      <img v-show="icon" src="/icon/search-dark.png" @click="search">
    </section>
    <ul class="popup border-shadow" v-show="resultList.length>0&&focus">
      <li v-for="val in resultList" v-html="getHtml(val)" @click="clickItem(val)"></li>
    </ul>
  </div>
</template>

<script>
  import {GET_SEARCH_KEYWORD} from "../assets/js/api";

  export default {
    name: "SearchInput",
    props: {
      icon: {
        type: Boolean,
        default: true
      },
      fetch: {
        type: Function,
        required: false
      }
    },
    data() {
      return {
        txt: '',
        resultList: [],
        focus: false
      }
    },
    watch: {
      '$store.state.searchText'() {
        this.txt = this.$store.state.searchText
      }
    },
    computed: {},
    methods: {
      fetchKeyWords() {
        if (this.txt.length === 0) {
          this.resultList = []
          return
        }
        this.$axios.$get(GET_SEARCH_KEYWORD + '?txt=' + this.txt).then(res => {
          this.resultList = res
        })
      },
      getHtml(val) {
        const result = `<strong>${this.txt}</strong>`
        const reg = new RegExp(this.txt, 'g')
        return val.replace(reg, result)
      },
      clickItem(val) {
        this.txt = val
        this.resultList = []
      },
      search() {
        this.focus = false
        this.$store.commit('setSearchText', this.txt)
        if (this.fetch) {
          this.fetch(this.val)
        } else {
          this.$router.push({path: '/search?txt=' + this.txt})
          this.txt = ''
        }
      }
    },
    mounted() {
      this.txt = this.$store.state.searchText
    },
    created() {
      this.$on('search', () => {
        this.search()
      })
    },
    beforeDestroy() {
    }
  }
</script>

<style lang="scss">
  #SearchInput {
    width: 100%;
    position: relative;

    .box {
      position: relative;

      .common-input {
        padding-right: 30px;
        box-sizing: border-box;
      }

      img {
        position: absolute;
        top: 7px;
        right: 7px;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }

    .popup {
      position: absolute;
      width: 100%;
      top: 105%;
      z-index: 30000;
      background-color: white;

      li {
        padding: 5px 20px;
        box-sizing: border-box;
        cursor: pointer;
        color: #333333;
        font-size: 1.4rem;

        strong {
          color: red;
        }

        &:hover {
          background-color: #dddddd;
        }
      }
    }
  }
</style>
