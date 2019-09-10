<template>
  <div id="Pagination">
    <button class="prev" @click="prev" v-show="page>1">上一页</button>
    <div class="dot" v-show="numbers[0]>1">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <button v-for="val in numbers" @click="emit(val)" :class="{'active':val===page}">{{val}}</button>
    <div class="dot" v-show="numbers[numbers.length-1]<totalPage">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <button class="next" @click="next" v-show="page<totalPage">下一页</button>
  </div>
</template>

<script>
  import MButton from "./MButton";

  export default {
    name: "Pagination",
    components: {MButton},
    props: {
      page: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      },
      size: {
        type: Number,
        default: 10
      }
    },
    data() {
      return {}
    },
    watch: {},
    computed: {
      totalPage() {
        const res = parseInt(this.total / this.size)
        if (res * this.size < this.total) {
          return res + 1
        }
        return res
      },
      numbers() {
        const res = []
        for (let i = -2; i < 3; i++) {
          const n = this.page + i
          if (n <= 0 || n > this.totalPage) {
            continue
          }
          res.push(n)
        }
        if (res.length < 5) {
          if (res[0] === 1 && res[res.length - 1] === this.totalPage) {
            return res
          } else if (res[0] === 1) {
            for (let i = res[res.length - 1] + 1; i <= this.totalPage && res.length < 5; i++) {
              res.push(i)
            }
          } else if (res[res.length - 1] === this.totalPage) {
            for (let i = res[0] - 1; i >= 1 && res.length < 5; i--) {
              res.unshift(i)
            }
          }
          return res
        } else {
          return res
        }
      }
    },
    methods: {
      emit(number) {
        this.$emit('page-change', number)
      },
      prev() {
        this.emit(this.page - 1)
      },
      next() {
        this.emit(this.page + 1)
      },
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

  #Pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    button {
      border: 1px solid #dddddd;
      border-left: none;
      color: $green;
      font-size: 1.4rem;
      padding: 10px 15px;
      @media(max-width: 550px) {
        font-size: 1.2rem;
        padding: 5px 10px;
      }

      &:hover {
        background-color: #dddddd;
        color: #333;
      }
    }

    button:nth-child(3), button:nth-child(2) {
      border-left: 1px solid #dddddd;
    }

    .prev {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      border-left: 1px solid #dddddd;
    }

    .next {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      border-left: 1px solid #dddddd;
    }

    .active {
      background-color: $green;
      color: white;

      &:hover {
        background-color: $green;
        color: white;
      }
    }

    .dot {
      margin: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      div {
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background-color: #333;
        margin: 0 2px;
      }
    }
  }
</style>
