<template>
  <q-layout
    view="lHh Lpr lFf"
    style="background-image:url('statics/imagenes-login/fondo.png');background-size: cover;"
  >
    <div class="q-pa-md">
      <div class="q-pa-md">
        <div
          class="row"
          style="display:flex;justify-content:center;text-align:center"
        >
          <div class="col-12 col-md-4  offset-md-2">
            <img
              :src="
                $q.screen.lt.md
                  ? 'statics/imagenes-plantilla/cosude.png'
                  : 'statics/imagenes-login/logo-cosude.png'
              "
              class="logo"
            />
          </div>

          <div class="col-12 col-md-3 offset-md-1">
            <img
              :src="
                $q.screen.lt.md
                  ? 'statics/imagenes-plantilla/swisscontact.png'
                  : 'statics/imagenes-login/logo-swisscontact.png'
              "
              class="logo"
            />
          </div>

          <div class="col-12 col-md-2">
            <q-btn
              flat
              v-if="!$q.platform.is.mobile"
              style="color:white;"
              label="Inicio"
              to="/inicio"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-12 col-md-4 offset-md-4 col-sm-10 offset-sm-1 login-card"
        >
          <img src="statics/imagenes-plantilla/logo3.png" class="imagen-logo" />
          <q-card cointainer>
            <!-- <q-card-section class="bg-primary text-white">
              <div class="text-h6">Login</div>
            </q-card-section>-->
          </q-card>

          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              dark
              type="email"
              color="white"
              v-model="email"
              label="Correo"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0 && filter.test(email)) ||
                  'Por favor ingresa una contraseña válida',
              ]"
            ></q-input>

            <q-input
              dark
              color="white"
              v-model="password"
              label="Contraseña"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length >= 6) ||
                  'Ingresa una contraseña válida, debe contener al menos 6 caracteres de longitud',
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

            <div>
              <div class="row q-mb-md text-right">
                <div class="col-12 olvidaste-contrasenia">
                  <label class="text-white ">
                    <q-btn size="sm" flat="" to="/resetear-contrasenia">
                      ¿Olvidaste tu contraseña?
                    </q-btn>
                  </label>
                </div>
              </div>
              <div class="row">
                <div
                  class="col-12"
                  style="display:flex;justify-content:center;"
                >
                  <q-btn
                    :loading="loading"
                    label="Entrar"
                    type="submit"
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <div>
      <div
        class="col-12 col-md-4 offset-md-4 col-sm-10 offset-sm-1 flex flex-center"
      >
        <img src="statics/logos-numu-digital-factory.png" class="logo-numu" />
      </div>
    </div>
  </q-layout>
</template>
<script>
import axios from 'axios'
import { getRepository } from 'typeorm'

export default {
  data() {
    return {
      email: null,
      loading: false,
      password: null,
      isPwd: true,
      filter: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
    }
  },
  created() {
    if (localStorage.getItem('ultimoemail')) {
      this.email = localStorage.getItem('ultimoemail')
    }

    //console.log(this.$q.platform.is)
  },

  methods: {
    setCredentials(data) {
      this.$store.commit('setUser', data.user)
      this.$store.commit('setToken', data.token)
      this.$store.commit('setAccesos', data.accesos)
      this.$store.commit('setCentros', data.centros)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('accesos', JSON.stringify(data.accesos))
      localStorage.setItem('centros', JSON.stringify(data.centros))
    },
    onSubmit() {
      this.loading = true
      var url = process.env.API_URL + '/login'

      console.log({ plattform: this.$q.platform })

      if (!this.$store.getters.online && this.$q.platform.is.mobile) {
        let userRep = getRepository('User')
        userRep
          .find({ email: this.email, password: this.password })
          .then(users => {
            if (users && users.length > 0) {
              let user = users[0]
              let dataObj = JSON.parse(user.data)
              this.setCredentials(dataObj)
              this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fas fa-check-circle',
                message: 'Bienvenido a Competencias para ganar',
                position: 'top',
                timeout: 2000,
              })
              if (!this.$store.getters.online && this.$q.platform.is.mobile ) {
                console.log('Notify sync has started!')
                this.$emit('start-sync')
              }
              this.loading = false
              this.$router.push({
                name: 'dashboard',
              })
            }
          })
          .catch(error => {
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: 'Usuario no encontrado',
            })
            console.error({ error })
            this.loading = false
          })
      } else {
        axios
          .post(url, { email: this.email, password: this.password })
          .then(response => {
            if (!response.data.result) {
              this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'fas fa-exclamation-triangle',
                message: response.data.message,
              })
              this.loading = false
              return
            }
            if (!this.$store.getters.online && this.$q.platform.is.mobile) {
              let userRep = getRepository('User')
              let user = {
                email: this.email,
                password: this.password,
                data: JSON.stringify(response.data),
              }
              let dis = this
              userRep
                .findOne({ email: this.email, password: this.password })

                .then(foundUser => {
                  console.log('Found user', foundUser)
                  foundUser.password = dis.password

                  userRep.save(foundUser)
                  this.loading = false
                })
                .catch(error => {
                  console.error('Error', error)
                  userRep.save(user)
                  this.loading = false
                })

              console.log('Notify sync has started!')
              this.$emit('start-sync')
            }
            localStorage.setItem('ultimoemail', this.email)

            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: 'Bienvenido a Competencias para ganar',
              position: 'top',
              timeout: 2000,
            })
            this.setCredentials(response.data)
            this.loading = false

            this.$router.push({
              name: 'dashboard',
            })
          })
          .catch(error => {
            console.error('Error login in', { error })
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: error.response.data.message,
            })
            this.loading = false
          })
      }
    },
  },
}
</script>
<style>
.imagen-logo {
  width: 50%;
  justify-content: center;
  display: flex;
  margin: auto;
}

.login-card {
  margin-top: 20px;
  border: 1px solid white;
  border-radius: 10px;
  padding: 40px;
  margin-top: 5%;
}

.container-logo-numu {
  display: flex;
  bottom: 0;
  margin-top: 60px;
  justify-content: center;
  width: 100%;
}

.logo-numu {
  width: 7%;
}

@media (max-width: 1024px) {
  .imagen-logo {
    width: 60% !important;
  }

  .logo {
    width: 50% !important;
    margin: auto;
    margin-top: 15px;
  }

  .mobile-centered {
    display: flex;
    justify-content: center;
  }
  .logo-numu {
    width: 20%;
  }
  .container-logo-numu {
    display: flex;
    bottom: 0;
    margin-top: 0px !important;
    justify-content: center;
    width: 100%;
  }

  .olvidaste-contrasenia {
    text-align: center;
  }
}
</style>
