export const state = () => ({
  homeActiveMenu: '首页',
  user: undefined,
  // eventsDescriptionLess
})

export const mutations = {
  setHomeActiveMenu(state, val) {
    state.homeActiveMenu = val
  },
  setUser(state, val) {
    state.user = val
  },
  setEventsDescriptionLess(state, val) {
    state.eventsDescriptionLess = val
  },
  setRecommendArticleOption(state, val) {
    state.user.recommendArticleOption = val
  }
}
