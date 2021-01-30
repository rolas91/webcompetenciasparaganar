<template>
  <q-layout view="lHh Lpr lFf">
    <div class="q-pa-md" style="margin-top:5%">
      <div class="row">
        <div class="col-12 col-md-4 offset-md-4">
          <q-card class="q-pa-md" flat>
            <img
              style="display:flex;margin:auto;"
              src="http://competenciasparaganar.com/statics/imagenes-plantilla/logo2.png"
            />
            <br />
            <q-card-section class="bg-primary text-white q-pa-md">
              <div class="text-h6 text-center">Cambia tu contraseña</div>
            </q-card-section>

            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="password"
                label="Contraseña"
                :type="isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="[
                  val =>
                    (val && val.length >= 6) ||
                    'Ingresa una contraseña válida, debe contener al menos 6 caracteres de longitud'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-input
                v-model="passwordConfirmation"
                label="Confirma Contraseña"
                :type="isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="[
                  val =>
                    (val && val.length >= 6) ||
                    'Ingresa una contraseña válida, debe contener al menos 6 caracteres de longitud',
                  val =>
                    passwordMached(val) ||
                    'Las contraseñas no coinciden, por favor revisa'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-btn label="Aceptar" type="submit" color="primary" />
            </q-form>
          </q-card>
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
      password: null,
      passwordConfirmation: null,
      isPwd: true,
      token: null,
      email: null
    };
  },
  created() {
    this.token = this.$route.params.token;
    this.email = this.$route.params.email;
  },
  methods: {
    passwordMached(val) {
      return this.password === val;
    },
    onSubmit() {
      this.loading = true;
      var method = "post";
      var url = process.env.API_URL + "/usuario/cambiar_contrasenia";

      axios({
        method: method,
        url: url,
        data: {
          token: this.token,
          email: this.email,
          password: this.password,
          passwordConfirmation: this.passwordConfirmation
        }
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
              name: "login"
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
    }
  }
};
</script>
