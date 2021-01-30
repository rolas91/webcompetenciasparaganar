<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { createConnection, EntitySchema } from "typeorm";
export default {
  name: "App",
  created() {
    if (this.$q.platform.is.mobile) {
      window.addEventListener("offline", this.handleOffline);
      window.addEventListener("online", this.handleOnline);
      createConnection({
        type: "cordova",
        location: "default",
        database: "swisscontact.db",
        synchronize: true,
        entities: [
          new EntitySchema(require("./models/respuesta.json")),
          new EntitySchema(require("./models/matricula.json")),
          new EntitySchema(require("./models/formulario.json")),
          new EntitySchema(require("./models/formulario_respuesta.json")),
          new EntitySchema(require("./models/tipo_formulario.json")),
          new EntitySchema(require("./models/centro.json")),
          new EntitySchema(require("./models/curso.json")),
          new EntitySchema(require("./models/user.json")),
          new EntitySchema(require("./models/departamento.json")),
          new EntitySchema(require("./models/municipio.json"))
        ]
      })
        .then(con => {
          console.log("Connection ready", { con });
        })
        .catch(error => {
          console.error("Connection error", { error });
        });
    }
  },
  methods: {
    handleOffline(event) {
      console.log("App went offline!", event);
      this.$store.commit("setInternetAvailable", false);
    },
    handleOnline(event) {
      console.log("App is now online!", event);
      this.$store.commit("setInternetAvailable", true);
    }
  },
  destroyed() {
    if (this.$q.platform.is.mobile) {
      window.removeEventListener("offline", this.handleOffline);
      window.removeEventListener("online", this.handleOnline);
    }
  }
};
</script>

<style></style>
