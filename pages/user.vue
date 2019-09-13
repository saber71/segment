<template>
  <div id="user">
  </div>
</template>

<script>
  export default {
    name: "user",
    props: {},
    async asyncData({redirect}) {
      redirect('/')
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
  #user {

  }
</style>
