<template>
  <div id="Tag" class="tag" :class="{'active':selected}" @click="onClick" tabindex="1">
    <img :src="iconPath" v-if="iconPath">{{tag}}
  </div>
</template>

<script>
  export default {
    name: "Tag",
    props: {
      tag: {
        type: String,
        required: true
      },
      click: {
        type: Function,
      },
      await: {
        type: Boolean,
        default: true
      },
      param: {
        default: undefined
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        awaiting: false
      }
    },
    watch: {},
    computed: {
      iconPath() {
        return this.$getTagIcon(this.tag)
      }
    },
    methods: {
      onClick() {
        if (this.click) {
          if (this.awint && this.awaiting) {
            return
          }
          this.awaiting = true
          this.click(this.tag, () => {
            this.awaiting = false
          }, this.param)
        } else {
          this.$router.push({path: '/tag/' + this.tag})
        }
      }
    },
    mounted() {
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  #Tag {
    font-size: 13px;
    padding: 0 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 1px;

    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
      margin-top: 0;
    }

    &:hover {
      background-color: #017E66;
      color: white;
    }
  }

  .tag {
    color: #017E66;
    background-color: rgba(1, 126, 102, 0.08);
  }

  .active {
    background-color: #017E66;
    color: white;
  }
</style>
