<template>
  <div id="MdRender">
    <article-title :article="article"></article-title>
    <div class="content" v-html="html"></div>
    <!--{{html}}-->
  </div>
</template>

<script>
  import ArticleTitle from "./ArticleTitle";
  import {eventBus, FORCE_EMIT_DEFAULT_LAYOUT_SCROLL, ON_DEFAULT_LAYOUT_SCROLL, ON_MD_RENDER_SCROLL} from "../assets/js/event-bus";

  export default {
    name: "MdRender",
    components: {ArticleTitle},
    props: {
      article: {
        type: Object,
        required: true
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
        .use(require('markdown-it-lazy-image'))
        .use(require('markdown-it-plugin-underline'))
        .use(require('markdown-it-abbr'))
      const base64 = require('js-base64').Base64
      const tokens = md.parse(base64.decode(this.article.content), {})
      // clearInvalid(tokens)
      // replaceTitle(tokens)
      forEachTokens(tokens, this.titleArray)
      // console.log(JSON.stringify(tokens))
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
      const refArray = []
      eventBus.$on(ON_DEFAULT_LAYOUT_SCROLL, (toTop) => {
        if (refArray.length === 0) {
          // const MdRender = document.getElementById('MdRender')
          this.titleArray.forEach(val => refArray.push(document.getElementById(val)))
          // console.log(refArray)
        }
        eventBus.$emit(ON_MD_RENDER_SCROLL, refArray, toTop)
      })
    },
    destroyed() {
      eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL)
    }
  }

  // function clearInvalid(tokens) {
  //   let h1Index = 0
  //   for (let i = 0; i < tokens.length; i++) {
  //     const obj = tokens[i]
  //     if (obj.tag === 'h1') {
  //       h1Index = i
  //       break
  //     }
  //   }
  //   for (let i = 0; i < h1Index; i++) {
  //     tokens.shift()
  //   }
  // }

  // function replaceTitle(tokens) {
  //   let h1Index = 0, endIndex = 0
  //   for (let i = 0; i < tokens.length; i++) {
  //     const obj = tokens[i]
  //     if (obj.tag === 'h1') {
  //       h1Index = i
  //       break
  //     }
  //   }
  //   tokens.splice(h1Index, 2)
  // }

  function forEachTokens(tokens, titleArray) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type.match(/_close$/)) {
        continue
      }
      lazyImg(token)
      collectIndex(token, titleArray, tokens[i + 1])
      if (token.children) {
        forEachTokens(token.children)
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
    font-size: 1.5rem;
    line-height: 1.8;
    padding-bottom: 30px;

    .content {
      margin-top: 50px;
    }

    a {
      color: $green;
      border-bottom: 1px solid rgba(0, 154, 97, 0.25);
      text-decoration: none;

      &:hover {
        color: #004e31;;
        border-bottom-color: $green;
      }
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif;
      margin-top: 1.5em;
    }

    h1 {
      font-size: 2em;
      line-height: 1.75em;
      margin-top: 15px;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    h2 {
      font-size: 1.75em;
      line-height: 1.5em;
      border-bottom: 1px solid #eee;
    }

    h3 {
      font-size: 1.5em;
      line-height: 1.25em;
    }

    h4 {
      font-size: 1.25em;
      line-height: 1em;
    }

    mark {
      font-size: 0.93em;
      color: #c7254e;
      background-color: #f9f2f4;
      border-radius: 4px;
      padding: 2px 4px;
    }

    ul, ol {
      margin-top: 1.5em;

      li {
        list-style-type: disc;
      }
    }

    code {
      display: block;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      background-color: #f6f6f6;
      margin-top: 1.5em;
      overflow-x: auto;
    }

    p {
      margin-top: 1.5em;
    }

    blockquote {
      border-left: 2px solid $green;
      background-color: #F6F6F6;
      color: #555555;
      padding: 10px 20px 10px 10px;
      box-sizing: border-box;
      margin-top: 1.5em;

      * {
        margin-top: 0;
      }
    }

    img {
      margin: 1.5em auto auto;
      max-width: 100%;
      width: fit-content;
    }

    table {
      margin-top: 1.5em;
    }
  }
</style>
