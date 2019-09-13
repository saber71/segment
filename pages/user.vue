<template>
  <div id="user">
    <div class="top default-container">
      <div class="left-side">
        <img class="avatar" :src="userData.avatar">
        <div class="info">
          <h2>{{userData.name}}</h2>
          <h3>
            <img src="/icon/rp.png">{{userData.rp}} 声望
          </h3>
          <p>城市：{{userData.city}}</p>
          <p>毕业于：{{userData.school}} | {{userData.area}}</p>
          <p>个人主页：<a :href="userData.homeLink">{{userData.homeLink}}</a></p>
          <p>简介：{{userData.description}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {GET_USER_SPACE_DATA} from "../assets/js/api";

  export default {
    name: "user",
    props: {},
    head() {
      return {title: this.userData.name + ' - SegmentFault 思否'}
    },
    async asyncData({app, query}) {
      const id = query.id
      const userData = await app.$axios.$get(GET_USER_SPACE_DATA)
      return {userId: id, userData}
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
  @import "../assets/css/var";

  #user {
    background-color: #F6F6F6;
    padding-top: 30px;
    padding-bottom: 30px;

    .top {
      display: flex;
      align-items: center;

      .left-side {
        flex-grow: 1;
        display: flex;

        .avatar {
          min-width: 160px;
          max-width: 160px;
          min-height: 160px;
          max-height: 160px;
          border-radius: 50%;
          overflow: hidden;
          @media(max-width: 550px) {
            min-width: 40px;
            max-width: 40px;
            min-height: 40px;
            max-height: 40px;
          }
        }

        .info {
          flex-grow: 1;
          color: #333333;
          padding-left: 20px;
          box-sizing: border-box;

          h2 {
            font-size: 3rem;
            padding-bottom: 10px;
            @media(max-width: 550px) {
              font-size: 2rem;
            }
          }

          h3 {
            font-size: 2.4rem;
            padding-bottom: 10px;
            @media(max-width: 550px) {
              font-size: 1.8rem;
            }

            img {
              width: 16px;
              height: 16px;
              margin-right: 10px;
              display: inline-block;
            }
          }

          p {
            font-size: 1.4rem;
            padding-bottom: 5px;

            a {
              color: $green;

              &:hover {
                color: $darker-green;
              }
            }
          }
        }
      }
    }
  }
</style>
