<template>
  <div id="Carousel">
    <div class="wrapper" :style="{transform:'translateX('+translateX+'px)',transition:transition}">
      <slot></slot>
    </div>
    <div class="swiper-pagination">
      <div class="bullet" v-for=" (val,index) in len"
           @click="next(index)"
           :class="{active:index===showIndex % len}"></div>
    </div>
  </div>
</template>

<script>
  import {CAROUSEL_NEXT, CAROUSEL_PREV} from "../assets/js/const";

  export default {
    name: "Carousel",
    props: {
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      },
      len: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        showIndex: 0,
        transition: 'all 0.5s linear',
        translateX: 0,
      }
    },
    watch: {},
    computed: {},
    methods: {
      animate(open) {
        if (open) {
          this.transition = 'all 0.5s linear'
        } else {
          this.transition = 'all 0s linear'
        }
      },
      translate(targetIndex) {
        this.translateX += (this.showIndex - targetIndex) * this.$el.offsetWidth
        this.showIndex = targetIndex
      },
      next(index) {
        const children = this.$children
        if (index === undefined || index === null) {
          if (this.showIndex + 1 < children.length) {
            this.translate(this.showIndex + 1)
          } else {
            this.animate(false)
            this.translate(1)
            setTimeout(() => {
              this.animate(true)
              this.translate(2)
              this.change(children.length)
            }, 50)
          }
        } else {
          if (this.showIndex + 2 >= children.length) {
            this.animate(false)
            this.translate(this.showIndex - children.length + 2)
            setTimeout(() => {
              this.animate(true)
              this.translate(index)
              this.change(children.length)
            }, 50)
          } else {
            this.translate(index)
          }
        }
        this.change(children.length)
      },
      prev() {
        const children = this.$children
        if (this.showIndex === 0) {
          this.animate(false)
          this.translate(children.length - 2)
          setTimeout(() => {
            this.animate(true)
            this.translate(this.showIndex - 1)
            this.change(children.length)
          }, 50)
        } else {
          this.translate(this.showIndex - 1)
        }
        this.change(children.length)
      },
      change(len) {
        this.$emit('change', this.showIndex % (len - 2))
      }
    },
    mounted() {
      if (this.autoPlay) {
        setInterval(() => {
          this.next()
        }, this.interval)
      }
      this.$on(CAROUSEL_NEXT, this.next)
      this.$on(CAROUSEL_PREV, this.prev)
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  #Carousel {
    width: 100%;
    overflow: hidden;
    position: relative;

    .wrapper {
      display: flex;
      flex-wrap: nowrap;
    }

    .swiper-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 10px;
      width: 100%;

      .bullet {
        background-color: transparent;
        width: 10px;
        height: 10px;
        border: 1px solid white;
        margin: 0 2px;
        cursor: pointer;
        border-radius: 50%;
      }

      .active {
        background-color: white;
        width: 12px;
        height: 12px;
      }
    }
  }
</style>
