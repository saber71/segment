<template>
  <div id="Tag">
    <img :src="iconPath" v-if="iconPath">{{tag}}
  </div>
</template>

<script>
  export default {
    name: "Tag",
    props: {
      tag: {
        type: string,
        required: true
      }
    },
    data() {
      return {}
    },
    watch: {},
    computed: {
      iconPath() {
        return this.$getTagIcon(tag)
      }
    },
    methods: {},
    mounted() {
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  #Tag {
    font-size: 13px;
    color: #017E66;
    background-color: rgba(1, 126, 102, 0.08);
    padding: 5px;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }

    &:hover {
      background-color: #017E66;
      color: white;

      img {
        filter: brightness(0) invert(1);
      }
    }
  }
</style>
