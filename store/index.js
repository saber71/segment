export const state = () => ({
  homeActiveMenu: '首页',
  user: undefined,
  defaultLayoutTopHeight: 0,
  formInputValidate: true
  // eventsDescriptionLess
})

export const mutations = {
  setFormInputValidate(state, val) {
    state.formInputValidate = val
  },
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
  },
  setDefaultLayoutTopHeight(state, val) {
    state.defaultLayoutTopHeight = val
  },
}
