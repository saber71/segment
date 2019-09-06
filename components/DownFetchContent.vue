<template>
  <div id="DownFetchContent">
    <slot></slot>
    <button class="loading-button" ref="loading-button" v-show="!end" @click="clickButton">
      <img src="/icon/loading-green.png">
      {{count>0?'加载中':'点击加载更多'}}
    </button>
  </div>
</template>

<script>
  import {eventBus, ON_DEFAULT_LAYOUT_SCROLL} from "../assets/js/event-bus";

  let fetching = false

  export default {
    name: "DownFetchContent",
    props: {
      fetch: {
        type: Function,//args(finish:Function)，当数据获取后调用
        required: true
      },
      end: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loadingButton: undefined,
        count: 1,
      }
    },
    watch: {},
    computed: {},
    methods: {
      clickButton() {
        if (this.count === 0) {
          this.count = 1
          this.fetchs()
        }
      },
      fetchs() {
        if (this.end) {
          return
        }
        if (fetching || this.count === 0) {
          return
        }
        fetching = true
        this.fetch(() => {
          fetching = false
          this.count++
          this.count %= 4
        })
      },
      onScroll(scrollTop) {
        const toTop = this.loadingButton.offsetTop
        const bias = Math.abs(toTop - scrollTop)
        // console.log(toTop + '  ' + bias + '  ' + scrollTop + '  ' + this.loadingButton.offsetHeight)
        if (bias <= window.innerHeight) {
          this.fetchs()
        }
        if (this.end) {
          eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL)
        }
      },
    },
    mounted() {
      this.loadingButton = this.$refs['loading-button']
      eventBus.$on(ON_DEFAULT_LAYOUT_SCROLL, this.onScroll)
    },
    created() {
    },
    destroyed() {
      eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL)
    }
  }
</script>

<style scoped lang="scss">
  #DownFetchContent {
    .loading-button {
      margin: 20px auto;
      font-size: 1.4rem;
      color: #212121;
      padding: 5px 10px;
      display: flex;
      align-items: center;
      border: 1px solid #dddddd;
      border-radius: 5px;

      img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
        animation: rotate 3s infinite linear;
        @keyframes rotate {
          from {
            transform: rotate(0);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }

      &:hover {
        background-color: #dddddd;
      }
    }
  }
</style>
