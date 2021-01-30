import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// import Highcharts from 'highcharts'
// import HighchartsVue from 'highcharts-vue'

// Vue.use(HighchartsVue
// )

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem("user") || null),
    internetAvailable: true,
    token: localStorage.getItem("token") || null,
    api_url: process.env.API_URL,
    dashboard_mode: false,
    packageVersion: require("./../../package.json").version,
    accesos: JSON.parse(localStorage.getItem("accesos") || null),
    formulario: JSON.parse(localStorage.getItem("formulario") || null),
    formulario_vista_previa: JSON.parse(localStorage.getItem("formulario_vista_previa") || null),
    centros: localStorage.getItem("centros") || null,
    leftDrawerOpen: false
    // the rest of your state here
  },
  mutations: {
    setInternetAvailable: (state, internetAvailable) => {
      state.internetAvailable = internetAvailable;
    },

    setUser: (state, value) => {
      state.user = value;
    },

    setLeftDrawerOpen: (state, value) => {
      state.leftDrawerOpen = value;
    },

    setToken: (state, value) => {
      state.token = value;
    },

    setDashboardMode: (state, value) => {
      state.dashboard_mode = value;
    },
    setAccesos: (state, value) => {
      state.accesos = value;
    },
    setFormulario: (state, value) => {
      state.formulario = value;
    },

    setFormularioVistaPrevia: (state, value) => {
      state.formulario_vista_previa = value;
    },

    setCentros: (state, value) => {
      state.centros = value;
    },

    destroyleftDrawerOpen: state => {
      state.leftDrawerOpen = null;
      localStorage.removeItem("leftDrawerOpen");
    },

    destroyToken: state => {
      state.token = null;
      localStorage.removeItem("token");
    },

    destroyFormulario: state => {
      state.formulario = null;
      localStorage.removeItem("formulario");
    },
    destroyFormularioVistaPrevia: state => {
      state.formulario = null;
      localStorage.removeItem("formulario_vista_previa");
    },

    destroyAccesos: state => {
      state.accesos = null;
      localStorage.removeItem("accesos");
    },

    destroyCentros: state => {
      state.centros = null;
      localStorage.removeItem("centros");
    },

    destroyUser: state => {
      state.user = null;
      localStorage.removeItem("user");
    }
  },
  actions: {
    removeCredentials () {
      this.commit("destroyToken");
      this.commit("destroyUser");
      this.commit("destroyAccesos");
      this.commit("destroyFormulario");
      this.commit("destroyCentros");
    }
  },
  getters: {
    loggedIn (state) {
      return (
        state.token !== null &&
        state.token !== undefined &&
        state.token !== "undefined"
      );
    },
    appVersion: state => {
      return state.packageVersion;
    },
    online (state) {
      console.log("Returning from store", state.internetAvailable);
      return state.internetAvailable;
    },
      accesos(state){
        return state.accesos
      }
  }
});
