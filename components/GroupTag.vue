<template>
  <nuxt-link id="GroupTag" :to="'/group?id='+groupId">{{txt}}</nuxt-link>
</template>

<script>
  export default {
    name: "GroupTag",
    props: {
      txt: {
        type: String,
        required: true
      },
      groupId: {
        type: Number,
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
  #GroupTag {
    color: #8b572a;
    font-size: 1.3rem;
    background-color: #F2EBE5;
    padding: 3px 5px;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      background-color: #8b572a;
      color: #ffffff;
      text-decoration: none;
    }
  }
</style>
