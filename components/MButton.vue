<template>
  <button id="MButton" @click="onClick">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: "MButton",
    props: {
      awaitFinish: {
        type: Boolean,
        default: true
      },
      callback: {
        type: Function,
        required: true
      },
      param: {
        default: null
      }
    },
    data() {
      return {
        awaiting: false
      }
    },
    watch: {},
    computed: {},
    methods: {
      onClick() {
        if (this.awaitFinish && this.awaiting) {
          return
        }
        this.awaiting = true
        const finish = () => this.awaiting = false
        if (this.param) {
          this.callback(this.param, finish)
        } else {
          this.callback(finish)
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

</style>
