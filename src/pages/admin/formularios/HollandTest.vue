<template>
  <q-page v-cloak>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="bg-blue-background text-white q-gutter-sm">
          <h5 class="page-title">
            {{
              nuevo
                ? 'Nuevo test de personalidad'
                : 'Editar test de personalidad'
            }}
          </h5>
        </q-card-section>
        <q-separator />

        <q-form @submit="onSubmit" class>
          <q-card-section>
            <div class="row q-col-gutter-md">
                   <div class="col-12 col-md-4">
                <q-select

                  v-model="holland_test.nombre"
                  label="Seleccione el curso"
                  :options="cursos"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options

                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados disponibles
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  label="Fecha Inicio"
                  v-model="holland_test.fecha_inicio"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val &&
                        isValidDate(val) &&
                        /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                      'Ingrese un Fecha Inicio válido',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxyFechaInicio"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          mask="DD/MM/YYYY"
                          v-model="holland_test.fecha_inicio"
                          @input="() => $refs.qDateProxyFechaInicio.hide()"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Ingrese un FechaInicio válido',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  label="Fecha Fin"
                  v-model="holland_test.fecha_fin"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val &&
                        isValidDate(val) &&
                        /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                      'Ingrese un Fecha Fin válido',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxyFechaFin"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          mask="DD/MM/YYYY"
                          v-model="holland_test.fecha_fin"
                          @input="() => $refs.qDateProxyFechaFin.hide()"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Ingrese un FechaFin válido',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn right icon="close" @click="Cancelar">Cancelar</q-btn>
              <q-btn
                :loading="loading"
                :disable="loading"
                right
                class="bg-primary text-white"
                type="submit"
                icon="save"
              >
                Guardar
              </q-btn>
            </q-card-actions>
          </q-card-section>
        </q-form>
   <!--     <q-separator></q-separator>
        <div v-if="$store.state.user.rol <= 2" class="row q-col-gutter-lg">
          <div class="col-12">
            <label v-if="$store.state.user.rol <= 2" class="q-pa-md">
              Centros
            </label>
          </div>
          <div class="col-12">
            <q-list dense padding style="background-color: white;">
              <q-item-label header>
                <q-checkbox v-model="allCentros" @input="selectAllCentros" />
                Todos
              </q-item-label>

              <q-item
                v-ripple
                tag="label"
                v-for="option in centros"
                :key="option.nombre"
              >
                <q-item-section side top>
                  <q-checkbox v-model="option.checked" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ option.nombre }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div> -->
      </q-card>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data() {
    return {
      confirm: false,
      nuevo: true,
      selected: [],
      allCentros: false,
      centros: [],
      cursos:[],
      loadingCentros: false,
      visibleColumns: [
        'id',
        'nombre',
        'id_centro',
        'fecha_inicio',
        'fecha_fin',
        'usuario_creacion',
        'id_curso',
      ],
      holland_test: {
        id: 0,
        nombre: '',
        fecha_inicio: null,
        fecha_fin: null,
        usuario_creacion: 0,
      },
      holland_tests: [],

      loading: false,

      modalOpen: false,
      loadingTable: false,
      filtro: '',
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: (row) => row.id,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'nombre',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: (row) => row.nombre,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'fecha_inicio',
          required: true,
          label: 'FechaInicio',
          align: 'left',
          field: (row) => row.fecha_inicio,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'fecha_fin',
          required: true,
          label: 'FechaFin',
          align: 'left',
          field: (row) => row.fecha_fin,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'usuario_creacion',
          required: true,
          label: 'UsuarioCreacion',
          align: 'left',
          field: (row) => row.usuario_creacion,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true

    console.log(this.$route.name)

    if (this.$route.name === 'holland-editar') {
      this.nuevo = false
      await this.CargarHollandTest()
      await this.CargarCentros()
    }

    this.CargarCursos()

    this.loading = false
  },
  methods: {

CargarCursos() {


      if (!this.$store.getters.online && this.$q.platform.is.mobile) {
        let centroRepository = getRepository('Centro')
        centroRepository
          .findOne(this.participante.id_centro, { relations: ['cursos'] })
          .then(centro => {
            this.cursos = centro.cursos

            // Esta asignacion indica que cuando está offline
            // this.formulario is undefined
            this.participante.id_curso = null
          })
          .catch(error => {
            console.error('Error finding centro', error)
            this.cursos = null
            // Esta asignacion indica que cuando está offline
            // this.formulario is undefined
            this.participante.id_curso = null
          })
      } else {
        var url = process.env.API_URL + '/admin/catalogos/cursos'

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }

        axios({
          method: 'get',
          url: url,
          headers: headers,
        })
          .then(response => {
            this.cursos = response.data.cursos
            this.participante.id_curso = null
          })
          .catch(error => {
            console.log({ error })

            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },


    selectAllCentros() {
      this.centros.forEach((val, index, arr) => {
        arr[index].checked = this.allCentros
      })
    },

    CargarCentros(filtro = '') {
      this.loadingCentros = true
      var url = process.env.API_URL + '/catalogos/holland-tests-centros'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then((response) => {
          this.centros = response.data.centros
          this.centros.forEach((item, index, arr) => {
            if (item.checked === 0) {
              arr[index].checked = false
            }
          })
          this.loadingCentros = false
        })
        .catch((error) => {
          this.loadingCentros = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    Cancelar() {
      this.$router.push({
        path: '/formularios/test-holland',
      })
    },
    async editarHollandTest() {
      this.nuevo = false
      Object.keys(this.selected[0]).forEach((key) => {
        if (this.holland_test.hasOwnProperty(key)) {
          this.holland_test[key] = this.selected[0][key]
        }
      })
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },
    CargarHollandTest() {
      if (this.$route.params.idTest) {
        var url =
          process.env.API_URL +
          `/formularios/test-holland/${this.$route.params.idTest}/edit`

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }
        axios({
          method: 'get',
          url: url,
          headers: headers,
        })
          .then((response) => {
            this.holland_test = response.data.holland_test
          })
          .catch((error) => {
            this.loading = false

            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },
    onSubmit() {
      this.loading = true
      var method = 'post'

      //Validamos que el curso haya sido seleccionado.

      if (this.holland_test.nombre === ''){
         this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: "Selecciona un curso",
          });
          this.loading = false;
        return;
      }

      var url = process.env.API_URL + '/formularios/test-holland/store'
      if (!this.nuevo) {
        url =
          process.env.API_URL +
          '/formularios/test-holland/update/' +
          this.holland_test.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { holland_test: this.holland_test },

        headers: headers,
      })
        .then((response) => {

          if(response.data.result ===false){
            this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: response.data.message,
          })
            this.loading=false
            return;
          }

          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'HollandTest creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })

          this.$router.push({
            path: '/formularios/test-holland',
          })
        })
        .catch((error) => {
          this.loading = false
          console.log({error})
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data,
          })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
  },
}
</script>

<style>
.page-title {
  margin: 10px;
}

.bg-blue-background {
  background-color: #027be3;
}
</style>
