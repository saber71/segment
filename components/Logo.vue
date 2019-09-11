<template>
  <div id="Logo" @mouseenter="showImg2=true" @mouseleave="showImg2=false">
    <img class="img1" src="/logo.svg">
    <img class="img2" src="/logo-tooltip.png" v-show="showImg2">
  </div>
</template>

<script>
  export default {
    name: "Logo",
    props: {},
    data() {
      return {
        showImg2: false
      }
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
  #Logo {
    position: relative;
    width: 150px;
    min-width: 150px;
    cursor: pointer;

    .img2 {
      position: absolute;
      right: -10px;
      top: 100%;
      width: 146px;
      z-index: 100;
    }
  }
</style>
