<template>
  <div id="Editor">
    <mavon-editor ref="ref" v-model="content" :autofocus="autofocus" defaultOpen="defaultOpen" :toolbars="toolbars"
                  :subfield="subfield" :imageFilter="onImageFilter" @save="onSave" :editable="editable"
                  :placeholder="placeholder" :toolbarsFlag="toolbarsFlag"
                  @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
  </div>
</template>

<script>
  import {POST_CHECK_UPLOAD_IMAGE} from "../assets/js/api";

  export default {
    name: "Editor",
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      imageFilter: {
        type: Function,
        required: false
      },
      subfield: {
        type: Boolean,
        default: false
      },
      save: {
        type: Function,
        required: false
      },
      defaultOpen: {
        type: String,
        default: 'edit'
      },
      autofocus: {
        type: Boolean,
        default: false
      },
      toolbars: {
        type: Object,
        default: function () {
          return {
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
            imagelink: true, // 图片链接
            code: true, // code
            table: true, // 表格
            fullscreen: true, // 全屏编辑
            readmodel: true, // 沉浸式阅读
            /* 1.3.5 */
            undo: true, // 上一步
            redo: true, // 下一步
            trash: true, // 清空
            save: true, // 保存（触发events中的save事件）
            /* 1.4.2 */
            navigation: false, // 导航目录
            /* 2.1.8 */
            alignleft: true, // 左对齐
            aligncenter: true, // 居中
            alignright: true, // 右对齐
            /* 2.2.1 */
            preview: true, // 预览
          }
        }
      },
      placeholder: {
        type: String,
        default: '开始编辑，支持Markdown语法'
      },
      editable: {
        type: Boolean,
        default: true
      },
      toolbarsFlag: {
        type: Boolean,
        default: true
      },
      value: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        imgMap: {},
        awaiting: false,
        content: '',
        uploadedImageMap: {}
      }
    },
    watch: {
      content(val) {
        this.$emit('change', val)
      }
    },
    computed: {},
    methods: {
      onImageFilter(file) {
        if (this.imageFilter) {
          this.imageFilter(file)
          return
        }
        const name = file.name.toLowerCase()
        if (!/.(jpg|jpeg)$/.test(name)) {
          alert('图片必须为jpg格式，小于2Mb')
          return false
        }
        const size = file.size
        if (size / 1024 / 1024 <= 2) {
          return true
        }
        alert('图片必须为jpg格式，小于2Mb')
        return false
      },
      onSave() {
        if (this.awaiting) {
          return
        }
        this.awaiting = true
        this.uploadImage(() => {
          this.save(() => this.awaiting = true)
        })
      },
      imgAdd(pos, file) {
        this.imgMap[post] = file
      },
      imgDel(pos, file) {
        delete this.imgMap[pos]
      },
      uploadImage(callback) {
        if (Object.keys(this.imgMap).length === 0) {
          if (callback) {
            callback()
          }
          return
        }
        const form = new FormData()
        for (let name in this.imgMap) {
          form.append(name, this.imgMap[name])
        }
        this.$axios.$post(POST_CHECK_UPLOAD_IMAGE, form, {
          headers: {'Content-Type': 'multipart/form-data'}
        }).then((urls) => {
          const ref = this.$refs.ref
          for (let name in urls) {
            ref.$img2Url(name, urls[name])
            this.uploadedImageMap[name] = this.imgMap[name]
            delete this.imgMap[name]
          }
          if (callback) {
            callback()
          }
        })
      }
    },
    mounted() {
      this.content = this.value
      this.$on('save', this.onSave)
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  #Editor {

  }
</style>
