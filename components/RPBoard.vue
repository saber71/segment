<template>
  <ul id="RPBoard">
    <li v-for="(val,index) in array" class="item">
      <div class="left-rp">
        <span class="count">{{startIndex+index+1}}.</span>
        <div class="avatar">
          <img :src="val.avatar">
        </div>
        <nuxt-link :to="'/user?id='+val.userId">{{val.username}}</nuxt-link>
      </div>
      <div class="right-rp">
        <img class="icon" src="/icon/rp.PNG" v-show="showIcon">
        <span>+{{val.rp}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "RPBoard",
    props: {
      startIndex: {
        type: Number,
        default: 0
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      array: {
        type: Array,
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
  @import "../assets/css/var";

  #RPBoard {
    font-size: 1.4rem;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;

      .left-rp {
        display: flex;
        align-items: center;
      }

      .count {
        font-size: 1.3rem;
        color: #777777;
        margin-right: 5px;
        min-width: 20px;
        text-align: right;
      }

      .avatar {
        width: 24px;
        height: 24px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 10px;
      }

      a {
        font-weight: bold;
        color: $green;

        &:hover {
          color: $darker-green;
        }
      }
    }

    .right-rp {
      display: flex;
      align-items: center;

      .icon {
        width: 16px;
        height: 12px;
        margin-right: 5px;
      }

      span {
        color: #BF7158;
      }
    }

  }
</style>
