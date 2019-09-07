<template>
  <div id="MultiLineText" :style="{'height':(lineNum*lineHeight)+'px'}">
    <p ref="ref" class="txt" :style="{'font-size':fontSize,'line-height':lineHeight+'px'}">
      {{txt}}
    </p>
    <div class="dot" v-show="show" :style="{'font-size':fontSize,'line-height':lineHeight+'px',background:'linear-gradient(to right, transparent, '+bgColor+' 50%)'}">...</div>
  </div>
</template>

<script>
  export default {
    name: "MultiLineText",
    props: {
      fontSize: {
        type: String,
        default: '14px'
      },
      lineHeight: {
        type: Number,
        default: '1'
      },
      lineNum: {
        type: Number,
        required: true
      },
      txt: {
        type: String,
        required: true
      },
      bgColor: {
        type: String,
        default: 'white'
      }
    },
    data() {
      return {
        show: false
      }
    },
    watch: {
      txt() {
        this.$nextTick(() => {
          this.flush()
        })
      }
    },
    computed: {},
    methods: {
      flush() {
        const ref = this.$refs.ref
        this.show = ref.getBoundingClientRect().height > this.lineHeight * this.lineNum
      }
    },
    mounted() {
      this.flush()
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  #MultiLineText {
    position: relative;
    overflow: hidden;

    .dot {
      position: absolute;
      bottom: 0;
      right: 0;
      padding-left: 10px;
    }
  }
</style>
