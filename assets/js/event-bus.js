import Vue from 'vue'

export const eventBus = new Vue()

//事件名
export const SHOW_LOGIN__CARD = 'show-login-card'
export const SHOW_REGISTER_CARD = 'show-register-card'
export const SUCCESS_LOGIN = 'success-login'//成功登陆
export const FAIL_LOGIN = 'fail-login'//登陆失败

export const ON_DEFAULT_LAYOUT_SCROLL = 'on-default-layout-scroll'
export const ON_MD_RENDER_SCROLL = 'md-render-scroll'
