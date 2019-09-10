<template>
  <div id="Tags" class="default-container">
    <h1>标签</h1>
    <p class="tag-word">标签不仅能组织和归类你的内容，还能关联相似的内容。正确的使用标签将让你的问题被更多人发现和解决。</p>
    <section class="my-tags">
      <div class="ready-tags">
        <tag class="tag" v-for="(val,index) in readyTags" :tag="val" :key="index" @close="remove" :close="true"></tag>
        <m-button class="focus" :click="focusTag" v-show="readyTags.length>0">关注</m-button>
      </div>
      <div class="search-tag" tabindex="1"
           @keypress.down="activeSimilarItemDown" @keypress.up="activeSimilarItemUp"
           @focusin="focusInput=true" @focusout="focusInput=false">
        <input class="common-input" v-model="searchTxt" @keypress.enter="clickSimilarTag(similarTags[activeSimilarItem])"
               @input="fetchSimilarTags" :disabled="readyTags.length===5" placeholder="添加关注的标签">
        <label>（左右拖动进行导航标签排序，取消关注即可移除）</label>
        <ul class="popup border-shadow" v-show="similarTags.length>0&&focusInput">
          <li v-for="(val,index) in similarTags" @click="clickSimilarTag(val)" v-html="val"
              @mouseenter="activeSimilarItem=index"
              :class="{active:activeSimilarItem===index}"></li>
        </ul>
      </div>
      <div class="focused-tags">
        <div class="focused-tag" v-for="(val,index) in focusTags" @dragover="onDragOver($event)"
             @dragleave="onDragLeave" @dragenter="onDragEnter(index,$event)">
          <tag v-show="val" :tag="val" :key="index" draggable="true" @dragstart.native="onDragStart(index,$event)" @dragend.native="onDragEnd($event)"></tag>
        </div>
      </div>
    </section>
    <h1 class="banner">常用标签
      <nuxt-link to="/all-tags">全部</nuxt-link>
    </h1>
    <section class="tags">
      <section class="group" v-for="val in tagGroups">
        <h3 class="group-name">{{val.name}}</h3>
        <section class="content-side">
          <tag class="content-tag" v-for="(tag,index) in val.has" :key="val.name+index" :tag="tag.name?tag.name:tag"></tag>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import {GET_CHECK_FOCUS_TAGS, GET_SIMILAR_TAGS, POST_CHECK_FOCUS_TAG} from "../assets/js/api";
  import Tag from "../components/Tag";
  import MButton from "../components/MButton";
  import {tagGroups} from "../assets/js/tags";

  export default {
    name: "Tags",
    components: {MButton, Tag},
    props: {},
    head() {
      return {
        title: '标签树 - SegmentFault 思否'
      }
    },
    data() {
      return {
        focusTags: [],
        readyTags: [],
        searchTxt: '',
        similarTags: [],
        focusInput: false,
        activeSimilarItem: 0,
        dragOverIndex: -1,
        backupFocusTags: [],
        tagGroups: []
      }
    },
    watch: {},
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      onDragEnd(event) {
        if (this.dragOverIndex >= 0) {
          this.focusTags[this.dragOverIndex] = event.dataTransfer.getData('tag')
        } else {
          Object.assign(this.focusTags, this.backupFocusTags)
        }
        this.$forceUpdate()
      },
      onDragLeave() {
        this.dragOverIndex = -1
      },
      onDragOver(event) {
        event.preventDefault()
      },
      onDragEnter(overIndex, event) {
        this.dragOverIndex = overIndex
        const startIndex = parseInt(event.dataTransfer.getData('start'))
        Object.assign(this.focusTags, this.backupFocusTags)
        const focusTags = this.focusTags
        const backupTags = this.backupFocusTags
        if (startIndex > overIndex) {
          for (let i = startIndex - 1; i >= overIndex; i--) {
            focusTags[i + 1] = backupTags[i]
          }
        } else {
          for (let i = startIndex + 1; i <= overIndex; i++) {
            focusTags[i - 1] = backupTags[i]
          }
        }
        focusTags[overIndex] = undefined
        this.$forceUpdate()
        event.preventDefault()
      },
      onDragStart(index, event) {
        const tag = this.focusTags[index]
        Object.assign(this.backupFocusTags, this.focusTags)
        this.focusTags[index] = undefined
        event.dataTransfer.setData('tag', tag)
        event.dataTransfer.setData('start', index)
        this.$forceUpdate()
      },
      setTagSize() {
        const focusedTags = document.getElementsByClassName('focused-tag')
        for (let i = 0; i < focusedTags.length; i++) {
          const tag = focusedTags.item(i)
          const width = tag.getBoundingClientRect().width
          const height = tag.getBoundingClientRect().height
          if (width > 0) {
            tag.style.minWidth = width + 'px'
          }
          if (height > 0) {
            tag.style.minHeight = height + 'px'
          }
        }
      },
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
    updated() {
      this.setTagSize()
    },
    mounted() {
      if (this.user) {
        this.$axios.$get(GET_CHECK_FOCUS_TAGS).then(res => {
          this.focusTags = res
        })
      }
      this.setTagSize()
      this.tagGroups = tagGroups
      this.$store.commit('setHomeActiveMenu', '')
    },
    created() {
    },
    beforeDestroy() {
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
          margin-bottom: 5px;
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

        label {
          color: #777777;
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
        min-height: 20px;

        .focused-tag {
          margin-right: 5px;
          margin-bottom: 5px;
          background-color: cornsilk;
        }
      }
    }

    .banner {
      font-size: 1.8rem;
      font-weight: normal;
      padding: 30px 0;
      line-height: 1;

      a {
        color: $green;
        font-size: 1.4rem;
        margin-left: 10px;

        &:hover {
          color: $darker-green;
        }
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;

      .group {
        width: 25%;
        padding-right: 10px;
        box-sizing: border-box;
        padding-bottom: 20px;
        @media(max-width: 768px) {
          width: 100%;
        }

        .group-name {
          font-weight: bold;
          padding-bottom: 5px;
          border-bottom: 1px solid #dddddd;
        }

        .content-side {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding-top: 20px;

          .content-tag {
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
</style>
