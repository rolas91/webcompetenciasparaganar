<template>
  <q-layout view="lHh Lpr lFf">
    <div class="q-pa-md" style="margin-top:5%">
      <div class="row">
        <div class="col-12 col-md-4 offset-md-4">
          <q-card class="q-pa-md" flat>
            <img
              style="display:flex;margin:auto;"
              src="statics/imagenes-plantilla/logo2.png"
            />
            <br />
            <q-card-section class="bg-primary text-white q-pa-md">
              <div class="text-h6 text-center">
                Ingresa tu correo electrónico, te enviaremos un enlace para que
                puedas cambiar tu contraseña
              </div>
            </q-card-section>

            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="correo"
                label="Correo"
                type="text"
                lazy-rules
                :rules="[
                  val => (val && val.length >= 6) || 'Ingresa un correo válido',
                ]"
              >
                <template v-slot:append>
                  <q-icon name="email" class="cursor-pointer" />
                </template>
              </q-input>

              <q-btn
                :loading="loading"
                label="Aceptar"
                type="submit"
                color="primary"
              />
            </q-form>
          </q-card>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      correo: null,
      loading: false,
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
    }
  },
  created() {},
  methods: {
    onSubmit() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/usuario/resetear-contrasenia'

      axios({
        method: method,
        url: url,
        data: {
          email: this.correo,
        },
      })
        .then(response => {
          this.loading = false
          if (response.data.result) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: response.data.message,
              position: 'bottom',
              timeout: 2000,
            })
          } else {
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: response.data.message,
            })
          }
        })
        .catch(error => {
          this.loading = false
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data.message,
          })
        })
    },
  },
}
</script>
