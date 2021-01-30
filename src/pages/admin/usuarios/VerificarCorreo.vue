<template>
  <q-layout view="lHh Lpr lFf">
    <div class="q-pa-md" style="margin-top:15%">
      <div class="row">
        <div class="col-12 col-md-4 offset-md-4">
          <img
            style="display:flex;margin:auto;"
            src="https://www.swisscontact.org/fileadmin/Resources/Public/Images/Logo.png"
          />

          <div>
            <q-btn
              :loading="loading"
              color="primary"
              class="full-width"
              disable
            >
              Token no válido
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />Verificando el token...
              </template>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: true,
      token: null,
      email: null
    };
  },
  created() {
    this.token = this.$route.params.token;
    this.email = this.$route.params.email;
    this.loading = true;
    var method = "post";

    this.removeCredentials();

    var url = process.env.API_URL + "/usuario/verificar_correo";

    axios({
      method: method,
      url: url,
      data: { token: this.token, email: this.email }
    })
      .then(response => {
        if (response.data.result) {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "fas fa-check-circle",
            message: response.data.message,
            position: "bottom",
            timeout: 2000
          });

          this.$router.push({
            path: `/usuario/cambiar_contrasenia/${this.email}/${this.token}`
          });
        } else {
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "fas fa-exclamation-triangle",
            message: response.data.message
          });
        }
      })
      .catch(error => {
        this.loading = false;
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "fas fa-exclamation-triangle",
          message: error.response.data.message
        });
      });
  },
  methods: {
    removeCredentials() {
      this.$store.dispatch("removeCredentials");
    }
  }
};
</script>
