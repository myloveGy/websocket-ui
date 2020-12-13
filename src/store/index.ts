import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    router: {path: '/'},
  },
  mutations: {
    router(state, router) {
      state.router = router
    },
  },
  actions: {
    setRouter({commit}, router) {
      commit('router', router)
    },
  },
  modules: {},
})
