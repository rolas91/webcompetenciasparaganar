<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated>
      <q-toolbar style="background-color:transparent">

        <q-toolbar-title>
          <q-img
            src="statics/imagenes-plantilla/logo1.png"
            contain
            position="center"
            style="height: 80px;max-width: 200px;"
          ></q-img>
        </q-toolbar-title>

        <q-img
          src="statics/imagenes-plantilla/logo-swisscontact.png"
          contain
          position="center"
          style="height: 80px;max-width: 180px;margin:0px 30px;"
        ></q-img>
        <q-img
          src="statics/imagenes-plantilla/logo-cosude.png"
          contain
          position="center"
          style="height: 80px;max-width: 250px;margin:0px 30px;"
        ></q-img>

        <q-btn flat to="/login">
          <span>&nbsp;Iniciar Sesión </span>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    logOut () {
      let url = process.env.API_URL + '/logout'
      axios
        .post(
          url,
          {},
          {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.$store.state.token
            }
          }
        )
        .then(response => {
          this.removeCredentials()
          this.$router.push({
            name: 'login'
          })
        })
        .catch(() => {
          this.removeCredentials()
          this.$router.push({
            name: 'login'
          })
        })
    },

    removeCredentials () {
      this.$store.dispatch('removeCredentials')
    }
  }
}
</script>

<style>
body.desktop .q-hoverable:hover > .q-focus-helper {
  background: currentColor;
  opacity: -0.25;
}

.q-router-link--active {
  background-color: #337cbb;
}
.fit {
  width: calc(100% + 1px) !important;
}

.q-field--float .q-field__label,
.q-field--labeled .q-field__native,
.q-field__label {
  margin-left: 5px;
}
</style>
