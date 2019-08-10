import Mock from 'mockjs'

const r = Mock.Random

/*
* user  {  用户登陆成功后返回的数据
*   avatar  string  头像的地址
*   prestige  number  声望数值
*   star1 number
*   star2 number
*   star3 number
* }
* */
export function genUser() {
  return {
    avatar: r.image('400x400'),
    prestige: r.integer(0, 10000),
    star1: r.integer(0, 1000),
    star2: r.integer(0, 1000),
    star3: r.integer(0, 1000),
  }
}
