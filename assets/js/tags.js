export const iconTags = {
  'java': 'static/icon/tag/java.png',
  'python': 'static/icon/tag/python.png',
  'android': 'static/icon/tag/android.png',
  'chrome': 'static/icon/tag/chrome.png',
  'firefox': 'static/icon/tag/firefox.png',
  'amazon-web-services': 'static/icon/tag/amazon-web-service.png',
  '以太坊': 'static/icon/tag/ether.png',
  '比特币': 'static/icon/tag/bitcoin.png',
  '区块链': 'static/icon/tag/block-chain.png',
  'flutter': 'static/icon/tag/flutter.png',
  '黑客马拉松': 'static/icon/tag/hackathon.png',
  'html5': 'static/icon/tag/html5.png',
  'ios': 'static/icon/tag/ios.png',
  'jquery': 'static/icon/tag/jquery.png',
  'mongodb': 'static/icon/tag/mongodb.png',
  'mysql': 'static/icon/tag/mysql.png',
  'raspberry-pi': 'static/icon/tag/raspberry-pi.png',
  'ruby': 'static/icon/tag/ruby.png',
  '七牛云存储': 'static/icon/tag/seven-cattle.png',
  '小程序': 'static/icon/tag/small-program.png',
  'twitter': 'static/icon/tag/twitter.png',
  'ubuntu': 'static/icon/tag/ubuntu.png',
  '人工智能': 'static/icon/tag/artificial-intelligence.png',
  'javascript': 'static/icon/tag/front-end.png',
  '云计算': 'static/icon/tag/cloud-compute.png',
}

export const tags = [
  {
    name: '开发语言',
    has: [
      {name: 'java', icon: 'static/icon/tag/java.png'}, 'c', 'c++', 'php', 'perl',
      {name: 'python', icon: 'static/icon/tag/python.png'},
      {name: 'javascript', icon: 'static/icon/tag/front-end.png',}, 'c#',
      {name: 'ruby', icon: 'static/icon/tag/ruby.png'}, 'go', 'lua', 'node.js', 'erlang', 'scala', 'bash', 'actionscript', 'golang', 'typescript',
      {name: 'flutter', icon: 'static/icon/tag/flutter.png'}
    ]
  },
  {
    name: '前端开发',
    has: [
      'html',
      {name: 'html5', icon: 'static/icon/tag/html5.png'}, 'css', 'css3',
      {name: 'javascript', icon: 'static/icon/tag/front-end.png',},
      {name: 'jquery', icon: 'static/icon/tag/jquery.png'}, 'json', 'ajax', '正则表达式', 'bootstrap'
    ]
  },
  {
    name: 'JavaScript 开发',
    has: [
      {name: 'javascript', icon: 'static/icon/tag/front-end.png',},
      {name: 'jquery', icon: 'static/icon/tag/jquery.png'}, 'node.js',
      {name: 'chrome', icon: 'static/icon/tag/chrome.png',},
      {name: 'firefox', icon: 'static/icon/tag/firefox.png',}, 'internet-explorer', 'angular.js', 'typescript', 'ecmascript', 'vue.js', 'react.js'
    ]
  },
  {
    name: '小程序开发',
    has: [
      {name: '小程序', icon: 'static/icon/tag/small-program.png',}, '微信小程序', '支付宝小程序', '百度智能小程序', '微信开发者工具', '头条小程序'
    ]
  },
  {
    name: '区块链',
    has: [
      {name: '比特币', icon: 'static/icon/tag/bitcoin.png'},
      {name: '以太坊', icon: 'static/icon/tag/ether.png',}, 'ico', '智能合约',
      {name: '区块链', icon: 'static/icon/tag/block-chain.png'}, '数字化货币'
    ]
  },
  {
    name: '人工智能',
    has: [
      {name: '人工智能', icon: 'static/icon/tag/artificial-intelligence.png',}, '自然语言处理', '自动驾驶', '神经网络', '数据挖掘', '机器学习', '深度学习', 'tensorflow'
    ]
  },
  {
    name: 'iOS开发',
    has: [
      {name: 'ios', icon: 'static/icon/tag/ios.png',}, 'objective-c', 'sqlite', 'safari', 'xcode', 'phonegap', 'cocoa',
      {name: 'javascript', icon: 'static/icon/tag/front-end.png',}, 'macos', 'iphone', 'ipad', 'swift'
    ]
  },
  {
    name: 'Android开发',
    has: [
      {name: 'android', icon: 'static/icon/tag/android.png',},
      {name: 'java', icon: 'static/icon/tag/java.png'}, 'eclipse', 'xml', 'phonegap', 'json', 'webview', 'android-studio'
    ]
  },
  {
    name: 'PHP开发',
    has: [
      'php',
      {name: 'mysql', icon: 'static/icon/tag/mysql.png',}, 'apache', 'nginx', 'mvc', 'symfony', 'zend-framework', 'composer', 'laravel'
    ]
  },
  {
    name: '数据库',
    has: [
      '数据库',
      {name: 'mysql', icon: 'static/icon/tag/mysql.png',}, 'sqlite', 'oracle', 'sql', 'nosql', 'redis',
      {name: 'mongodb', icon: 'static/icon/tag/mongodb.png',}, 'memcached', 'postgresql'
    ]
  },
  {
    name: '.NET开发',
    has: [
      '.net', 'c#', 'asp.net', 'visual-studio', 'mvc', 'microsoft'
    ]
  },
  {
    name: 'Python开发',
    has: [
      {name: 'python', icon: 'static/icon/tag/python.png'}, 'List', 'django', 'flask', 'tornado', 'web.py', 'sqlalchemy', 'virtualenv'
    ]
  },
  {
    name: 'Ruby开发',
    has: [
      {name: 'ruby', icon: 'static/icon/tag/ruby.png'}, 'ruby-on-rails', 'rubygems', 'rvm', 'macosx', 'bundle'
    ]
  },
  {
    name: '开发工具',
    has: [
      'vim', 'emacs', 'ide', 'eclipse', 'xcode', 'intellij-idea', 'textmate', 'sublime-text', 'visual-studio', 'git', 'github', 'svn', 'hg', 'docker', 'ci'
    ]
  },
  {
    name: '云计算',
    has: [
      {name: '云计算', icon: 'static/icon/tag/cloud-compute.png',}, '又拍云存储',
      {name: '七牛云存储', icon: 'static/icon/tag/seven-cattle.png',}, 'google-app-engine', 'sina-app-engine',
      {name: 'amazon-web-services', icon: 'static/icon/tag/amazon-web-service.png',}, '百度云', '金山云', '美团云', '腾讯云'
    ]
  },
  {
    name: 'Java开发',
    has: [
      {name: 'java', icon: 'static/icon/tag/java.png'}, 'java-ee', 'jar', 'spring', 'hibernate', 'struts', 'tomcat', 'maven', 'eclipse', 'intellij-idea'
    ]
  },
  {
    name: '搜索',
    has: [
      '搜索引擎', '中文分词', '全文检索', 'lucene', 'solr', 'sphinx', 'analyzer', 'elasticsearch'
    ]
  },
  {
    name: '开放平台',
    has: [
      '微信', '百度', 'facebook',
      {name: 'twitter', icon: 'static/icon/tag/twitter.png',}, 'paddle', '微信公众平台', '微信开放平台'
    ]
  },
  {
    name: '服务器',
    has: [
      'linux', 'unix',
      {name: 'ubuntu', icon: 'static/icon/tag/ubuntu.png',}, 'windows-server', 'centos', '负载均衡', '缓存', 'apache', 'nginx'
    ]
  }
]
