<template>
  <div id="ErrorTipInput">
    <input class="common-input" v-model="inputTxt" :class="{error}" @input="onChange($event.target.value)"
           :maxlength="maxLength" :placeholder="placeholder" :disabled="disabled">
    <p class="warn" v-show="error">{{warnMsg}}</p>
  </div>
</template>

<script>
  export default {
    name: "ErrorTipInput",
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      maxLength: {
        type: Number,
        required: true
      },
      validate: {
        type: Function,
        required: true
      },
      placeholder: {
        type: String,
        default: '请输入信息'
      },
      value: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      warnMsg: {
        type: String,
        default: '不可为空'
      }
    },
    data() {
      return {
        error: false,
        inputTxt: ''
      }
    },
    watch: {},
    computed: {},
    methods: {
      onChange(val) {
        this.$emit('change', val)
        this.error = false
      }
    },
    mounted() {
      this.inputTxt = this.value
    },
    created() {
      this.$on('validate', () => {
        this.error = !this.validate(this.value)
        if (this.error) {
          this.$store.commit('setFormInputValidate', false)
        }
      })
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  #ErrorTipInput {
    .common-input {
      width: 100%;
      height: 34px;
    }

    .warn {
      font-size: 1.2rem;
      color: red;
      padding: 5px 0;
    }

    .error, .error:focus {
      box-shadow: 0 0 3px 1px red;
    }
  }
</style>
