<template>
  <div id="create-event" class="default-container default-content-layout">
    <section class="left-part">
      <breadcrumb :router="breadcrumbData"></breadcrumb>
      <section class="form">
        <h1 id="1" class="banner">活动信息</h1>
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
            <error-tip-input ref="joinHref" warn-msg="无效的网址" v-model="joinHref" :max-length="64" :validate="validateHref" placeholder="请输入报名网址"></error-tip-input>
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
          <section class="row">
            <editor ref="editor" v-model="content" placeholder="输入活动的详细介绍"
                    :save="save" :toolbars="toolbars"></editor>
          </section>
        </section>
        <h1 id="2" class="banner banner2">主办方、嘉宾信息</h1>
        <section class="body">
          <section class="row master-names" v-for="(val,index) in masterNameCount">
            <section class="row name">
              <h2 class="must-input">主办方名称</h2>
              <error-tip-input :ref="'masterName'+index" :key="'masterName'+index" placeholder="请输入主办方名称" v-model="masterNameArray[index]" :validate="commonValidate"
                               :max-length="20"></error-tip-input>
            </section>
            <section class="row href">
              <h2 class="not-must-input">主办方网址</h2>
              <error-tip-input :ref="'masterHref'+index" :key="'masterHref'+index" v-model="masterHrefArray[index]" placeholder="请输入主办方的网址" :validate="validateHref"
                               :max-length="64" warn-msg="无效的网址"></error-tip-input>
            </section>
            <button title="删除" @click="removeMaster(index)">
              <img src="/icon/remove.svg">
            </button>
          </section>
          <section class="row add-master">
            <button @click="addMaster">添加主办方</button>
          </section>
          <section class="row helper-names" v-for="(val,index) in helperNameCount">
            <section class="row name">
              <h2 class="not-must-input">协办方名称</h2>
              <error-tip-input :ref="'helperName'+index" placeholder="请输入协办方名称" v-model="helperNameArray[index]" :validate="commonValidate" :max-length="20"></error-tip-input>
            </section>
            <section class="row href">
              <h2 class="not-must-input">协办方网址</h2>
              <error-tip-input :ref="'helperHref'+index" v-model="helperHrefArray[index]" placeholder="请输入协办方的网址" :validate="validateHref" :max-length="64"
                               warn-msg="无效的网址"></error-tip-input>
            </section>
            <button title="删除" @click="removeHelper(index)">
              <img src="/icon/remove.svg">
            </button>
          </section>
          <section class="row add-helper">
            <button @click="addHelper">添加协办方</button>
          </section>
          <section class="row link-names" v-for="(val,index) in linkNameCount">
            <section class="row name">
              <h2 class="not-must-input">链接名称</h2>
              <error-tip-input :ref="'linkName'+index" placeholder="请输入链接名称" v-model="linkNameArray[index]" :validate="commonValidate" :max-length="20"></error-tip-input>
            </section>
            <section class="row href">
              <h2 class="not-must-input">链接网址</h2>
              <error-tip-input :ref="'linkHref'+index" v-model="linkHrefArray[index]" placeholder="请输入链接网址" :validate="validateHref" :max-length="64"
                               warn-msg="无效的网址"></error-tip-input>
            </section>
            <button title="删除" @click="removeLink(index)">
              <img src="/icon/remove.svg">
            </button>
          </section>
          <section class="row add-link">
            <button @click="addLink">添加相关链接</button>
          </section>
          <section class="two-cols">
            <section class="row left">
              <h2 class="must-input">你的名字</h2>
              <error-tip-input ref="yourName" v-model="yourName" placeholder="真实姓名" :validate="commonValidate" :max-length="20"></error-tip-input>
            </section>
            <section class="row right">
              <h2 class="must-input">Email</h2>
              <error-tip-input ref="email" v-model="yourEmail" placeholder="用于接收重要邮件" warn-msg="无效的邮箱" :validate="validateEmail" :max-length="64"></error-tip-input>
            </section>
          </section>
          <section class="two-cols">
            <section class="row left">
              <h2 class="must-input">手机号</h2>
              <error-tip-input ref="phone" v-model="yourPhone" warn-msg="无效的手机号" placeholder="方便我们能及时与你联系" :validate="validaNumber" :max-length="20"></error-tip-input>
            </section>
            <section class="row right">
              <h2 class="must-input">QQ/微信号</h2>
              <error-tip-input ref="qq" v-model="yourQQOrWeixin" warn-msg="无效的QQ/微信号" placeholder="QQ号，微信号" :validate="validaNumber" :max-length="64"></error-tip-input>
            </section>
          </section>
        </section>
        <div id="3" class="submit">
          <button @click="postEvent">提交活动</button>
        </div>
      </section>
    </section>
    <section class="right-part">
      <ul class="box">
        <li :class="{active:activeBoxIndex===0}" @click="activeBoxIndex=0">
          <a href="#1">活动信息</a>
        </li>
        <li :class="{active:activeBoxIndex===1}" @click="activeBoxIndex=1">
          <a href="#2">主办方、嘉宾信息</a>
        </li>
        <li :class="{active:activeBoxIndex===2}" @click="activeBoxIndex=2">
          <a href="#3">提交</a>
        </li>
      </ul>
    </section>
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
  import {eventBus, ON_DEFAULT_LAYOUT_SCROLL} from "../assets/js/event-bus";

  export default {
    name: "create-event",
    components: {MButton, Breadcrumb, Editor, InputDatetime, SelectTags, ErrorTipInput},
    props: {},
    head() {
      return {title: '提交活动 -  SegmentFault 思否'}
    },
    data() {
      return {
        activeBoxIndex: 0,
        onScroll: undefined,
        breadcrumbData: [
          {
            text: '活动',
            href: '/events'
          }, {
            text: '提交活动'
          }
        ],
        eventName: 'dsa',
        tags: ['dsa'],
        type: '黑客马拉松',
        img: undefined,
        eventStartDatetime: '',
        eventEndDatetime: '',
        startJoinDatetime: '',
        endJoinDatetime: '',
        joinHref: 'https://www.abcn123.com',
        city: "ds",
        address: 'dsa',
        content: 'dsad',
        masterNameCount: 1,
        helperNameCount: 0,
        linkNameCount: 0,
        masterNameArray: [''],
        helperNameArray: [],
        masterHrefArray: [''],
        helperHrefArray: [],
        linkNameArray: [],
        linkHrefArray: [],
        yourName: '',
        yourEmail: '',
        yourPhone: '',
        yourQQOrWeixin: '',
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
      validateEmail(val) {
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)
      },
      validaNumber(val) {
        return /^[0-9]{6,13}$/.test(val)
      },
      addMaster() {
        this.masterNameCount++
        this.masterNameArray.push('')
        this.masterHrefArray.push('')
      },
      addHelper() {
        this.helperNameCount++
        this.helperNameArray.push('')
        this.helperHrefArray.push('')
      },
      addLink() {
        this.linkNameCount++
        this.linkNameArray.push('')
        this.linkHrefArray.push('')
      },
      removeMaster(index) {
        if (this.masterNameCount <= 1) {
          return
        }
        this.masterNameCount--
        this.masterNameArray.splice(index, 1)
        this.masterHrefArray.splice(index, 1)
      },
      removeHelper(index) {
        this.helperNameCount--
        this.helperNameArray.splice(index, 1)
        this.helperHrefArray.splice(index, 1)
      },
      removeLink(index) {
        this.linkNameCount--
        this.linkNameArray.splice(index, 1)
        this.linkHrefArray.splice(index, 1)
      },
      commonValidate(val) {
        return val && val.length > 0
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
        this.$store.commit('setFormInputValidate', this.img !== null && this.img !== undefined)
        this.$store.commit('setFormInputValidate', this.content.length > 0)
        const refNameArray = ['nameRef', 'tagsRef', 'city', 'address', 'joinHref', 'qq', 'phone', 'email', 'yourName']
        for (let i = 0; i < this.masterNameCount; i++) {
          refNameArray.push('masterName' + i)
          refNameArray.push('masterHref' + i)
        }
        for (let i = 0; i < this.helperNameCount; i++) {
          refNameArray.push('helperName' + i)
          refNameArray.push('helperHref' + i)
        }
        for (let i = 0; i < this.linkNameCount; i++) {
          refNameArray.push('linkName' + i)
          refNameArray.push('linkHref' + i)
        }
        refNameArray.forEach(val => {
          const ref = this.$refs[val]
          if (ref instanceof Array) {
            ref.forEach(v => v.$emit('validate'))
            return
          }
          ref.$emit('validate')
        })
      },
      validateHref(val) {
        return val && val.length > 0 && /^https?:\/\/(www\.)?([a-zA-Z0-9])+\.([a-z]){1,3}\/?$/.test(val)
      },
      save(finish) {
        this.$axios.$post(POST_CHECK_EVENT, {
          city: this.city, address: this.address, name: this.eventName, type: this.type,
          eventStartDatetime: this.eventStartDatetime, eventEndDatetime: this.eventEndDatetime,
          endJoinDatetime: this.endJoinDatetime, startJoinDatetime: this.startJoinDatetime,
          masterNameArray: this.masterNameArray, masterHrefArray: this.masterHrefArray,
          helperNameArray: this.helperNameArray, helperHrefArray: this.helperHrefArray,
          linkNameArray: this.linkNameArray, linkHrefArray: this.linkNameArray,
          yourName: this.yourName, email: this.yourEmail, phone: this.yourPhone, qq: this.yourQQOrWeixin
        }).then(() => {
          alert('提交成功')
          finish()
          this.$router.push({path: '/events'})
        })
      },
      postEvent() {
        this.validateForm()
        if (this.$store.state.formInputValidate) {
          this.$refs.editor.$emit('save')
        }
      },
    },
    mounted() {
      const h2 = document.getElementById('2')
      const h3 = document.getElementById('3')
      const el = document.getElementById('create-event')
      const elOffsetTop = el.offsetTop
      const h2OffsetTop = h2.offsetTop - elOffsetTop + 100
      const h3OffsetTop = h3.offsetTop - elOffsetTop
      this.onScroll = (toTop) => {
        if (toTop > h2OffsetTop && h3OffsetTop + window.innerHeight > toTop) {
          this.activeBoxIndex = 2
        } else if (h2OffsetTop - toTop < window.innerHeight) {
          this.activeBoxIndex = 1
        } else {
          this.activeBoxIndex = 0
        }
      }
      eventBus.$on(ON_DEFAULT_LAYOUT_SCROLL, this.onScroll)
    },
    created() {
    },
    destroyed() {
      eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL, this.onScroll)
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

        .not-must-input {
          font-weight: bold;
          margin-bottom: 5px;

          &:after {
            background: none;
          }
        }

        .banner {
          background-color: #F5F5F5;
          padding: 5px $padding-side;
          font-size: 1.6rem;
          border-bottom: 1px solid #dddddd;
          box-sizing: border-box;
        }

        .banner2 {
          border-top: 1px solid #dddddd;
        }

        .body {
          padding-top: $padding-side;
          padding-bottom: $padding-side;
          box-sizing: border-box;

          .row {
            padding: 0 $padding-side 10px;
            box-sizing: border-box;
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

          .master-names, .helper-names, .link-names {
            display: flex;
            flex-wrap: wrap;

            button {
              width: 40px;
              height: 34px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #dddddd;
              border-radius: 4px;
              transform: translateY(25px);

              &:hover {
                background-color: #dddddd;
              }

              img {
                width: 20px;
                min-width: 20px;
                height: 20px;
                min-height: 20px;
              }
            }

            .name {
              width: 30%;
              padding-right: 10px;
              box-sizing: border-box;
              padding-left: 0;
            }

            .href {
              flex-grow: 1;
              padding-right: 20px;
              padding-left: 10px;
              box-sizing: border-box;
            }
          }

          .add-master, .add-helper, .add-link {
            border-bottom: 1px solid #dddddd;
            margin-bottom: 10px;

            button {
              color: $green;
              font-size: 1.4rem;

              &:hover {
                color: $darker-green;
              }
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

    .right-part {
      padding-top: 30px;
      @media(max-width: 768px) {
        display: none;
      }

      .box {
        border-radius: 3px;
        border: 1px solid #dddddd;
        border-bottom: none;
        position: sticky;
        top: 20px;

        li {
          font-size: 1.4rem;
          color: #333;
          border-bottom: 1px solid #dddddd;
          padding: 5px 10px;
          box-sizing: border-box;
          cursor: pointer;

          &:hover {
            background-color: #dddddd;
          }

          a {
            display: block;

            &:hover {
              text-decoration: none;
            }
          }
        }

        .active {
          background-color: $green;
          color: #ffffff;

          &:hover {
            background-color: $green;
          }
        }
      }
    }
  }
</style>
