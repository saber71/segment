<template>
  <div id="Tags" class="default-container">
    <h1>标签</h1>
    <p class="tag-word">标签不仅能组织和归类你的内容，还能关联相似的内容。正确的使用标签将让你的问题被更多人发现和解决。</p>
    <section class="my-tags">
      <div class="ready-tags">
        <tag class="tag" v-for="(val,index) in readyTags" :tag="val" :key="index">
          <div class="close" @click.stop="remove(index)"></div>
        </tag>
        <m-button class="focus" :click="focusTag" v-show="readyTags.length>0">关注</m-button>
      </div>
      <div class="search-tag" tabindex="1"
           @keypress.down="activeSimilarItemDown" @keypress.up="activeSimilarItemUp"
           @focusin="focusInput=true" @focusout="focusInput=false">
        <input class="common-input" v-model="searchTxt"
               @input="fetchSimilarTags" :disabled="readyTags.length===5" placeholder="添加关注的标签">
        <ul class="popup border-shadow" v-show="similarTags.length>0&&focusInput">
          <li v-for="(val,index) in similarTags" @click="clickSimilarTag(val)" v-html="val"
              @mouseenter="activeSimilarItem=index"
              :class="{active:activeSimilarItem===index}"></li>
        </ul>
      </div>
      <div class="focused-tags">
        <div class="focused-tag" v-for="(val,index) in focusTags">
          <tag :tag="val" :key="index"></tag>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import {GET_CHECK_FOCUS_TAGS, GET_SIMILAR_TAGS, POST_CHECK_FOCUS_TAG} from "../assets/js/api";
  import Tag from "../components/Tag";
  import MButton from "../components/MButton";

  export default {
    name: "Tags",
    components: {MButton, Tag},
    props: {},
    data() {
      return {
        focusTags: [],
        readyTags: [],
        searchTxt: '',
        similarTags: [],
        focusInput: false,
        activeSimilarItem: 0,
      }
    },
    watch: {},
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      activeSimilarItemDown() {
        alert('down')
        if (this.activeSimilarItem < this.similarTags.length) {
          this.activeSimilarItem++
        }
      },
      activeSimilarItemUp() {
        alert('up')
        if (this.activeSimilarItem > 0) {
          this.activeSimilarItem--
        }
      },
      clickSimilarTag(tagName) {
        const reg = new RegExp('<strong>' + this.searchTxt + '</strong>', 'g')
        this.readyTags.push(tagName.replace(reg, this.searchTxt))
        this.similarTags = []
        this.searchTxt = ''
        this.activeSimilarItem = 0
      },
      async fetchSimilarTags() {
        if (this.searchTxt === '') {
          this.similarTags = []
          return
        }
        this.similarTags = await this.$axios.$get(GET_SIMILAR_TAGS + '?txt=' + this.searchTxt)
        const reg = new RegExp(this.searchTxt, 'g')
        const replaceResult = '<strong>' + this.searchTxt + '</strong>'
        for (let i = 0; i < this.similarTags.length; i++) {
          const val = this.similarTags[i]
          this.similarTags[i] = val.replace(reg, replaceResult)
          this.activeSimilarItem = 0
        }
      },
      remove(index) {
        this.readyTags.splice(index, 1)
      },
      focusTag(finish) {
        let tags = [], status = true
        if (this.readyTags.length > 0) {
          tags = this.readyTags
          this.readyTags = []
        } else {
          return
        }
        this.$axios.$post(POST_CHECK_FOCUS_TAG, {tags, status}).then(() => {
          tags.forEach(val => this.focusTags.push(val))
          finish()
        })
      }
    },
    mounted() {
      if (this.user) {
        this.$axios.$get(GET_CHECK_FOCUS_TAGS).then(res => {
          this.focusTags = res
        })
      }
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  @import "../assets/css/var";

  #Tags {
    padding-top: 30px;
    color: #333333;
    font-size: 1.4rem;

    h1 {
      font-size: 2.4rem;
      padding-bottom: 15px;
    }

    .tag-word {
      padding-bottom: 15px;
    }

    .my-tags {
      background-color: #F6F6F6;
      padding: 20px;

      .ready-tags {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        min-height: 20px;
        padding-bottom: 10px;

        .tag {
          margin-right: 5px;
        }

        .focus {
          padding: 0 10px;
          border: 1px solid #dddddd;
          border-radius: 4px;
          margin-left: 10px;

          &:hover {
            background-color: #eeeeee;
          }
        }
      }

      .search-tag {
        display: inline-block;
        margin-bottom: 10px;
        position: relative;

        input {
          width: 200px;
        }

        .popup {
          position: absolute;
          top: 105%;
          width: 200px;
          background-color: white;
          z-index: 100;

          li {
            padding: 3px 10px;
            box-sizing: border-box;
            cursor: pointer;
            color: #555555;

            &:hover {
              background-color: #dddddd;
            }

            strong {
              color: $green;
            }
          }

          .active {
            background-color: #dddddd;
          }
        }
      }

      .focused-tags {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .focused-tag {
          margin-right: 5px;
          background-color: cornsilk;
        }
      }
    }
  }
</style>
