<template>
  <div id="MdRender" v-html="html">
    {{html}}
    <p>@<a href="%E7%9B%AE%E5%BD%95">toc</a></p>
    <h1>Markdown 语法简介</h1>
    <blockquote>\n<p><a href="http://commonmark.org/help/">语法详解</a></p>\n</blockquote>
    \n<h2><strong>粗体</strong></h2>\n
    <pre><code>**粗体**\n__粗体__\n</code></pre>
    \n<h2><em>斜体</em></h2>\n
    <pre><code>*斜体*\n_斜体_\n</code></pre>
    \n<h2>标题</h2>\n
    <pre><code># 一级标题 #\n一级标题\n====\n## 二级标题 ##\n二级标题\n----\n### 三级标题 ###\n#### 四级标题 ####\n##### 五级标题 #####\n###### 六级标题 ######\n</code></pre>
    \n<h2>分割线</h2>\n
    <pre><code>***\n---\n</code></pre>
    \n
    <hr>
    \n<h2>^上^角~下~标</h2>\n
    <pre><code>上角标 x^2^\n下角标 H~2~0\n</code></pre>
    \n<h2>++下划线++ <s>中划线</s></h2>\n
    <pre><code>++下划线++\n~~中划线~~\n</code></pre>
    \n<h2>==标记==</h2>\n
    <pre><code>==标记==\n</code></pre>
    \n<h2>段落引用</h2>\n
    <pre><code>&gt; 一级\n&gt;&gt; 二级\n&gt;&gt;&gt; 三级\n...\n</code></pre>
    \n<h2>列表</h2>\n
    <pre><code>有序列表\n1.\n2.\n3.\n...\n无序列表\n-\n-\n...\n</code></pre>
    \n<h2>任务列表</h2>\n
    <ul>\n
      <li>[x] 已完成任务</li>
      \n
      <li>[ ] 未完成任务</li>
      \n
    </ul>
    \n
    <pre><code>- [x] 已完成任务\n- [ ] 未完成任务\n</code></pre>
    \n<h2>链接</h2>\n
    <pre><code>[链接](www.baidu.com)\n![图片描述](http://www.image.com)\n</code></pre>
    \n<p><img src="http://dummyimage.com//500x500/ff0000/FFFFFF" alt="图片"></p>\n<h2>代码段落</h2>\n<p>``` type</p>\n<p>代码段落</p>\n<p>```</p>\n<p>` 代码块 `</p>\n
    <pre><code class="language-c++">int main()\n{\n    printf(&quot;hello world!&quot;);\n}\n</code></pre>
    \n<p><code>code</code></p>\n<h2>表格(table)</h2>\n
    <pre><code>| 标题1 | 标题2 | 标题3 |\n| :--  | :--: | ----: |\n| 左对齐 | 居中 | 右对齐 |\n| ---------------------- | ------------- | ----------------- |\n</code></pre>
    \n
    <table>\n
      <thead>\n
      <tr>\n
        <th style="text-align:left">标题1</th>
        \n
        <th style="text-align:center">标题2</th>
        \n
        <th style="text-align:right">标题3</th>
        \n
      </tr>
      \n
      </thead>
      \n
      <tbody>\n
      <tr>\n
        <td style="text-align:left">左对齐</td>
        \n
        <td style="text-align:center">居中</td>
        \n
        <td style="text-align:right">右对齐</td>
        \n
      </tr>
      \n
      <tr>\n
        <td style="text-align:left">----------------------</td>
        \n
        <td style="text-align:center">-------------</td>
        \n
        <td style="text-align:right">-----------------</td>
        \n
      </tr>
      \n
      </tbody>
      \n
    </table>
    \n<h2>脚注(footnote)</h2>\n
    <pre><code>hello[^hello]\n</code></pre>
    \n<p>见底部脚注<a href="%E4%B8%80%E4%B8%AA%E6%B3%A8%E8%84%9A">^hello</a></p>\n<h2>表情(emoji)</h2>\n<p><a href="https://www.webpagefx.com/tools/emoji-cheat-sheet/">参考网站:
    https://www.webpagefx.com/tools/emoji-cheat-sheet/</a></p>\n
    <pre><code>:laughing:\n:blush:\n:smiley:\n:)\n...\n</code></pre>
    \n<p>:laughing::blush::smiley::)</p>\n<h2>$\\KaTeX$公式</h2>\n<p>我们可以渲染公式例如：$x_i + y_i = z_i$和$\\sum_{i=1}^n a_i=0$\n我们也可以单行渲染\n$$\\sum_{i=1}^n a_i=0$$\n具体可参照<a
    href="http://www.intmath.com/cg5/katex-mathjax-comparison.php">katex文档</a>和<a href="https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX">katex支持的函数</a>以及<a
    href="https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference">latex文档</a></p>\n<h2>布局</h2>\n<p>::: hljs-left\n<code>:::
    hljs-left</code>\n<code>居左</code>\n<code>:::</code>\n:::</p>\n<p>::: hljs-center\n<code>::: hljs-center</code>\n<code>居中</code>\n<code>:::</code>\n:::</p>\n<p>:::
    hljs-right\n<code>::: hljs-right</code>\n<code>居右</code>\n<code>:::</code>\n:::</p>\n<h2>定义</h2>\n<p>术语一</p>\n<p>: 定义一</p>\n<p>包含有<em>行内标记</em>的术语二</p>\n<p>: 定义二</p>\n
    <pre><code>    {一些定义二的文字或代码}\n\n定义二的第三段\n</code></pre>
    \n
    <pre><code>术语一\n\n:   定义一\n\n包含有*行内标记*的术语二\n\n:   定义二\n\n        {一些定义二的文字或代码}\n\n    定义二的第三段\n\n</code></pre>
    \n<h2>abbr</h2>\n<p>*[HTML]: Hyper Text Markup Language\n*[W3C]: World Wide Web Consortium\nHTML 规范由 W3C 维护</p>\n
    <pre><code>*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nHTML 规范由 W3C 维护\n</code></pre>
  </div>
</template>

<script>
  export default {
    name: "MdRender",
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
