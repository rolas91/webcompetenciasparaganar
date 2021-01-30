<template>
  <q-page v-cloak>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="bg-blue-background text-white q-gutter-xs">
          <h5 class="page-title">
            Enviar Correo de prueba
          </h5>
        </q-card-section>
        <q-separator />

        <q-card-section class=" ">
          <q-form ref="formCentro" @submit="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  outlined=""
                  bg-color="white"
                  color="primary"
                  v-model="correo"
                  label="Correo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && emailRegex.test(val)) ||
                      !val ||
                      'Ingrese un correo válido',
                  ]"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-btn
                  icon="keyboard_backspace"
                  @click="cancelar"
                  label="Regresar"
                ></q-btn>
                <q-btn
                  :loading="loading"
                  :disable="loading"
                  class="bg-primary text-white float-right"
                  type="submit"
                  icon-right="send"
                  label="Enviar"
                ></q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      correo: null,
      loading: false,
    }
  },
  created() {},
  methods: {
    onSubmit() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/correo_prueba'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { correo: this.correo },
        headers: headers,
      })
        .then((response) => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Correo Enviado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
        })

        .catch((error) => {
          this.loading = false

          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data.message,
          })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    cancelar() {
      this.$router.push({
        path: '/admin/dashboard/',
      })
    },
  },
}
</script>

<style scope>
.bg-blue-background {
  background-color: #027be3;
}
</style>
