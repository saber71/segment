<template>
  <div id="MdRender" v-html="html">
  </div>
</template>

<script>
  import ArticleTitle from "./ArticleTitle";

  export default {
    name: "MdRender",
    components: {ArticleTitle},
    props: {
      base64Md: {
        type: String,
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
    },
    created() {
      const md = require('markdown-it')()
        .use(require('markdown-it-mark'))
      const base64 = require('js-base64').Base64
      const tokens = md.parse(base64.decode(this.base64Md), {})
      clearInvalid(tokens)
      replaceTitle(tokens)
      forEachTokens(tokens, this.titleArray)
      const hljs = require('highlight.js');
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
    }
  }

  function clearInvalid(tokens) {
    let h1Index = 0
    for (let i = 0; i < tokens.length; i++) {
      const obj = tokens[i]
      if (obj.tag === 'h1') {
        h1Index = i
        break
      }
    }
    for (let i = 0; i < h1Index; i++) {
      tokens.shift()
    }
  }

  function replaceTitle(tokens) {
    const tagName = 'article-title'
    tokens[0].tag = tagName
    tokens[0].attrs = [
      [':article', 'article'],
      ['class', 'title']
    ]
    for (let i = 1; i < tokens.length; i++) {
      const obj = tokens[i]
      if (obj.tag === 'h1') {
        obj.tag = tagName
        break
      }
    }
  }

  function forEachTokens(tokens, titleArray) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type.match(/_close$/)) {
        continue
      }
      lazyImg(token)
      collectIndex(token, titleArray)
      if (token.children) {
        forEachTokens(token.children)
      }
    }
  }

  const titleCounts = {
    h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1
  }

  function collectIndex(token, titleArray) {
    const count = titleCounts[token.tag]
    if (count) {
      titleCounts[token.tag]++
      if (!token.attrs) {
        token.attrs = []
      }
      const ref = token.tag + '-' + count
      token.attrs.push(['ref', ref])
      token.attrs.push(['id', ref])
      titleArray.push(ref)
    }
  }

  function lazyImg(token) {
    if (token.tag === 'img' && token.attrs && token.attrs[0]) {
      token.attrs[0][0] = 'v-lazy'
    }
  }
</script>

<style lang="scss">
  @import "../assets/css/var";

  #MdRender {
    font-size: 1.5rem;
    line-height: 1.8;

    a {
      color: $green;
      border-bottom: 1px solid rgba(0, 154, 97, 0.25);
      text-decoration: none;

      &:hover {
        color: #004e31;;
        border-bottom-color: $green;
      }
    }

    blockquote {
      border-left: 2px solid $green;
      background-color: #F6F6F6;
      color: #555555;
      padding: 10px 20px 10px 10px;
      box-sizing: border-box;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: 500;
    }

    h1 {
      font-size: 30px;
      line-height: 42px;
      margin-top: 15px;
      margin-bottom: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif;
    }

    mark {
      font-size: 0.93em;
      color: #c7254e;
      background-color: #f9f2f4;
      border-radius: 4px;
      padding: 2px 4px;
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }

    code {
      display: block;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      background-color: lightgray;
    }
  }
</style>
