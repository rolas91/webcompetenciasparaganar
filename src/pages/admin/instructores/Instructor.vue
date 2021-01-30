<template>
  <q-page v-cloak>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="bg-blue-background text-white q-gutter-sm">
          <h5 class="page-title">
            {{ nuevo ? 'Nuevo ' : 'Editar ' }} Instructor
          </h5>
        </q-card-section>
        <q-separator />

        <q-card-section class="bg-grey-2">
          <q-form @submit="onSubmit" class>
            <div v-if="nuevo" class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-toggle
                  v-model="instructor.nuevo_usuario"
                  :label="
                    instructor.nuevo_usuario
                      ? 'Nuevo usuario'
                      : 'Selecccionar usuario existente'
                  "
                  icon="person"
                />
              </div>
              <div v-if="!instructor.nuevo_usuario" class="col-12 col-md-8">
                <q-select
                  bg-color="white"
                  v-model="instructor.id_usuario"
                  use-input
                  input-debounce="200"
                  label="Usuario"
                  :options="usuarios"
                  @filter="filtrarUsuarios"
                  :loading="loadingUsuarios"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un usuario válido']"
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
            </div>
            <div
              v-if="nuevo && instructor.nuevo_usuario"
              class="row q-col-gutter-md"
            >
              <label>Datos de la cuenta</label>
            </div>

            <div
              v-if="nuevo && instructor.nuevo_usuario"
              class="row q-col-gutter-md"
            >
              <div class="col-12">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.correo"
                  label="Correo"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && emailRegex.test(val)) ||
                      'Ingrese un correo válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <label>Datos personales</label>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.documento_identidad"
                  label="Documento Identidad"
                  mask="###-######-####A"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 30) ||
                      'Ingresa una cédula válida con el formato: ###-######-####X',
                  ]"
                ></q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.nombres"
                  label="Nombres"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 50) ||
                      'Ingrese un Nombres válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.apellidos"
                  label="Apellidos"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 50) ||
                      'Ingrese un Apellidos válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  bg-color="white"
                  v-model="instructor.id_pais"
                  label="Pais"
                  :options="paises"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Pais válido']"
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

              <div class="col-12 col-md-4">
                <q-select
                  bg-color="white"
                  v-model="instructor.id_departamento"
                  label="Departamento"
                  :options="departamentos"
                  :loading="loadingDepartamentos"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Departamento válido']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="CargarMunicipios('', true)"
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
                <q-select
                  bg-color="white"
                  v-model="instructor.id_municipio"
                  label="Municipio"
                  :options="municipios"
                  :loading="loadingMunicipios"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Municipio válido']"
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
              <div class="col-12 col-md-4">
                <q-select
                  bg-color="white"
                  v-model="instructor.sexo"
                  label="Sexo"
                  :options="tipo_sexo"
                  lazy-rules
                  emit-value
                  map-options
                  :rules="[
                    val =>
                      (val && val.length > 0) ||
                      'Seleccione el sexo del instructor',
                  ]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  bg-color="white"
                  v-model="instructor.id_nivel_academico"
                  label="Nivel académico"
                  :options="nivel_academicos"
                  :loading="loadingNivelAcademicos"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Nivel Academico válido']"
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
                  bg-color="white"
                  color="primary"
                  v-model="instructor.ocupacion"
                  label="Ocupación"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 50) ||
                      'Ingrese un ocupación válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.telefono_1"
                  label="Teléfono Claro"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingrese un número de telefono válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.telefono_2"
                  label="Teléfono Movistar"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingrese un número de telefono válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.telefono_otro"
                  label="Otro Teléfono"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingrese un número de telefono válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-12">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.direccion"
                  label="Dirección"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 255) ||
                      'Ingrese un Dirección válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  label="Fecha Nacimiento"
                  v-model="instructor.fecha_nacimiento"
                  lazy-rules
                  :rules="[
                    val =>
                      (val &&
                        isValidDate(val) &&
                        /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                      'Ingrese una Fecha Nacimiento válida',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxyFechaNacimiento"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          mask="DD/MM/YYYY"
                          v-model="instructor.fecha_nacimiento"
                          @input="() => $refs.qDateProxyFechaNacimiento.hide()"
                          lazy-rules
                          :rules="[
                            val =>
                              (val && val.length > 0) ||
                              'Ingrese un FechaNacimiento válido',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  v-model="instructor.anios_experiencia"
                  type="number"
                  label="Años de experiencia"
                  lazy-rules
                  :rules="[
                    val =>
                      (val >= 0 && val <= 100) ||
                      'Ingrese los experiencia (Un número entre 0 y 100)',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="instructor.especialidad"
                  label="Especialidad"
                ></q-input>
              </div>
            </div>
            <!-- <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  v-model="instructor.calificacion"
                  type="number"
                  label="Calificacion"
                  :readonly="id_rol !== 1"
                  lazy-rules
                  :rules="[
                    val =>
                      (val >= 0 && val <= 100) ||
                      'Ingrese un Calificacion válida (Un número entre 0 y 100)',
                  ]"
                ></q-input>
              </div>
            </div> -->

            <div v-if="id_rol === 1 || id_rol === 2">
              <label>Centros</label>
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-4">
                  <q-list dense padding style="background-color:white">
                    <q-item-label header>
                      <q-checkbox
                        v-model="allCentros"
                        @input="selectAllCentros"
                      />
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
              </div>
            </div>
            <br />
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
          </q-form>
        </q-card-section>
        <!-- <q-separator></q-separator> -->
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
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      phoneRegex: new RegExp(/^[\s.-]?\(?\d{4}\)?[\s.-]?\d{4}$/),
      nuevo: true,
      allCentros: false,
      instructor: {
        id: 0,
        id_centro: 0,
        id_usuario: 0,
        nombres: '',
        apellidos: '',
        telefono_1: '',
        telefono_2: '',
        telefono_otro: '',
        id_pais: 1438,
        id_departamento: null,
        id_municipio: null,
        sexo: '',
        direccion: '',
        fecha_nacimiento: moment()
          .subtract(30, 'years')
          .format('DD/MM/YYYY'),
        id_tipo_identificacion: '',
        documento_identidad: '',
        anios_experiencia: 0,
        especialidad: '',
        calificacion: 0,
        id_nivel_academico: '',
        nuevo_usuario: true,
        correo: '',
      },
      loading: false,
      loadingCentros: false,
      loadingDepartamentos: false,
      loadingMunicipios: false,
      loadingNivelAcademicos: false,
      loadingPaises: false,
      loadingTipoIdentificaciones: false,
      loadingUsuarios: false,
      centros: [],
      departamentos: [],
      municipios: [],
      nivel_academicos: [],
      paises: [],
      tipo_identificaciones: [],
      tipo_sexo: [
        { value: 'F', label: 'Femenino' },
        { value: 'M', label: 'Masculino' },
      ],
      usuarios: [],
    }
  },
  async created() {
    this.loading = true
    await this.CargarCentros()
    if (this.$route.name === 'editar_instructor' && this.$route.params.id) {
      this.nuevo = false
      await this.Cargarinstructor()
    } else {
      this.nuevo = true
      // si es nuevo
      try {
        this.instructor.id_departamento = this.$store.state.departamento.id
        this.instructor.id_municipio = this.$store.state.municipio.id
      } catch (error) {}
    }
    await this.CargarUsuarios()
    await this.CargarTipoIdentificaciones()
    await this.CargarNivelAcademicos()
    await this.CargarPaises()
    await this.CargarDepartamentos('', false)
    await this.CargarMunicipios()

    this.loading = false
    // si es editar cargamos los datos del centro
  },
  methods: {
    selectAllCentros() {
      this.centros.forEach((val, index, arr) => {
        arr[index].checked = this.allCentros
      })
    },
    Cancelar() {
      this.$router.push({
        path: '/admin/instructores',
      })
    },

    Cargarinstructor() {
      if (this.$route.params.id) {
        this.loading = true
        this.visible = true
        var url =
          process.env.API_URL +
          `/admin/instructores/${this.$route.params.id}/edit`

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }
        axios({
          method: 'get',
          url: url,
          headers: headers,
        })
          .then(response => {
            this.instructor = response.data.instructore
            this.centros = response.data.centros
            this.centros.forEach((item, index, arr) => {
              if (item.checked === 0) {
                arr[index].checked = false
              }
            })
            this.loading = false
            this.visible = false
            this.CargarMunicipios()
          })
          .catch(error => {
            this.loading = false
            this.visible = false

            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },

    filtrarinstructores(val, update, abort) {
      update(() => {
        this.Cargarinstructores(val)
      })
    },

    filtrarUsuarios(val, update, abort) {
      update(() => {
        this.CargarUsuarios(val)
      })
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY',true).isValid()
    },

    InstructorTieneCentro() {
      // Aqui validamos que si somos usuarios administradores es necesario seleccionar un centro ,
      // ya que podemos verlos todos, pero si es tipo centro unicamente puede agregar instructores del propio centro por lo que se omite esta validacion

      if(!(this.id_rol ==1 || this.id_rol ==2)){
        return true
      }

      return this.centros.filter(i => i.checked).length > 0

    },
    onSubmit() {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/instructores'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/instructores/' + this.instructor.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

console.log("tieneCentro",this.InstructorTieneCentro())
      if (this.InstructorTieneCentro() == false) {
        this.loading = false
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'Debe seleccionar al menos un centro de estudio',
        })
        return
      }

      axios({
        method: method,
        url: url,
        data: { instructore: this.instructor, centros: this.centros },

        headers: headers,
      })
        .then(response => {
          this.loading = false
          if (response.data.result) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: this.nuevo
                ? 'Instructor creado correctamente'
                : 'Instructor actualizado correctamente',
              position: 'bottom',
              timeout: 2000,
            })

            this.$router.push({
              path: '/admin/instructores',
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
        q: filtro,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then(response => {
          this.centros = response.data.centros
          this.centros.forEach((item, index, arr) => {
            if (item.checked === 0) {
              arr[index].checked = false
            }
          })
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

    CargarUsuarios(filtro = '') {
      this.loadingUsuarios = true
      var url = process.env.API_URL + '/admin/usuarios/disponibles_instructor'

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
          this.usuarios = response.data.usuarios
          this.loadingUsuarios = false
        })
        .catch(error => {
          this.loadingUsuarios = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    CargarDepartamentos(filtro = '', resetearMunicipio = false) {
      this.loadingDepartamentos = true
      var url = process.env.API_URL + '/catalogos/departamentos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
        id_padre:
          this.instructor.id_pais !== null ? this.instructor.id_pais : '',
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
          if (resetearMunicipio) {
            this.instructor.id_municipio = 0
          }
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

    CargarMunicipios(filtro = '', resetValue = false) {
      if (resetValue) {
        this.instructor.id_municipio = null
      }
      this.loadingMunicipios = true
      var url = process.env.API_URL + '/catalogos/municipios'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
        id_padre:
          this.instructor.id_departamento !== null
            ? this.instructor.id_departamento
            : '',
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

    CargarNivelAcademicos(filtro = '') {
      this.loadingNivelAcademicos = true
      var url = process.env.API_URL + '/catalogos/nivel_academicos'

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
          this.nivel_academicos = response.data.nivel_academicos
          this.loadingNivelAcademicos = false
        })
        .catch(error => {
          this.loadingNivelAcademicos = false

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

    CargarTipoIdentificaciones(filtro = '') {
      this.loadingTipoIdentificaciones = true
      var url = process.env.API_URL + '/catalogos/tipo_identificaciones'

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
          this.tipo_identificaciones = response.data.tipo_identificaciones
          this.loadingTipoIdentificaciones = false
        })
        .catch(error => {
          this.loadingTipoIdentificaciones = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
  },
  watch: {
    centros: {
      handler: function(newValue) {
        if (
          this.centros.length ===
          this.centros.filter(item => item.checked).length
        ) {
          this.allCentros = true
        } else if (
          this.centros.length > this.centros.filter(item => item.checked).length
        ) {
          this.allCentros = false
        }
      },
      deep: true,
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
.bg-blue-background {
  background-color: #027be3;
}

h5 {
  margin: 10px 15px;
}
</style>
