<template>
  <div id="MdRender" :class="[thin?'md-style-thin':'md-style']">
    <div class="content" v-html="html"></div>
  </div>
</template>

<script>
  import {eventBus, FORCE_EMIT_DEFAULT_LAYOUT_SCROLL, ON_DEFAULT_LAYOUT_SCROLL, ON_MD_RENDER_SCROLL} from "../assets/js/event-bus";

  export default {
    name: "MdRender",
    props: {
      content: {
        type: String,
        required: true
      },
      thin: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        titleArray: [],
        html: ''
      }
    },
    watch: {},
    computed: {},
    methods: {},
    mounted() {
      const refArray = []
      this.onScroll = (toTop) => {
        if (this.titleArray.length === 0) {
          return
        }
        if (refArray.length === 0) {
          // const MdRender = document.getElementById('MdRender')
          this.titleArray.forEach(val => refArray.push(document.getElementById(val)))
        }
        eventBus.$emit(ON_MD_RENDER_SCROLL, refArray, toTop)
      }
      eventBus.$on(ON_DEFAULT_LAYOUT_SCROLL, this.onScroll)
      eventBus.$emit(FORCE_EMIT_DEFAULT_LAYOUT_SCROLL)
    },
    created() {
      const md = require('markdown-it')('commonmark')
        .use(require('markdown-it-mark'))
        .use(require('markdown-it-sub'))
        .use(require('markdown-it-sup'))
        // .use(require('markdown-it-footnote'))
        .use(require('markdown-it-emoji'))
        .use(require('markdown-it-katex'))
        // .use(require('markdown-it-toc'))
        .use(require('markdown-it-task-lists'))
        // .use(require('markdown-it-lazy-image'))
        .use(require('markdown-it-plugin-underline'))
        .use(require('markdown-it-abbr'))
      const base64 = require('js-base64').Base64
      const tokens = md.parse(base64.decode(this.content), {})
      forEachTokens(tokens, this.titleArray)
      // console.log(JSON.stringify(this.titleArray))
      const hljs = require('highlight.js')
      this.html = md.renderer.render(tokens, {
        langPrefix: '',
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return '<pre v-highlightjs><code>' +
                hljs.highlight(lang, str, true).value +
                '</code></pre>';
            } catch (__) {
            }
          }

          return '<pre v-highlightjs><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        }
      })
    },
    destroyed() {
      eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL, this.onScroll)
    }
  }

  function forEachTokens(tokens, titleArray) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type.match(/_close$/)) {
        continue
      }
      lazyImg(token)
      collectIndex(token, titleArray, tokens[i + 1])
      if (token.children) {
        forEachTokens(token.children, titleArray)
      }
    }
  }

  const titleCounts = {
    h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1
  }

  function collectIndex(token, titleArray, nextToken) {
    const count = titleCounts[token.tag]
    if (count > 0) {
      titleCounts[token.tag]++
      if (!token.attrs) {
        token.attrs = []
      }
      const ref = token.tag + '-' + count
      token.attrs.push(['ref', ref])
      token.attrs.push(['id', ref])
      token.attrs.push(['class', ref])
      token.attrs.push(['tag', token.tag])
      token.attrs.push(['data-content', nextToken.content])
      titleArray.push(ref)
    }
  }

  function lazyImg(token) {
    if (token.tag === 'img' && token.attrs) {
      token.attrs.push(['loading', 'lazy'])
    }
    // if (token.tag === 'img' && token.attrs && token.attrs[0]) {
    //   token.attrs[0][0] = 'v-lazy'
    // }
  }
</script>

<style lang="scss">
  @import "../assets/css/var";

  #MdRender {
  }
</style>
