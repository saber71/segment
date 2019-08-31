<template>
  <div id="MdIndex">
    <div class="free" :style="{transform:'translateY('+translateY+'px)',height:height+'px'}"></div>
    <ul class="container">
      <li :ref="'item'+i1" class="item" :class="{active:reachIndex===i1}"
          v-for="(c1,i1) in indexArray">
        {{c1.content}}
        <ul class="container">
          <li :ref="'item'+i1+i2" class="item" :class="{active:reachIndex===i1+i2}"
              v-for="(c2,i2) in c1.children">
            {{c2.content}}
            <ul class="container">
              <li class="item" :ref="'item'+i1+i2+i3" :class="{active:reachIndex===i1+i2+i3}"
                  v-for="(c3,i3) in c2.children">
                {{c3.content}}
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import {eventBus, ON_MD_RENDER_SCROLL} from "../assets/js/event-bus";

  export default {
    name: "MdIndex",
    props: {},
    data() {
      return {
        indexArray: [],
        translateY: 0,
        height: 0,
        reachIndex: -1
      }
    },
    watch: {},
    computed: {},
    methods: {},
    mounted() {
    },
    created() {
      const itemArray = []
      eventBus.$on(ON_MD_RENDER_SCROLL, (refArray, toTop) => {
        if (this.indexArray.length === 0) {
          readyIndex(this.indexArray, refArray, 0)
        }
        if (itemArray.length === 0) {
          for (let j = 0; j < this.indexArray.length; j++) {
            const item = this.indexArray[j]
            itemArray.push(this.$refs['item' + j])
            if (item.children.length > 0) {
              for (let k = 0; k < item.children.length; k++) {
                const item1 = item.children[k]
                itemArray.push(this.$refs['item' + j + k])
                if (item1.children.length > 0) {
                  for (let l = 0; l < item1.children.length; l++) {
                    itemArray.push(this.$refs['item' + j + k + l])
                  }
                }
              }
            }
          }
        }
        // console.log(itemArray)
        let reachIndex = -1
        for (let j = 0; j < refArray.length; j++) {
          const ref = refArray[j]
          const bias = Math.abs(ref.offsetTop - toTop)
          if (Math.abs(bias - innerHeight) <= 20) {
            reachIndex = j
            break
          }
        }
        if (reachIndex === -1) {
          this.translateY = 0
          this.height = 0
        } else {
          const item = itemArray[reachIndex]
          this.translateY = item.offsetTop
          this.height = item.getBoundingClientRect().height
        }
        this.reachIndex = reachIndex
      })
    },
    destroyed() {
      eventBus.$off(ON_MD_RENDER_SCROLL)
    }
  }

  let i = 0

  function readyIndex(indexArray, refArray, height, parent) {
    for (; i < refArray.length; i++) {
      const ref = refArray[i]
      const content = ref.getAttribute('data-content')
      const obj = {content, children: [], level: getLevel(ref.getAttribute('tag'))}
      if (parent) {
        if (parent.level > obj.level) {
          parent.children.push(obj)
        } else {
          return obj
        }
      } else {
        parent = obj
        const res = readyIndex(indexArray, refArray, height + 1, parent)
        if (res) {
          if (parent.level > res.level) {
            parent.children.push(res)
          } else if (height === 0) {
            indexArray.push(res)
          } else {
            return res
          }
        }
      }
    }
  }

  function getLevel(tag) {
    const num = tag.match(/[0-9]/)
    return 6 - num
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
      border-left: 2px solid $green;
      background-color: #f3f3f3;
      transition: all 0.3s ease;
    }

    .container {
      transition: all 0.3s ease;
      list-style: disc;
      padding: 0 20px;
      box-sizing: border-box;

      .item {
        padding: 5px 0;
        font-size: 1.4rem;
      }

      .active {
        color: $green;
      }
    }
  }
</style>
