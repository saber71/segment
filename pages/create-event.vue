<template>
  <div id="create-event" class="default-container default-content-layout">
    <section class="left-part">
      <breadcrumb :router="breadcrumbData"></breadcrumb>
      <section class="form">
        <h1 class="banner">活动信息</h1>
        <section class="body">
          <section class="row">
            <h2 class="must-input">活动名称</h2>
            <error-tip-input ref="nameRef" v-model="eventName" placeholder="不超过64个字" :max-length="64"
                             :validate="commonValidate"></error-tip-input>
          </section>
          <section class="row">
            <h2 class="must-input">标签</h2>
            <select-tags ref="tagsRef" :selected-array="tags" @remove="removeTag" @select="selectTag"></select-tags>
          </section>
          <section class="row type">
            <h2 class="must-input">活动类型</h2><br/>
            <input id="type1" type="radio" name="type" v-model="type" value="黑客马拉松"><label for="type1">黑客马拉松</label>
            <input id="type2" type="radio" name="type" v-model="type" value="线上活动"><label for="type2">线上活动</label>
            <input id="type3" type="radio" name="type" v-model="type" value="线下活动"><label for="type3">线下活动</label>
          </section>
          <section class="row">
            <h2 class="must-input">活动海报</h2>
            <section class="img-part">
              <img class="left" :src="img">
              <section class="right">
                <input type="file" @change="onSelectFile($event)">
                <p>支持 jpg/jpeg/png 格式，大小不要超过 2MB<br/>
                  建议上传 1600*900 分辨率的图片</p>
              </section>
            </section>
          </section>
          <section class="two-cols">
            <section class="row left">
              <h2 class="must-input">活动开始时间</h2>
              <input-datetime v-model="eventStartDatetime"></input-datetime>
            </section>
            <section class="row right">
              <h2 class="must-input">活动结束时间</h2>
              <input-datetime v-model="eventEndDatetime"></input-datetime>
            </section>
          </section>
          <section class="two-cols">
            <section class="row left">
              <h2 class="must-input">报名开始时间</h2>
              <input-datetime v-model="startJoinDatetime"></input-datetime>
            </section>
            <section class="row right">
              <h2 class="must-input">报名结束时间</h2>
              <input-datetime v-model="endJoinDatetime"></input-datetime>
            </section>
          </section>
          <section class="row">
            <h2 class="must-input">报名方式</h2>
            <error-tip-input ref="joinHref" v-model="joinHref" :max-length="64" :validate="validateHref" placeholder="请输入报名网址"></error-tip-input>
          </section>
          <section class="address">
            <section class="row left-side">
              <h2 class="must-input">活动城市</h2>
              <error-tip-input ref="city" v-model="city" :max-length="10" placeholder="请输入城市" :validate="commonValidate"></error-tip-input>
            </section>
            <section class="row right-side">
              <h2 class="must-input">详细地址</h2>
              <error-tip-input ref="address" v-model="address" :max-length="64" placeholder="地址不超过64个字" :validate="commonValidate"></error-tip-input>
            </section>
          </section>
          <editor ref="editor" v-model="content" placeholder="输入活动的详细介绍"
                  :save="save" :toolbars="toolbars"></editor>
        </section>
        <div class="submit">
          <button @click="postEvent">提交活动</button>
        </div>
      </section>
    </section>
    <section class="right-part"></section>
  </div>
</template>

