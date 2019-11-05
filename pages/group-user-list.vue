<template>
  <div id="group-user-list" class="default-content-layout default-container">
    <section class="left-part">
      <breadcrumb :router="router"></breadcrumb>
      <table>
        <tr>
          <th class="first">最近加入</th>
          <th class="second">主题数</th>
          <th class="three">回帖数</th>
          <th class="four">加入时间</th>
        </tr>
        <tr v-for="val in userList[page]">
          <td class="first">
            <img :src="val.avatar">
            <nuxt-link :to="'/user?id='+val.id">{{val.name}}</nuxt-link>
          </td>
          <td class="second">{{val.topicNum}}</td>
          <td class="three">{{val.replyNum}}</td>
          <td class="four">{{val.datetime}}</td>
        </tr>
      </table>
      <pagination :page="page+1" :total="total" @page-change="fetchUserList"></pagination>
    </section>
    <section class="right-part">
      <section class="search-box">
        <input class="common-input" v-model="inputTxt" @keypress.enter="searchUser">
        <m-button class="button" :click="searchUser">搜索</m-button>
      </section>
    </section>
  </div>
</template>

<script>
  import {GET_GROUP, GET_GROUP_USER, GET_GROUP_USER_SEARCH} from "../assets/js/api";
  import Breadcrumb from "../components/Breadcrumb";
  import Pagination from "../components/Pagination";
  import MButton from "../components/MButton";

  export default {
    name: "group-user-list",
    components: {MButton, Pagination, Breadcrumb},
    props: {},
    head() {
      return {title: '博客社区'}
    },
    async asyncData({app, query}) {
      const id = query.id, name = query.name
      const router = [
        {
          text: '圈子',
          href: '/groups'
        }, {
          text: name,
          href: '/group?id=' + id
        }, {
          text: '成员列表'
        }
      ]
      const group = await app.$axios.$get(GET_GROUP + '?id=' + id)
      return {router, id, total: group.focusNum}
    },
    data() {
      return {
        page: 0,
        size: 20,
        userList: [],
        inputTxt: ''
      }
    },
    watch: {},
    computed: {},
    methods: {
      fetchUserList(page) {
        this.page = page - 1
        if (this.userList[this.page]) {
          return
        }
        this.$axios.$get(GET_GROUP_USER, {
          params: {id: this.id, size: this.size, page: this.page}
        }).then(res => {
          this.userList[this.page] = res
          this.$forceUpdate()
        })
      },
      searchUser(finish) {
        this.page = 0
        if (this.inputTxt === '') {
          this.userList = []
          this.fetchUserList(1)
        } else {
          this.$axios.$get(GET_GROUP_USER_SEARCH, {
            params: {groupId: this.id, page: 0, size: this.size, txt: this.inputTxt}
          }).then(res => {
            this.inputTxt = ''
            this.total = res.total
            this.userList = []
            this.userList[0] = res.array
            finish()
            this.$forceUpdate()
          })
        }
      }
    },
    mounted() {
      this.fetchUserList(1)
    },
    created() {
    },
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #group-user-list {
    padding-top: 30px;
    padding-bottom: 30px;

    table {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 1.4rem;
      color: #777777;
      width: 100%;
      @media(max-width: 550px) {
        font-size: 1.3rem;
      }

      th {
        font-weight: bold;
        color: #333333;
        text-align: left;
      }

      tr {
        padding: 5px 0;
        border-bottom: 1px solid #dddddd;

        .first {
          flex-grow: 1;
          display: inline-flex;
          align-items: center;
          padding: 5px 0;

          img {
            min-width: 32px;
            max-width: 32px;
            min-height: 32px;
            max-height: 32px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
          }

          a {
            color: $green;

            &:hover {
              color: $darker-green;
            }
          }
        }

        .second, .three, .four {
          width: 150px;
          @media(max-width: 550px) {
            max-width: 50px;
          }
        }

        .second, .three {
          @media(max-width: 550px) {
            max-width: 30px;
          }
        }
      }

      tr:nth-child(1) {
        border-bottom: 2px solid #dddddd;
      }
    }

    .right-part {
      padding-top: 20px;
      @media(max-width: 768px) {
        padding-left: 0;
      }
    }

    .search-box {
      position: sticky;
      top: 20px;
      display: flex;
      align-items: center;
      font-size: 1.4rem;
      color: #333333;

      .common-input {
        border-radius: 3px 0 0 3px;
        flex-grow: 1;
      }

      .button {
        min-width: 50px;
        padding: 5px 10px;
        border-radius: 0 3px 3px 0;
        border: 1px solid #dddddd;
        border-left: none;

        &:hover {
          background-color: #dddddd;
        }
      }
    }
  }
</style>
