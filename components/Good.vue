<template>
  <div id="Good" :class="{active:good}" @click="onClick">
    <section class="top"></section>
    <section class="bottom">{{$formatNumber(number)}}</section>
  </div>
</template>

<script>
  export default {
    name: "Good",
    props: {
      click: {
        type: Function,
        required: true
      },
      good: {
        type: Boolean,
        required: true
      },
      param: {
        default: null
      },
      number: {
        type: Number,
        required: true
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
        if (this.awaiting) {
          return
        }
        this.awaiting = true
        const finish = () => {
          this.awaiting = false
        }
        this.click(finish, this.param)
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

  #Good {
    border-radius: 3px;
    border: 1px solid #eee;
    font-size: 1.6rem;
    margin-bottom: 10px;
    min-width: 50px;
    cursor: pointer;
    height: fit-content;

    .top {
      display: flex;
      align-items: center;
      justify-content: center;

      &:before {
        content: '';
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-bottom-color: #333333;
      }
    }

    .bottom {
      padding: 5px 10px;
      box-sizing: border-box;
      text-align: center;
    }

    &:hover {
      color: $green;
      background-color: #eee;
      border-color: #adadad;

      .top {
        &:before {
          border-bottom-color: $green;
        }
      }
    }

    @media(max-width: 550px) {
      font-size: 1.4rem;
    }
  }

  .active {
    background-color: #e6e6e6;
    color: #333;
    border-color: #adadad;
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);

    &:hover {
      color: #333;
      background-color: #e6e6e6;
    }
  }
</style>
