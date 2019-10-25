<template>
  <div id="MdIndex">
    <div class="free" :style="{transform:'translateY('+translateY+'px)',height:height+'px'}"></div>
    <ul class="container">
      <li v-for="(c1,i1) in indexArray" :style="{'margin-left':(20*c1.level)+'px'}">
        <a class="mdIndexItem" :class="{active:reachIndex===i1}" :href="'#'+c1.id" @click="onClickItem">{{c1.content}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  import {eventBus, FORCE_EMIT_DEFAULT_LAYOUT_SCROLL, ON_MD_INDEX_CHANGE_TITLE, ON_MD_RENDER_SCROLL} from "../assets/js/event-bus";

  export default {
    name: "MdIndex",
    props: {},
    data() {
      return {
        indexArray: [],
        translateY: 0,
        height: 0,
        reachIndex: -1,
        elementArray: [],
      }
    },
    watch: {},
    computed: {},
    methods: {
      onClickItem() {
        eventBus.$emit(FORCE_EMIT_DEFAULT_LAYOUT_SCROLL)
      }
    },
    mounted() {
      eventBus.$on(ON_MD_RENDER_SCROLL, (refArray, toTop) => {
        if (this.indexArray.length === 0) {
          readyIndex(this.indexArray, refArray, 0)
          // console.log(JSON.stringify(this.indexArray))
        }
        if (this.elementArray.length === 0) {
          const items = document.getElementsByClassName('mdIndexItem')
          for (let j = 0; j < items.length; j++) {
            this.elementArray.push(items.item(j))
          }
          // console.log(this.elementArray)
        }
        let reachIndex = -1, minPlusBias = Number.MAX_VALUE
        const layoutTopHeight = this.$store.state.defaultLayoutTopHeight
        for (let j = 0; j < refArray.length; j++) {
          const ref = refArray[j]
          const bias = toTop - ref.offsetTop - layoutTopHeight
          // console.log(ref.getAttribute('data-content') + '  ' + bias + '  ' + toTop + '  ' + ref.offsetTop + '  ' + layoutTopHeight)
          if (bias >= 0 && bias <= minPlusBias) {
            minPlusBias = bias
            reachIndex = j
          }
        }
        if (reachIndex === -1) {
          this.translateY = 0
          this.height = 0
        } else {
          const element = this.elementArray[reachIndex]
          // console.log(itemArray)
          this.translateY = element.offsetTop
          this.height = element.getBoundingClientRect().height
        }
        if (reachIndex !== this.reachIndex) {
          eventBus.$emit(ON_MD_INDEX_CHANGE_TITLE, this.translateY, this.height)
        }
        this.reachIndex = reachIndex
      })
    },
    beforeDestroy() {
      eventBus.$off(ON_MD_RENDER_SCROLL)
    }
  }

  let i = 0

  function readyIndex(indexArray, refArray, height, parent) {
    for (; i < refArray.length; i++) {
      const ref = refArray[i]
      const content = ref.getAttribute('data-content')
      const obj = {
        content,
        level: getLevel(ref.getAttribute('tag')),
        id: ref.getAttribute('id')
      }
      if (parent) {
        if (parent.level < obj.level) {
          if (obj.level - parent.level > 1) {
            obj.level = parent.level + 1
          }
          indexArray.push(obj)
        } else {
          return obj
        }
      } else {
        parent = obj
        parent.level = 1
        indexArray.push(parent)
        i++
        const res = readyIndex(indexArray, refArray, height + 1, parent)
        if (res) {
          if (parent.level < res.level) {
            if (obj.level - parent.level > 1) {
              obj.level = parent.level + 1
            }
            indexArray.push(obj)
          } else if (height === 0) {
            res.level = 1
            indexArray.push(res)
          } else {
            return res
          }
        }
      }
    }
  }

  function getLevel(tag) {
    return tag.match(/[0-9]/)
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/var";

  #MdIndex {
    position: relative;
    overflow: hidden;

    .free {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 0;
      border-left: 2px solid $green;
      background-color: #f3f3f3;
      transition: all 0.3s ease;
      z-index: -1;
    }

    .container {
      transition: all 0.3s ease;
      box-sizing: border-box;

      li {
        list-style: square;

        .mdIndexItem {
          display: block;
          cursor: pointer;
          padding: 5px 0;
          font-size: 1.4rem;
          color: #555555;

          &:hover {
            text-decoration: underline;
          }
        }

        .active {
          color: $green;
        }
      }
    }
  }
</style>
