<template>
  <q-page v-cloak>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="bg-blue-background text-white q-gutter-sm">
          <h5 class="page-title">
            {{ nuevo ? 'Nuevo ' : 'Editar ' }} Participante
          </h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form @submit="onSubmit" class>
            <h5>Datos Personales</h5>
            <div class="row q-col-gutter-md">
              <label>Foto</label>
              <div class="col-12">
                <!-- <transition
                  appear
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                >
                <div>-->
                <q-img
                  :src="
                    participante !== undefined &&
                    participante.foto &&
                    participante.foto.length > 0
                      ? participante.foto
                      : emptyUrl
                  "
                  spinner-color="white"
                  contain
                  class="imagen"
                  @click="openFile()"
                />
                <div class="center-mobile">
                  <q-btn
                    :disable="readonly"
                    v-if="
                      participante !== undefined &&
                      participante.foto &&
                      participante.foto.length > 0
                    "
                    class="btn-delete-image"
                    icon="delete_forever"
                    @click="deleteImage"
                    color="red"
                  ></q-btn>
                </div>

                <q-btn
                  :disable="readonly"
                  class="bg-primary text-white openFile"
                  @click="openFile()"
                >
                  Seleccionar
                </q-btn>
                <!-- </div>
                </transition>-->

                <!-- <q-inner-loading :showing="loading">
                  <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>-->
                <q-uploader
                  :readonly="readonly"
                  ref="uploader"
                  v-show="false"
                  v-model="participante.foto"
                  label="Foto"
                  :url="imageUrl"
                  style="max-width: 300px;"
                  @added="previewImage"
                  @removed="RemoveFile"
                  field-name="imagen"
                  hide-upload-btn
                  no-thumbnails
                  accept=".jpg, image/*"
                ></q-uploader>
              </div>
            </div>

            <br />
            <div class="row">
              <div class="col-12 col-md-4">
                <q-toggle
                :disable="readonly"
                  v-model="participante.menor_edad"
                  :label="
                    participante.menor_edad
                      ? 'Es menor de edad'
                      : 'Es mayor de edad'
                  "
                  icon="fas fa-baby"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.nombres"
                  label="Nombres"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val.length < 50) ||
                      'Ingrese un Nombres válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.apellidos"
                  label="Apellidos"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val.length < 50) ||
                      'Ingrese un Apellidos válido',
                  ]"
                ></q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.documento_identidad"
                  label="Documento Identidad"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.correo"
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

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.telefono"
                  label="Teléfono"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingrese un Teléfono válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  :readonly="readonly"
                  bg-color="white"
                  v-model="participante.sexo"
                  label="Sexo"
                  :options="tipo_sexo"
                  lazy-rules
                  emit-value
                  map-options
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Seleccione el sexo del participante',
                  ]"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  label="Fecha Nacimiento"
                  v-model="participante.fecha_nacimiento"
                  lazy-rules
                  :rules="[
                    (val) =>
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
                          v-model="participante.fecha_nacimiento"
                          @input="() => $refs.qDateProxyFechaNacimiento.hide()"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Ingrese una fecha de nacimiento válida',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div v-show="false" class="col-12 col-md-4">
                <q-select
                  v-model="participante.id_pais"
                  label="Pais"
                  :options="paises"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Pais válido']"
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
                  :readonly="readonly"
                  v-model="participante.id_departamento"
                  label="Departamento"
                  :options="departamentos"
                  :loading="loadingDepartamentos"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Departamento válido']"
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
                  :readonly="readonly"
                  v-model="participante.id_ciudad"
                  label="Municipio"
                  :options="municipios"
                  :loading="loadingmunicipios"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un municipio válido']"
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
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.direccion"
                  label="Dirección"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val.length < 255) ||
                      'Ingrese un Dirección válido',
                  ]"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <h5>Información académica</h5>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  :readonly="readonly"
                  v-model="participante.id_nivel_educacion"
                  label="Nivel educacion"
                  :options="nivel_educaciones"
                  :loading="loadingNivelEducaciones"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Nivel Educación válido']"
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

              <div class="col-12 col-md-3">
                <q-toggle
                :disable="readonly"
                  v-model="participante.estudiando"
                  :label="
                    participante.estudiando
                      ? 'Actualmente estudiando'
                      : 'Actualmente no estudiando'
                  "
                  icon="fas fa-graduation-cap"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  :readonly="readonly"
                  v-if="participante.estudiando"
                  color="primary"
                  v-model="participante.curso_estudiando"
                  label="Curso Estudiando"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <h5>Información laboral</h5>
              </div>
              <div class="col-12 col-md-4">
                <q-toggle
                :disable="readonly"
                  v-model="participante.trabajando"
                  :label="
                    participante.trabajando
                      ? 'Actualmente Trabajando'
                      : 'Actualmente Desempleado'
                  "
                  icon="fas fa-briefcase"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  v-if="participante.trabajando"
                  color="primary"
                  v-model="participante.lugar_trabajo"
                  label="Lugar Trabajo"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  v-if="participante.trabajando"
                  v-model="participante.salario"
                  type="number"
                  label="Salario"
                  lazy-rules
                  :rules="[
                    (val) => (val && val > 0) || 'Ingrese un Salario válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md" v-if="participante.menor_edad">
              <div class="col-12">
                <h5>Datos referencia (Opcional)</h5>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  :readonly="readonly"
                  v-model="participante.id_parentezco"
                  label="Parentesco"
                  :options="parentescos"
                  :loading="loadingparentescos"
                  lazy-rules
                  :rules="[
                    (val) => val || 'Ingrese un Nivel parentesco válido',
                  ]"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  clearable
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
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.referencia_nombre"
                  label="Nombre Completo"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.referencia_cedula"
                  label="Cédula"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && cedulaRegex.test(val)) ||
                      !val ||
                      'Ingrese una cédula válida',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="participante.referencia_telefono"
                  label="Teléfono"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-if="participante.menor_edad"
                  color="primary"
                  v-model="participante.referencia_correo"
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

            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn right icon="close" @click="Cancelar">Cancelar</q-btn>
              <q-btn
                v-if="! readonly"
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
  name: 'Participante',

  data() {
    return {
      nuevo: true,
      initializing: true,
      readonly: false,
      cedulaRegex: new RegExp(/^\d{3}-?\d{6}-?\d{4}[a-zA-Z]{1}$/),
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      phoneRegex: new RegExp(/^[\s.-]?\(?\d{4}\)?[\s.-]?\d{4}$/),
      emptyUrl: process.env.IMAGE_URL + '/placeholder.jpg',
      imageUrl: process.env.API_URL + '/admin/participantes/uploadImage',
      participante: {
        id: 0,
        foto: null,
        nombres: '',
        apellidos: '',
        telefono: '',
        correo: '',
        id_tipo_identificacion: null,
        documento_identidad: '',
        menor_edad: false,
        fecha_nacimiento: null,
        id_estado_civil: null,
        sexo: '',
        id_pais: 1438,
        id_departamento: null,
        id_ciudad: null,
        direccion: '',
        id_nivel_educacion: null,
        estudiando: false,
        curso_estudiando: '',
        trabajando: false,
        lugar_trabajo: '',
        salario: 0.0,
        referencia_nombre: '',
        id_parentezco: null,
        referencia_cedula: '',
        referencia_telefono: '',
        referencia_correo: '',
      },
      participantes: [],
      municipios: [],
      departamentos: [],
      estado_civiles: [],
      nivel_educaciones: [],
      paises: [],
      tipo_identificaciones: [],
      instructores: [],
      parentescos: [],
      loadingmunicipios: false,
      loadingDepartamentos: false,
      loadingEstadoCiviles: false,
      loadingNivelEducaciones: false,
      loadingPaises: false,
      loadingTipoIdentificaciones: false,
      loadingparentescos: false,
      loading: false,
      tipo_sexo: [
        { value: 'F', label: 'Femenino' },
        { value: 'M', label: 'Masculino' },
      ],
    }
  },
  async created() {
    this.loading = true
    this.initializing = true
    if (
      (this.$route.name === 'editar_participante' ||
        this.$route.name === 'ver_participante') &&
      this.$route.params.id
    ) {
      this.nuevo = false
      this.readonly = this.$route.name === 'ver_participante'

      await this.cargarparticipante()
    }

    await this.CargarPaises()
    await this.CargarDepartamentos()
    await this.CargarEstadoCiviles()
    await this.CargarNivelEducaciones()
    await this.CargarTipoIdentificaciones()
    await this.CargarParentescos()

    this.loading = false
    this.initializing = false
  },

  methods: {
    Cancelar() {
      this.$router.push({
        path: '/admin/participantes',
      })
    },

    uploadFile() {
      let fd = new FormData()
      fd.append('imagen', this.$refs.uploader.files[0])
      fd.append('participante', JSON.stringify(this.participante))
      axios
        .post(this.imageUrl, fd, {
          headers: {
            'Content-Type': undefined,
            Authorization: 'Bearer ' + this.$store.state.token,
          },
        })
        .then(function (response) {
          if (response.data.ok) {
            this.participante.foto =
              process.env.IMAGE_URL +
              '/participantes/fotos/' +
              response.data.urlFoto

            return true
          }
        })
        .catch((error) => {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data.message,
          })
          return false
        })
    },

    RemoveFile() {
      this.$refs.uploader.reset()
    },

    deleteImage() {
      this.RemoveFile()
      this.participante.foto = null
    },

    previewImage() {
      this.participante.foto = URL.createObjectURL(this.$refs.uploader.files[0])
    },

    openFile() {
      this.$refs.uploader.reset()
      setTimeout(() => {
        this.$refs.uploader.pickFiles()
      }, 0)
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },
    onSubmit() {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/participantes'
      if (!this.nuevo) {
        url =
          process.env.API_URL + '/admin/participantes/' + this.participante.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { participante: this.participante },

        headers: headers,
      })
        .then((response) => {
          if (response.data.result) {
            this.participante.id = response.data.participante.id
            let fotoOk = this.uploadFile()
            if (fotoOk) {
              this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fas fa-check-circle',
                message: 'Participante creado correctamente',
                position: 'bottom',
                timeout: 2000,
              })
            }
          }

          this.$router.push({
            path: '/admin/participantes',
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

    cargarparticipante() {
      this.loading = true
      var url =
        process.env.API_URL +
        `/admin/participantes/${this.$route.params.id}/edit`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then((response) => {
          this.participante = response.data.participante

          this.participante.foto = response.data.participante.foto
            ? process.env.IMAGE_URL +
              '/participantes/fotos/' +
              response.data.participante.foto
            : ''

          this.CargarMunicipios()
          this.CargarParentescos()
        })
        .catch((error) => {
          this.loadingparticipantes = false

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
        this.participante.id_ciudad = null
      }

      this.loadingmunicipios = true
      var url = process.env.API_URL + '/catalogos/municipios'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
        id_padre:
          this.participante.id_departamento !== null
            ? this.participante.id_departamento
            : '',
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then((response) => {
          this.municipios = response.data.municipios
          this.loadingmunicipios = false
        })
        .catch((error) => {
          this.loadingmunicipios = false

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
        id_padre: this.participante.id_pais,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then((response) => {
          this.departamentos = response.data.departamentos
          this.loadingDepartamentos = false
        })
        .catch((error) => {
          this.loadingDepartamentos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarEstadoCiviles(filtro = '') {
      this.loadingEstadoCiviles = true
      var url = process.env.API_URL + '/catalogos/estado_civiles'

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
          this.estado_civiles = response.data.estado_civiles
          this.loadingEstadoCiviles = false
        })
        .catch((error) => {
          this.loadingEstadoCiviles = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarNivelEducaciones(filtro = '') {
      this.loadingNivelEducaciones = true
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
        .then((response) => {
          this.nivel_educaciones = response.data.nivel_academicos
          this.loadingNivelEducaciones = false
        })
        .catch((error) => {
          this.loadingNivelEducaciones = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarParentescos(filtro = '') {
      this.loadingparentescos = true
      var url = process.env.API_URL + '/catalogos/parentescos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
        loadAll: true,
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.parentescos = response.data.parentescos
          this.loadingparentescos = false
        })
        .catch((error) => {
          this.loadingparentescos = false

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
        .then((response) => {
          this.paises = response.data.paises
          this.loadingPaises = false
        })
        .catch((error) => {
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
        .then((response) => {
          this.tipo_identificaciones = response.data.tipo_identificaciones
          this.loadingTipoIdentificaciones = false
        })
        .catch((error) => {
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
}
</script>

<style>
.imagen {
  height: 140px;
  max-width: 300px;
  background-size: cover;
  background-position: center !important;
  cursor: pointer;
  border: 1px dashed black;
}

.bg-blue-background {
  background-color: #027be3;
}

.btn-delete-image {
  margin-top: 5px;
  width: 300px;
}

.center-mobile {
  display: flex;
  justify-content: center;
  width: 300px;
}

.openFile {
  width: 300px;
  margin-top: 10px;
}

@media (max-width: 600px) {
  .btn-delete-image {
    left: -20px;
    width: 150px;
  }

  .openFile {
    width: 250px;
    margin-top: 10px;
  }
}

.bg-blue-background {
  background-color: #027be3;
}

h5 {
  margin: 0;
}
</style>
