import Vue from 'vue';
import {GET_CHECK_USER_DATA_AFTER_LOGIN, POST_LOGIN} from "../assets/js/api";
import {LS_ACCOUNT} from "../assets/js/const";
import {eventBus, FAIL_LOGIN, SUCCESS_LOGIN} from "../assets/js/event-bus";

Vue.prototype.$ajax_login = function (account) {
  this.$axios.post(POST_LOGIN, account).then(async () => {
    account.expires = Date.now() + 1000 * 60 * 60 * 24
    localStorage.setItem(LS_ACCOUNT, JSON.stringify(account))
    const data = await this.$axios.$get(GET_CHECK_USER_DATA_AFTER_LOGIN)
    this.$store.commit('setUser', data)
    eventBus.$emit(SUCCESS_LOGIN)
  }).catch(() => {
    eventBus.$emit(FAIL_LOGIN)
    eventBus.$off(FAIL_LOGIN)
  })
}

