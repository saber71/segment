<template>
  <div id="UserAuthentication">
    <img src="/icon/authentication.png">
    <section ref="popup" class="popup" :style="{left}">{{text}}</section>
  </div>
</template>

<script>
  export default {
    name: "UserAuthentication",
    props: {
      text: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        left: 0
      }
    },
    watch: {},
    computed: {},
    methods: {},
    mounted() {
      const popup = this.$refs.popup
      const width = popup.getBoundingClientRect().width / -2 + 5
      this.left = width + 'px'
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  #UserAuthentication {
    position: relative;
    font-size: 1.4rem;

    img {
      width: 13px;
      height: 12px;
    }

    .popup {
      position: absolute;
      bottom: 0;
      transform: translateY(-20px);
      width: fit-content;
      white-space: nowrap;
      padding: 5px 10px;
      background-color: black;
      border-radius: 5px;
      color: white;
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 100;

      &:before {
        content: '';
        position: absolute;
        left: calc(50% - 3px);
        top: 100%;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top-color: black;
      }
    }

    &:hover {
      .popup {
        opacity: 1;
      }
    }
  }
</style>
