<template>
  <div id="Breadcrumb">
    <label v-for="(val,index) in router">
      <span v-show="index>0">/</span>
      <a :class="[val.href?'active':'deactive']" :href="val.href" target="_blank">{{val.text}}</a>
    </label>
  </div>
</template>

<script>
  export default {
    name: "Breadcrumb",
    props: {
      router: {
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
    beforeDestroy() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #Breadcrumb {
    label {
      font-size: 1.4rem;

      span {
        color: #ccc;
        margin-right: 10px;
      }

      a {
        margin-right: 10px;
      }

      .active {
        color: $green;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .deactive {
        color: #777;
        cursor: default;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }
</style>
