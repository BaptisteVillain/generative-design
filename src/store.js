import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: {},
    update: Date.now(),
    download: Date.now(),
  },
  getters: {
    getData: state => {
      return state.data;
    },
    getUpdate: state => {
      return state.update;
    },
    onDownload: state => {
      return state.download;
    }
  },
  mutations: {
    setData(state, data) {
      state.data = data
    },
    setUpdate(state) {
      state.update = Date.now();
    },
    setDownload(state) {
      state.download = Date.now();
    }
  },
})
