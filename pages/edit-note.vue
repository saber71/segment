<template>
  <div id="edit-note">
    <head-for-creator text="编辑笔记" :save="save" save-text="保存笔记"></head-for-creator>
    <section class="body">
      <section class="input-name">
        <input class="common-input border-shadow" v-model="name">
      </section>
      <editor v-model="content" :toolbars="toolbars"></editor>
    </section>
  </div>
</template>

<script>
  import Logo from "../components/Logo";
  import MButton from "../components/MButton";
  import {GET_CHECK_NOTE, POST_CHECK_COMMIT_NOTE} from "../assets/js/api";
  import Editor from "../components/Editor";
  import HeadForCreator from "../components/HeadForCreator";

  const base64 = require('js-base64').Base64
  export default {
    name: "edit-note",
    components: {HeadForCreator, Editor, MButton, Logo},
    layout: 'none',
    props: {},
    head() {
      return {title: '编辑笔记 - SegmentFault 思否'}
    },
    async asyncData({app, query}) {
      const noteId = query.id
      if (noteId) {
        const note = await app.$axios.$get(GET_CHECK_NOTE + '?id=' + noteId)
        return {content: base64.decode(note.content), noteId, name: note.name}
      }
      return {content: '', noteId, name: ''}
    },
    data() {
      return {
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
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: false, // 保存（触发events中的save事件）
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          preview: true, // 预览
        }
      }
    },
    watch: {},
    computed: {},
    methods: {
      save(finish) {
        this.$axios.$post(POST_CHECK_COMMIT_NOTE, {
          content: base64.encode(this.content),
          noteId: this.noteId
        }).then(() => {
          finish()
          alert('保存成功！！！')
        })
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

  #edit-note {
    background-color: #F2F2F2;
    min-height: 100%;

    .body {
      padding: 30px 20px;
      box-sizing: border-box;

      .common-input {
        width: 100%;
        font-size: 1.8rem;
        height: 46px;
      }

      .input-name {
        padding-bottom: 10px;
      }
    }
  }
</style>
