<template>
  <div id="SelectTags" tabindex="1" @focusin="focus=true" @focusout="focus=false">
    <error-tip-input placeholder="请输入标签名字" ref="inputRef" v-model="searchTxt" :max-length="40"
                     @change="onInput"
                     :validate="validate" :disabled="selectedArray.length>=maxNum"></error-tip-input>
    <ul class="tags">
      <li v-for="(val,index) in  selectedArray">
        <Tag :tag="val" :close="true" @close="removeTag(index)"></Tag>
      </li>
    </ul>
    <ul class="popup border-shadow" v-show="searchedTags.length>0&&searchTxt.length>0">
      <li v-for="(val) in searchedTags" v-html="getHtml(val)" @click="select(val)"></li>
    </ul>
  </div>
</template>

<script>
  import Tag from "./Tag";
  import {GET_SIMILAR_TAGS} from "../assets/js/api";
  import ErrorTipInput from "./ErrorTipInput";

  export default {
    name: "SelectTags",
    components: {ErrorTipInput, Tag},
    props: {
      selectedArray: {
        type: Array,
        required: true
      },
      maxNum: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        searchTxt: '',
        searchedTags: [],
        focus: false
      }
    },
    watch: {},
    computed: {},
    methods: {
      onInput(val) {
        this.searchTxt = val
        this.fetchTags()
      },
      getHtml(val) {
        const reg = new RegExp(this.searchTxt, 'g')
        return val.replace(reg, `<strong class="strong">${this.searchTxt}</strong>`)
      },
      select(val) {
        this.searchTxt = ''
        this.searchedTags = []
        this.$emit('select', val)
      },
      removeTag(index) {
        this.$emit('remove', index)
      },
      fetchTags() {
        if (this.searchTxt === '') {
          return
        }
        this.$axios.$get(GET_SIMILAR_TAGS + '?txt=' + this.searchTxt).then(res => {
          this.searchedTags = res
        })
      },
      validate() {
        return this.selectedArray.length > 0
      }
    },
    mounted() {
    },
    created() {
      this.$on('validate', () => {
        this.$refs.inputRef.$emit('validate')
      })
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #SelectTags {
    position: relative;

    .tags {
      padding: 5px 0;

      li {
        display: inline-block;
        margin-right: 5px;
      }
    }

    .popup {
      position: absolute;
      top: 40px;
      width: 100%;
      max-width: 300px;
      background-color: white;
      z-index: 100000;
      font-size: 1.3rem;
      color: #666666;

      li {
        padding: 5px 20px;
        box-sizing: border-box;
        cursor: pointer;


        &:hover {
          background-color: #dddddd;
        }
      }

      .strong {
        color: red;
        font-weight: bold;
      }
    }
  }
</style>
