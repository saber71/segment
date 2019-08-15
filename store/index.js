export const state = () => ({
  homeActiveMenu: '首页',
  user: undefined
})

export const mutations = {
  setHomeActiveMenu(state, val) {
    state.activeMenu = val
  },
  setUser(state, val) {
    state.user = val
  }
}
