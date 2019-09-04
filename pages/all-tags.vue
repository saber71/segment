<template>
  <div id="all-tags" class="default-container">
    <h1>标签</h1>
    <p class="tag-word">标签不仅能组织和归类你的内容，还能关联相似的内容。正确的使用标签将让你的问题被更多人发现和解决。</p>
    <section class="content">
      <section class="tag-data" v-for="val in tagDatas[page]">
        <section class="top" :class="{'focused-top':val.isFocus}">
          <h3 class="tag-name">
            <img :src="getIcon(val.name)" v-if="getIcon(val.name)">
            <nuxt-link :to="'/tag?name='+val.name">{{val.name}}</nuxt-link>
          </h3>
          <div class="description">
            <multi-line-text :txt="val.description" font-size="1.3rem" :bg-color="val.isFocus?'#FCF8E3':'white'"
                             :line-num="3" :line-height="20"></multi-line-text>
          </div>
        </section>
        <section class="bottom" :class="{'focused-bottom':val.isFocus}">
          <m-button class="button" :class="{'active-button':val.isFocus}" :click="focus" :param="val">{{val.isFocus?'已关注':'关注'}}</m-button>
          <strong>{{$formatNumber(val.focusNum)}}</strong>人
        </section>
      </section>
    </section>
    <pagination :page="page+1" :total="totalNum" @page-change="onPageChange"></pagination>
  </div>
</template>

<script>
  import Pagination from "../components/Pagination";
  import {GET_TAG_DATA_TOTAL_NUM, GET_TAG_DATAS, POST_CHECK_FOCUS_TAG} from "../assets/js/api";
  import {iconTags} from "../assets/js/tags";
  import MButton from "../components/MButton";
  import MultiLineText from "../components/MultiLineText";

  export default {
    name: "all-tags",
    components: {MultiLineText, MButton, Pagination},
    props: {},
    head() {
      return {
        title: '所有标签 - SegmentFault 思否'
      }
    },
    async asyncData({app}) {
      const totalNum = await app.$axios.$get(GET_TAG_DATA_TOTAL_NUM)
      return {totalNum}
    },
    data() {
      return {
        page: 0,
        size: 20,
        tagDatas: []
      }
    },
    watch: {},
    computed: {},
    methods: {
      focus(finish, tagData) {
        this.$axios.$post(POST_CHECK_FOCUS_TAG, {
          tags: [tagData.name],
          status: !tagData.isFocus
        }).then(() => {
          tagData.isFocus = !tagData.isFocus
          finish()
          this.$forceUpdate()
        })
      },
      getIcon(name) {
        return iconTags[name]
      },
      onPageChange(page) {
        this.page = page - 1
        if (this.tagDatas[this.page]) {
          return
        }
        this.$axios.$get(GET_TAG_DATAS, {
          params: {
            page: this.page,
            size: this.size
          }
        }).then(res => {
          this.tagDatas[this.page] = res
          this.$forceUpdate()
        })
      }
    },
    mounted() {
      this.onPageChange(1)
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #all-tags {
    padding-top: 30px;
    padding-bottom: 30px;

    h1 {
      font-size: 2.4rem;
      padding-bottom: 15px;
    }

    .tag-word {
      padding-bottom: 15px;
      font-size: 1.4rem;
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 30px;

      .tag-data {
        width: 25%;
        padding-right: 20px;
        margin-bottom: 20px;
        box-sizing: border-box;
        border-radius: 3px;
        @media(max-width: 992px) {
          width: 50%;
        }
        @media(max-width: 550px) {
          width: 100%;
          padding-right: 0;
        }

        .top {
          border: 1px solid #dddddd;
          border-bottom: none;

          .tag-name {
            display: flex;
            align-items: center;
            color: $green;
            font-size: 1.6rem;
            padding: 10px 10px 0;

            img {
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }

            a:hover {
              color: $darker-green;
            }
          }

          .description {
            padding: 20px 10px;
            box-sizing: border-box;
          }
        }

        .bottom {
          border: 1px solid #dddddd;
          border-top: none;
          background-color: #F6F6F6;
          padding: 10px;
          font-size: 1.3rem;
          color: #777777;
          box-sizing: border-box;

          .button {
            margin-right: 5px;
            color: #333333;
            border: 1px solid #dddddd;
            padding: 0 5px;
            border-radius: 4px;

            &:hover {
              background-color: #dddddd;
            }
          }

          strong {
            color: #333333;
            font-size: 1.4rem;
          }
        }

        .focused-top {
          background-color: #FCF8E3;
          border-color: #FCF8E3;
        }

        .focused-bottom {
          background-color: #FBF5D5;
          border-color: #FBF5D5;
        }
      }
    }
  }
</style>
