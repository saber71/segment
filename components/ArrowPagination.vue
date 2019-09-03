<template>
  <div id="ArrowPagination">
    <img class="prev" :class="{disabled:currentPage===0}" src="/icon/arrow-down-green.svg" @click="prev">
    <input v-model="currentPage" v-show="input" @keypress.enter="enterPress" @focusout="enterPress" autofocus>
    <span class="page" v-show="!input" @click="input=true">{{currentPage}}&nbsp;&nbsp;</span>
    <span>/&nbsp;&nbsp;{{total}}</span>
    <img class="next" :class="{disabled:currentPage===total}" src="/icon/arrow-down-green.svg" @click="next">
  </div>
</template>

<script>
  export default {
    name: "ArrowPagination",
    props: {
      page: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        currentPage: 0,
        input: false
      }
    },
    watch: {
      page(val) {
        this.currentPage = val
      }
    },
    computed: {},
    methods: {
      enterPress() {
        this.input = false
        if (this.currentPage > this.total) {
          this.currentPage = this.total
        } else if (this.currentPage < 1) {
          this.currentPage = 1
        }
        this.emit(this.currentPage)
      },
      emit(number) {
        this.$emit('page-change', number)
      },
      prev() {
        if (this.currentPage > 1) {
          this.emit(this.currentPage - 1)
        }
      },
      next() {
        if (this.currentPage < this.total) {
          this.emit(this.currentPage + 1)
        }
      }
    },
    mounted() {
    },
    created() {
      this.currentPage = this.page
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  #ArrowPagination {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: #333333;

    img {
      width: 16px;
      height: 16px;
      opacity: 0.5;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }

    .disabled {
      cursor: default;

      &:hover {
        opacity: 0.5;
      }
    }

    .prev {
      margin-right: 10px;
      transform: rotate(90deg);
    }

    .next {
      margin-left: 10px;
      transform: rotate(-90deg);
    }

    .page, input {
      line-height: 20px;
      padding: 0;
      border: none;
      text-align: center;
      cursor: text;
    }

    input {
      width: 50px;
      border: 1px solid #dddddd;
      margin-right: 5px;
    }

    input:focus {
      box-shadow: 0 0 3px 1px #3b99fc;
      border: none;
    }
  }
</style>
