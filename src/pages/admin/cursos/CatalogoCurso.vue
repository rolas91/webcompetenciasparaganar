<template>
  <q-page v-cloak>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="bg-blue-background text-white q-gutter-sm">
          <h5 class="page-title">
            {{
              readonly ? 'Ver Curso' : nuevo ? 'Nuevo Curso' : 'Editar Curso'
            }}
          </h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form @submit="onSubmit" class>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="curso.nombre"
                  label="Nombre"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 500) ||
                      'Ingrese un Nombre válido',
                  ]"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div v-if="id_rol === 1 || id_rol === 2" class="col-12 col-md-4">
                <q-select
                  :readonly="readonly || id_rol === 4"
                  v-model="curso.id_centro"
                  use-input
                  input-debounce="200"
                  label="Centro"
                  :options="centros"
                  @filter="filtrarCentros"
                  :loading="loadingCentros"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Centro válido']"
                  option-value="id"
                  option-label="nombre"
                  hide-selected
                  fill-input
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

              <div
                class="col-12 col-md-4"
                :class="id_rol === 1 || id_rol === 2 ? 'col-md-4' : 'col-md-6'"
              >
                <q-select
                  :readonly="readonly"
                  v-model="curso.id_tipo"
                  label="Tipo"
                  :options="tipos"
                  :loading="loadingTipos"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Tipo válido']"
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

              <div
                class="col-12 col-md-4"
                :class="id_rol === 1 || id_rol === 2 ? 'col-md-4' : 'col-md-6'"
              >
                <q-select
                  :readonly="readonly"
                  v-model="curso.id_sector"
                  label="Sector"
                  :options="sectores"
                  :loading="loadingSectores"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un sector válido']"
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
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <label>Descripcion</label>
                <q-editor
                  :readonly="readonly"
                  color="primary"
                  min-height="15rem"
                  v-model="curso.descripcion"
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                      'subscript',
                      'superscript',
                    ],
                    ['token', 'hr', 'link', 'custom_btn'],
                    [, 'fullscreen'],
                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: [
                          'p',
                          'h1',
                          'h2',
                          'h3',
                          'h4',
                          'h5',
                          'h6',
                          'code',
                        ],
                      },
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },

                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                />
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <label>Competencias Adquiridas</label>
                <q-editor
                  :readonly="readonly"
                  color="primary"
                  min-height="15rem"
                  v-model="curso.competencias_adquiridas"
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                      'subscript',
                      'superscript',
                    ],
                    ['token', 'hr', 'link', 'custom_btn'],
                    [, 'fullscreen'],
                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: [
                          'p',
                          'h1',
                          'h2',
                          'h3',
                          'h4',
                          'h5',
                          'h6',
                          'code',
                        ],
                      },
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },

                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-input
                      :readonly="readonly"
                      v-model="curso.duracion"
                      type="number"
                      label="Duracion"
                      lazy-rules
                      :rules="[
                        val => (val && val > 0) || 'Ingrese un Duracion válido',
                      ]"
                    ></q-input>
                  </div>

                  <div class="col-6">
                    <q-select
                      v-model="curso.id_unidad_duracion"
                      label="Unidad duracion"
                      :options="unidad_duraciones"
                      :loading="loadingUnidadDuraciones"
                      lazy-rules
                      :rules="[
                        val => val || 'Ingrese un Unidad Duracion válido',
                      ]"
                      option-value="id"
                      option-label="nombre"
                      emit-value
                      map-options
                      readonly
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
                </div>
              </div>
            </div>

            <br />
            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn
                right
                :icon="readonly ? 'chevron_left' : 'close'"
                @click="Cancelar"
              >
                {{ readonly ? 'Regresar' : 'Cancelar' }}
              </q-btn>
              <q-btn
                v-if="!readonly"
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
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
export default {
  data() {
    return {
      nuevo: true,
      readonly: false,
      allCentros: false,
      curso: {
        id: 0,
        id_centro: 0,
        id_tipo: null,
        id_sector: null,
        nombre: '',
        descripcion: '',
        competencias_adquiridas: '',
        fecha_inicio: moment().format('DD/MM/YYYY'),
        fecha_fin_matricula: moment().format('DD/MM/YYYY'),
        fecha_fin: moment()
          .add(3, 'months')
          .format('DD/MM/YYYY'),
        id_unidad_duracion: 5523,
        duracion: 0,
      },
      loading: false,
      loadingSectores: false,
      loadingCentros: false,
      loadingModos: false,
      loadingTipos: false,
      loadingUnidadDuraciones: false,
      sectores: [],
      centros: [],
      tipos: [],
      unidad_duraciones: [],
    }
  },
  async created() {
    this.loading = true
    if (
      this.$route.name === 'editar_catalogo_curso' &&
      this.$route.params.id !== null
    ) {
      await this.CargarCurso()
      this.nuevo = false
    }

    if (
      this.$route.name === 'ver_catalogo_curso' &&
      this.$route.params.id !== null
    ) {
      this.readonly = true
      await this.CargarCurso()
      this.nuevo = false
    }

    await this.CargarSectores()
    await this.CargarCentros()
    await this.CargarTipos()
    await this.CargarUnidadDuraciones()
    this.loading = false
  },
  methods: {
    Cancelar() {
      this.$router.push({
        path: '/catalogos/cursos',
      })
    },

    CargarCurso() {
      if (this.$route.params.id) {
        var url =
          process.env.API_URL +
          `/catalogos/cursos/${this.$route.params.id}/edit`

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }
        axios({
          method: 'get',
          url: url,
          headers: headers,
        })
          .then(response => {
            this.curso = response.data.catalogo_curso
          })
          .catch(error => {
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

    filtrarCentros(val, update, abort) {
      update(() => {
        this.CargarCentros(val)
      })
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY',true).isValid()
    },

    onSubmit() {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/catalogos/cursos'
      if (!this.nuevo) {
        url = process.env.API_URL + '/catalogos/cursos/' + this.curso.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { curso: this.curso },

        headers: headers,
      })
        .then(response => {
          this.loading = false
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Curso creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })

          this.$router.push({
            path: '/catalogos/cursos',
          })
        })
        .catch(error => {
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

    CargarCentros(filtro = '') {
      this.loadingCentros = true
      var url = process.env.API_URL + '/catalogos/centros'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        filtro: filtro,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then(response => {
          this.centros = response.data.centros
          this.loadingCentros = false
        })
        .catch(error => {
          this.loadingCentros = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarSectores(filtro = '') {
      this.loadingSectores = true
      var url = process.env.API_URL + '/catalogos/sectores'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        filtro: filtro,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then(response => {
          this.sectores = response.data.sectores
          this.loadingSectores = false
        })
        .catch(error => {
          this.loadingSectores = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarDepartamentos() {
      this.loadingDepartamentos = true
      var url = process.env.API_URL + '/catalogos/departamentos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: '',
        id_padre: this.curso.id_pais,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then(response => {
          this.departamentos = response.data.departamentos
          this.loadingDepartamentos = false
        })
        .catch(error => {
          this.loadingDepartamentos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarEstados(filtro = '') {
      this.loadingEstados = true
      var url = process.env.API_URL + '/catalogos/estados_curso'

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
        .then(response => {
          this.estados = response.data.estados_curso
          this.loadingEstados = false
        })
        .catch(error => {
          this.loadingEstados = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarMunicipios(filtro = '', resetearValor = false) {
      this.loadingMunicipios = true
      var url = process.env.API_URL + '/catalogos/municipios'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      if (resetearValor) {
        this.curso.id_municipio = null
      }

      var params = {
        q: filtro,
        id_padre:
          this.curso.id_departamento !== null ? this.curso.id_departamento : '',
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then(response => {
          this.municipios = response.data.municipios
          this.loadingMunicipios = false
        })
        .catch(error => {
          this.loadingMunicipios = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarModalidades(filtro = '') {
      this.loadingModalidades = true
      var url = process.env.API_URL + '/catalogos/modalidades'

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
        .then(response => {
          this.modalidades = response.data.modalidades
          this.loadingModalidades = false
        })
        .catch(error => {
          this.loadingModalidades = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarModos(filtro = '') {
      this.loadingModalidades = true
      var url = process.env.API_URL + '/catalogos/modos'

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
        .then(response => {
          this.modos = response.data.modos
          this.loadingModalidades = false
        })
        .catch(error => {
          this.loadingModos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarPaises(filtro = '') {
      this.loadingPaises = true
      var url = process.env.API_URL + '/catalogos/paises'

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
        .then(response => {
          this.paises = response.data.paises
          this.loadingPaises = false
        })
        .catch(error => {
          this.loadingPaises = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarSubcategorias(filtro = '', resetearValor = false) {
      this.loadingSubcategorias = true
      var url = process.env.API_URL + '/catalogos/subcategorias'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      if (resetearValor) {
        this.curso.id_subcategoria = null
      }

      var params = {
        q: filtro,
        id_padre:
          this.curso.id_categoria !== null ? this.curso.id_categoria : '',
      }

      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then(response => {
          this.subcategorias = response.data.subcategorias
          this.loadingSubcategorias = false
        })
        .catch(error => {
          this.loadingSubcategorias = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarTipos(filtro = '') {
      this.loadingTipos = true
      var url = process.env.API_URL + '/catalogos/tipoCursos'

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
        .then(response => {
          this.tipos = response.data.tipo_cursos
          this.loadingTipos = false
        })
        .catch(error => {
          this.loadingTipos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarUnidadDuraciones(filtro = '') {
      this.loadingUnidadDuraciones = true
      var url = process.env.API_URL + '/catalogos/unidad_duraciones'

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
        .then(response => {
          this.unidad_duraciones = response.data.unidad_duraciones
          this.loadingUnidadDuraciones = false
        })
        .catch(error => {
          this.loadingUnidadDuraciones = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
  },

  computed: {
    id_rol() {
      return Number(this.$store.state.user.rol)
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
