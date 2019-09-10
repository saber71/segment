<template>
  <div id="RecommendLesson">
    <div class="top">
      <span>课程推荐</span>
      <div class="button-group">
        <div class="swiper-prev" @click="recommendLessonChange(-1)">
          <img src="/icon/arrow-down-white.png">
        </div>
        <div class="swiper-next" @click="recommendLessonChange(1)">
          <img src="/icon/arrow-down-white.png">
        </div>
      </div>
    </div>
    <carousel ref="recommendLessonCarousel" :len="recommendLesson.length" :interval="3000"
              v-if="recommendLesson">
      <carousel-item v-for="(val,index) in $readyForCarousel(recommendLesson)" :key="index">
        <div class="slide">
          <img :src="val.img">
          <p class="name">{{val.name}}</p>
          <div class="rating">
            <star-rating :rating="val.rank"></star-rating>
            <label class="number">({{val.join}}人参与)</label>
          </div>
          <div class="price">
            <label class="new">￥{{val.price}}</label>
            <label class="old" v-show="val.oldPrice">￥{{val.oldPrice}}</label>
          </div>
        </div>
      </carousel-item>
    </carousel>
  </div>
</template>

<script>
  import Carousel from "./Carousel";
  import CarouselItem from "./CarouselItem";
  import StarRating from "./StarRating";
  import {GET_RECOMMEND_LESSON} from "../assets/js/api";
  import {CAROUSEL_NEXT, CAROUSEL_PREV} from "../assets/js/const";

  export default {
    name: "RecommendLesson",
    components: {StarRating, CarouselItem, Carousel},
    props: {},
    data() {
      return {
        recommendLesson: []
      }
    },
    watch: {},
    computed: {},
    methods: {
      recommendLessonChange(bias) {
        if (bias > 0) {
          this.$refs.recommendLessonCarousel.$emit(CAROUSEL_NEXT)
        } else {
          this.$refs.recommendLessonCarousel.$emit(CAROUSEL_PREV)
        }
      },
    },
    mounted() {
    },
    async created() {
      this.recommendLesson = await this.$axios.$get(GET_RECOMMEND_LESSON)
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #RecommendLesson {
    padding: 15px 15px;
    box-sizing: border-box;
    background-color: #fafafa;
    border-radius: 1px;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding-bottom: 10px;
      color: $green;
      font-size: 1.6rem;
      font-weight: 500;

      .button-group {
        display: flex;
        align-items: center;

        .swiper-prev, .swiper-next {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: $green;
          padding: 2px;
          cursor: pointer;

          img {
            width: 10px;
            height: 10px;
            transform: rotate(90deg);
          }

          &:hover {
            background-color: $darker-green;
          }
        }

        .swiper-next {
          transform: rotate(180deg);
          margin-left: 5px;
        }
      }

    }

    .slide {
      width: 100%;

      img {
        min-width: 192px;
        min-height: 108px;
      }

      .name {
        color: black;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 1.4rem;
      }

      .rating {
        display: flex;
        align-items: center;
        margin-bottom: 5px;

        .number {
          font-size: 1.2rem;
          color: #999999;
        }
      }

      .price {
        .new {
          font-size: 1.4rem;
          font-weight: bold;
          color: red;
        }

        .old {
          font-size: 1.2rem;
          color: gray;
          text-decoration: line-through;
        }
      }
    }
  }
</style>
