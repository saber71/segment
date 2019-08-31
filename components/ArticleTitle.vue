<template>
  <div id="ArticleTitle">
    <h1>{{article .name}}</h1>
    <section class="info">
      <div class="tag" v-for="val in articl.tags">
        <tag :tag="val"></tag>
      </div>
      <span class="readNum">{{$formatNumber(article.readNum)}}次阅读</span>
    </section>
  </div>
</template>

<script>
  import Tag from "./Tag";

  export default {
    name: "ArticleTitle",
    components: {Tag},
    props: {
      article: {
        type: Object,
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
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/css/var';

  #ArticleTitle {

    h1 {
      font-size: 30px;
      line-height: 42px;
      margin-top: 15px;
      margin-bottom: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif;
    }

    .info {
      display: flex;
      align-items: center;

      .tag {
        margin-right: 5px;
      }

      .readNum {
        margin-left: 10px;
        color: #999;
      }
    }
  }
</style>
