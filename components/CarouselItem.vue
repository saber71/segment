<template>
  <div id="CarouselItem">
    <slot></slot>
  </div>
</template>

<script>

  export default {
    name: "CarouselItem",
    props: {},
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
  #CarouselItem {
    width: 100%;
    flex-shrink: 0;
    transition: all 0.5s ease;
  }
</style>
