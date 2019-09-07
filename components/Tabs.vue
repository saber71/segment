<template>
  <div id="Tabs">
    <section class="labels">
      <label v-for="(val,index) in labels" @click="active=index"
             :class="{active:active===index}"
             :style="{'font-size':fontSize}">{{val}}</label>
    </section>
    <section class="tabs-body">
      <slot :active="active"></slot>
    </section>
  </div>
</template>

<script>
  export default {
    name: "Tabs",
    props: {
      fontSize: {
        type: String,
        default: '14px'
      },
      labels: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        active: 0
      }
    },
    watch: {
      active(val) {
        this.$emit('active-change', val)
      }
    },
    computed: {},
    methods: {},
    mounted() {
      this.$on('set-active', index => this.active = index)
    },
    created() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #Tabs {
    .labels {
      border-bottom: 1px solid #dddddd;
      display: flex;
      align-items: center;

      label {
        cursor: pointer;
        margin-right: 10px;
        color: $green;
        padding: 7px 15px;
        transform: translateY(1px);
        @media(max-width: 768px) {
          padding: 3px 5px;
        }
      }

      .active {
        background-color: white;
        border: 1px solid #dddddd;
        border-bottom-color: white;
        border-radius: 4px 4px 0 0;
        color: #212121;
      }
    }
  }
</style>
