<template>
  <nuxt-link id="Tag" :to="'/tag/'+tag" tag="div">
    <img :src="iconPath" v-if="iconPath">{{tag}}
  </nuxt-link>
</template>

<script>
  export default {
    name: "Tag",
    props: {
      tag: {
        type: String,
        required: true
      }
    },
    data() {
      return {}
    },
    watch: {},
    computed: {
      iconPath() {
        return this.$getTagIcon(this.tag)
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
    padding: 0 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 1px;

    img {
      width: 22px;
      height: 22px;
      margin-right: 5px;
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
