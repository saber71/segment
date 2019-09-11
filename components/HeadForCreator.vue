<template>
  <div id="HeadForCreator">
    <div class="top-line"></div>
    <section class="top">
      <div class="logo">
        <logo></logo>
        <span>{{text}}</span>
      </div>
      <m-button class="button" :click="save">{{saveText}}</m-button>
    </section>
  </div>
</template>

<script>
  import Logo from "./Logo";
  import MButton from "./MButton";

  export default {
    name: "HeadForCreator",
    components: {MButton, Logo},
    props: {
      text: {
        type: String,
        required: true
      },
      save: {
        type: Function,//finish()
        required: true
      },
      saveText: {
        type: String,
        required: true
      }
    },
    data() {
      return {}
    },
    watch: {},
    computed: {},
    methods: {},
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

  #HeadForCreator {
    .top-line {
      height: 3px;
      background-color: $green;
    }

    .top {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.125);
      padding: 0 20px;
      box-sizing: border-box;
      background-color: #FAFAFA;
      border-bottom: 1px solid #dddddd;
      position: relative;
      z-index: 1;

      .logo {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        span {
          margin-left: 10px;
          font-size: 1.8rem;
          color: #666666;
        }
      }

      .button {
        color: #ffffff;
        background-color: $green;
        border-radius: 5px;
        font-size: 1.4rem;
        padding: 5px 10px;

        &:hover {
          background-color: $darker-green;
        }
      }
    }
  }
</style>
