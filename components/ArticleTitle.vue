<template>
  <div id="ArticleTitle">
    <p class="title">{{article .name}}</p>
    <section class="info">
      <span class="original-article" v-if="article.original">原创</span>
      <span class="translate-article" v-if="article.translate">翻译</span>
      <div class="tag" v-for="val in article.tags">
        <Tag :tag="val"></Tag>
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
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/css/var';

  #ArticleTitle {

    .title {
      font-size: 30px;
      line-height: 42px;
      margin-top: 15px;
      margin-bottom: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif;
    }

    .info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .original-article, .translate-article {
        margin-right: 10px;
      }

      .tag {
        margin-right: 5px;
      }

      .readNum {
        margin-left: 10px;
        color: #999;
        font-size: 1.4rem;
      }
    }
  }
</style>