<script>
  import ErrorTipInput from "../components/ErrorTipInput";
  import SelectTags from "../components/SelectTags";
  import InputDatetime from "../components/InputDatetime";
  import Editor from "../components/Editor";
  import Breadcrumb from "../components/Breadcrumb";
  import {POST_CHECK_EVENT} from "../assets/js/api";
  import MButton from "../components/MButton";

  export default {
    name: "create-event",
    components: {MButton, Breadcrumb, Editor, InputDatetime, SelectTags, ErrorTipInput},
    props: {},
    head() {
      return {title: '提交活动 -  SegmentFault 思否'}
    },
    data() {
      return {
        breadcrumbData: [
          {
            text: '活动',
            href: '/events'
          }, {
            text: '提交活动'
          }
        ],
        eventName: '',
        tags: [],
        type: '黑客马拉松',
        img: undefined,
        eventStartDatetime: '',
        eventEndDatetime: '',
        startJoinDatetime: '',
        endJoinDatetime: '',
        joinHref: '',
        city: "",
        address: '',
        content: '',
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
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: false, // 保存（触发events中的save事件）
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
    watch: {},
    computed: {},
    methods: {
      commonValidate() {
        return this.eventName.length > 0
      },
      removeTag(index) {
        this.tags.splice(index, 1)
      },
      selectTag(val) {
        this.tags.push(val)
      },
      onSelectFile(event) {
        const file = event.target.files[0]
        if (/.jpg|jpeg|png$/.test(file.name.toLowerCase()) || file.size / 1024 / 1024 <= 2) {
          const setImage = img => this.img = img
          const fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = function () {
            setImage(this.result)
          }
          return
        }
        alert('图片必须是jpg/jpeg/png格式的，大小小于2MB')
      },
      validateForm() {
        this.$store.commit('setFormInputValidate', this.content.length > 0)
        const refNameArray = ['nameRef', 'tagsRef', 'right-side', 'city', 'address']
        refNameArray.forEach(val => this.$refs[val].$emit('validate'))
      },
      validateHref() {
        return this.joinHref.length > 0 && /^https?:\/\/(www\.)?([a-zA-Z])+\.([a-z]){1,3}\/?$/.test(this.joinHref)
      },
      save() {
        this.$axios.$post(POST_CHECK_EVENT, {
          city: this.city, address: this.address, name: this.eventName, type: this.type,
          eventStartDatetime: this.eventStartDatetime, eventEndDatetime: this.eventEndDatetime,
          endJoinDatetime: this.endJoinDatetime, startJoinDatetime: this.startJoinDatetime
        }).then(() => {
          alert('提交成功')
          this.$router.push({path: '/events'})
        })
      },
      postEvent() {
        this.validateForm()
        if (this.$store.state.formInputValidate) {
          this.$refs.editor.$emit('save')
        }
      }
    },
    mounted() {
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  $padding-side: 20px;

  #create-event {
    color: #333333;
    font-size: 1.4rem;
    padding-top: 30px;
    padding-bottom: 30px;

    .left-part {
      .form {
        border: 1px solid #dddddd;
        border-radius: 3px;
        margin-top: 10px;

        .must-input {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .banner {
          background-color: #F5F5F5;
          padding: 5px $padding-side;
          font-size: 1.6rem;
          border-bottom: 1px solid #dddddd;
          box-sizing: border-box;
        }

        .body {
          padding: $padding-side;
          box-sizing: border-box;

          .row {
            padding-bottom: 10px;
          }

          .type label {
            margin-left: 3px;
            margin-right: 10px;
            cursor: pointer;
          }

          .img-part {
            display: flex;
            align-items: center;

            .left {
              width: 240px;
              min-width: 240px;
              height: 135px;
              min-height: 135px;
              background-color: #dddddd;
              border: none;
            }

            .right {
              margin-left: 20px;

              input {
                margin-bottom: 5px;
              }

              p {
                font-size: 1.3rem;
                color: #737373;
                line-height: 1.6;
              }
            }
          }

          .two-cols {
            display: flex;

            .right {
              width: 50%;
              padding-left: 20px;
              box-sizing: border-box;
            }

            .left {
              width: 50%;
              padding-right: 20px;
              box-sizing: border-box;
            }
          }

          .address {
            display: flex;

            .left-side {
              width: 30%;
              padding-right: 10px;
              box-sizing: initial;
            }

            .right-side {
              flex-grow: 1;
              padding-left: 10px;
              box-sizing: initial;
            }
          }
        }

        .submit {
          display: flex;
          justify-content: flex-end;
          padding-right: 20px;
          box-sizing: border-box;
          padding-bottom: 20px;

          button {
            color: #ffffff;
            background-color: $green;
            border-radius: 5px;
            padding: 5px 10px;
            border: 1px solid #dddddd;
            font-size: 1.4rem;

            &:hover {
              background-color: $darker-green;
            }
          }
        }
      }
    }
  }
</style>
