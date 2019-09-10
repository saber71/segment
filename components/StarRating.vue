<template>
  <div id="StarRating">
    <img class="yellow" :style="style" src="/icon/star-yellow.png" v-for="val in rating">
    <img class="gray" :style="style" src="/icon/star-gray.png" v-for="val in (maxRating-rating)">
  </div>
</template>

<script>
  export default {
    name: "StarRating",
    props: {
      rating: {
        type: Number,
        required: true
      },
      maxRating: {
        type: Number,
        default: 5
      },
      starSize: {
        type: String | Number,
        default: 16
      }
    },
    data() {
      return {
        style: {
          width: '',
          height: ''
        }
      }
    },
    watch: {},
    computed: {},
    methods: {},
    created() {
      this.style.width = this.starSize + 'px'
      this.style.height = this.starSize + 'px'
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  #StarRating {
    display: inline-flex;
    align-items: center;

    img {
      margin-right: 5px;
    }
  }
</style>
