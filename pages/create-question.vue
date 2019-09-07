<template>
  <div id="create-question">
    <div class="top-line"></div>
    <section class="top">
      <div class="logo">
        <img class="icon" src="logo.svg" @mouseenter="showlogoTip=true" @mouseleave="showlogoTip=false">提问
        <img class="tooltip" src="logo-tooltip.png" v-show="showlogoTip">
      </div>
      <m-button class="button" :click="postQuestion">发布问题</m-button>
    </section>
    <section class="body">
      <div class="name">
        <input class="common-input" v-model="name" placeholder="标题：一句话说清问题，用问号结尾">
      </div>
      <div class="tags" tabindex="1" @focusin="focusTag=true" @focusout="focusTag=false">
        <input class="common-input" placeholder="标签（最多5个）" v-model="tag" @input="fetchSearchTags"
               :disabled="selectedTags.length>=5">
        <div class="selected-tags">
          <Tag class="tag" :close="true" @close="closeTag" :param="index" :tag="val"
               v-for="(val,index) in selectedTags" :key="index"></Tag>
        </div>
        <ul class="search-popup border-shadow" v-show="tag!==''&&focusTag">
          <li class="item" v-for="(val,index) in searchTags" v-html="val" @click="selectItem(index)"></li>
          <li class="create-tag" v-show="searchTags.length===0" @click="createTag">
            创建新标签：<strong>{{tag}}</strong>
          </li>
        </ul>
        <section class="hot-tag-popup border-shadow" v-show="tag===''&&focusTag">
          <p class="labels">
            <label v-for="(val,index) in hotTags" @click="hotTagsIndex=index"
                   :class="{active:index===hotTagsIndex}">{{val.name}}</label>
          </p>
          <div class="tag-list">
            <div class="tag" v-for="val in hotTags[hotTagsIndex].has"
                 @click="selectHotTag(getTagName(val))">
              <Tag :tag="getTagName(val)"></Tag>
            </div>
          </div>
        </section>
      </div>
      <mavon-editor v-model="content" @save="postQuestion" :toolbars="toolbars"
                    :subfield="subfield" defaultOpen="edit"></mavon-editor>
    </section>
  </div>
</template>

<script>
  import {GET_SIMILAR_TAGS, POST_CHECK_CREATE_QUESTION} from "../assets/js/api";
  import MButton from "../components/MButton";
  import Tag from "../components/Tag";
  import {tagGroups} from "../assets/js/tags";

  export default {
    name: "create-question",
    components: {Tag, MButton},
    layout: 'none',
    props: {},
    head() {
      return {title: '提出问题 - SegmentFault 思否'}
    },
    data() {
      return {
        showlogoTip: false,
        focusTag: false,
        content: '',
        name: '',
        tag: '',
        searchTags: [],
        selectedTags: [],
        backupSearchTags: [],
        hotTags: tagGroups,
        hotTagsIndex: 0,
        subfield: true,
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: false, // 图片链接
          code: true, // code
          table: true, // 表格
          readmodel: true, // 沉浸式阅读
          help: true, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          preview: true, // 预览
        }
      }
    },
    watch: {},
    computed: {},
    methods: {
      postQuestion(finish) {
        if (this.content === '' || this.name === '' || this.selectedTags.length === 0) {
          return
        }
        const base64 = require('js-base64').Base64
        const txt = base64.encode(this.content)
        this.$axios.$post(POST_CHECK_CREATE_QUESTION, {
          content: txt, name: this.name, tags: this.selectedTags
        }).then(() => {
          if (finish) {
            finish()
          }
          alert('问题提交成功！！！')
          this.$router.push({name: 'questions'})
        })
      },
      fetchSearchTags() {
        if (this.tag === '') {
          return
        }
        this.$axios.$get(GET_SIMILAR_TAGS + '?txt=' + this.tag).then(res => {
          Object.assign(this.backupSearchTags, res)
          const reg = new RegExp(this.tag, 'g')
          const result = `<strong>${this.tag}</strong>`
          for (let i = 0; i < res.length; i++) {
            const obj = res[i]
            res[i] = obj.replace(reg, result)
          }
          this.searchTags = res
        })
      },
      closeTag(index) {
        this.selectedTags.splice(index, 1)
      },
      selectItem(index) {
        this.tag = ''
        this.selectedTags.push(this.backupSearchTags[index])
        this.focusTag = false
      },
      createTag() {
        //todo 创建新标签
        alert('TODO 创建新标签')
      },
      getTagName(val) {
        if (typeof val === 'object') {
          return val.name
        }
        return val
      },
      selectHotTag(tag) {
        this.selectedTags.push(tag)
        this.focusTag = false
      },
    },
    mounted() {
      const resize = () => this.subfield = window.innerWidth > 765
      window.onresize = resize
      resize()
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #create-question {
    height: 100vh;
    overflow: hidden auto;

    .top-line {
      height: 3px;
      background-color: $green;
    }

    .top {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.125);
      padding: 0 20px;
      box-sizing: border-box;
      background-color: #FAFAFA;
      border-bottom: 1px solid #dddddd;
      position: relative;
      z-index: 1;

      .logo {
        position: relative;
        font-size: 1.8rem;
        color: #666666;

        .icon {
          display: inline-block;
          width: 150px;
          height: 40px;
          margin-right: 10px;
        }

        .tooltip {
          width: 140px;
          position: absolute;
          left: 20px;
          top: 40px;
        }
      }

      .button {
        color: #ffffff;
        background-color: $green;
        border-radius: 5px;
        font-size: 1.4rem;
        padding: 5px 10px;

        &:hover {
          background-color: $darker-green;
        }
      }
    }

    .body {
      background-color: #F3F3F3;
      box-sizing: border-box;
      padding: 20px 20px 30px;
      min-height: calc(100vh - 64px);

      .common-input {
        width: 100%;
      }

      .name {
        padding-bottom: 20px;

        .common-input {
          font-size: 1.8rem;
          line-height: 50px;
          height: 50px;
        }
      }

      .tags {
        position: relative;

        .common-input {
          margin-bottom: 10px;
        }

        .search-popup {
          position: absolute;
          left: 0;
          top: 40px;
          width: 100%;
          max-width: 300px;
          background-color: white;
          z-index: 10000;

          .item, .create-tag {
            padding: 2px 20px;
            box-sizing: border-box;
            cursor: pointer;
            font-size: 1.4rem;
            color: #666666;

            strong {
              color: #000;
            }

            &:hover {
              background-color: #dddddd;
            }
          }
        }

        .selected-tags {
          min-height: 25px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 10px;

          .tag {
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }

        .hot-tag-popup {
          z-index: 10000;
          position: absolute;
          top: 40px;
          width: 100%;
          max-width: 500px;
          padding: 20px;
          box-sizing: border-box;
          background-color: white;

          .labels {
            padding-bottom: 10px;

            label {
              display: inline-block;
              color: #666666;
              font-size: 1.3rem;
              padding: 3px 10px;
              border-radius: 2px;
              cursor: pointer;
            }

            .active {
              color: white;
              background-color: $green;
            }
          }

          .tag-list {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .tag {
              margin-bottom: 5px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
</style>