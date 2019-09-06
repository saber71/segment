<template>
  <ul id="RPBoard">
    <li v-for="(val,index) in array.slice(startIndex,startIndex+size)" class="item">
      <div class="left-rp">
        <span class="count">{{startIndex+index+1}}.</span>
        <div class="avatar">
          <img :src="val.avatar">
        </div>
        <nuxt-link :to="'/user?id='+val.userId">{{val.username}}</nuxt-link>
      </div>
      <div class="right-rp">
        <img class="icon" src="/icon/rp.PNG" v-show="showIcon">
        <span>{{sign?'+':''}}{{val.rp}}</span>
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
      size: {
        type: Number,
        default: 10
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      array: {
        type: Array,
        required: true
      },
      sign: {
        type: Boolean,
        default: true
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
        width: 70%;
      }

      .count {
        font-size: 1.3rem;
        color: #777777;
        margin-right: 5px;
        min-width: 20px;
        text-align: right;
      }

      .avatar {
        min-width: 24px;
        max-width: 24px;
        min-height: 24px;
        max-height: 24px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 10px;
      }

      a {
        display: inline-block;
        font-weight: bold;
        color: $green;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &:hover {
          color: $darker-green;
        }
      }
    }

    .right-rp {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-grow: 1;

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
