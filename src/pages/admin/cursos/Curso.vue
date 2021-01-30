<template>
  <q-page v-cloak>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">{{ pregunta }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="default"
            v-close-popup
            @click="cancelarAcccion"
          />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="ejecutarAccion"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
            <div v-if="id_rol == 1 || id_rol == 2" class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="curso.id_centro"
                  label="Centro"
                  :options="centros"
                  lazy-rules
                  :rules="[(val) => val || 'Seleccione un Centro de estudio']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="CargarCursos"
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

            <div class="row q-col-gutter">
              <div class="col-12 col-md-4">
                <q-input
                  readonly
                  color="primary"
                  v-model="curso.codigo"
                  label="Código"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  :readonly="readonly"
                  v-model="curso.id_curso"
                  label="Curso"
                  :options="cursos"
                  lazy-rules
                  :rules="[(val) => val || 'Seleccione un curso']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="obtenerCodigoCurso(true)"
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
                  v-model="curso.id_modalidad"
                  label="Modalidad"
                  :options="modalidades"
                  :loading="loadingModalidades"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese una modalidad válida']"
                  option-value="id"
                  option-label="nombre"
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

              <div class="col-12 col-md-4">
                <q-select
                  :readonly="readonly"
                  v-model="curso.id_modo"
                  label="Modo"
                  :options="modos"
                  :loading="loadingModos"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese una modo valido']"
                  option-value="id"
                  option-label="nombre"
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

            <br />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="curso.id_pais"
                  label="Pais"
                  :options="paises"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Pais válido']"
                  option-value="id"
                  option-label="nombre"
                  fill-input
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
                  v-model="curso.id_departamento"
                  label="Departamento"
                  :options="departamentos"
                  :loading="loadingDepartamentos"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Departamento válido']"
                  option-value="id"
                  option-label="nombre"
                  fill-input
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
                  v-model="curso.id_municipio"
                  label="Municipio"
                  :options="municipios"
                  :loading="loadingMunicipios"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Municipio válido']"
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
                <q-input
                  :readonly="readonly"
                  color="primary"
                  v-model="curso.direccion"
                  label="Dirección"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val.length < 191) ||
                      'Ingrese un Dirección válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  label="Fecha Inicio"
                  v-model="curso.fecha_inicio"
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
                          :readonly="readonly"
                          mask="DD/MM/YYYY"
                          v-model="curso.fecha_inicio"
                          @input="() => $refs.qDateProxyFechaInicio.hide()"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Ingrese un Fecha Inicio válido',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  label="Fecha Fin"
                  v-model="curso.fecha_fin"
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
                          :readonly="readonly"
                          mask="DD/MM/YYYY"
                          v-model="curso.fecha_fin"
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
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  prefix="US$"
                  v-model="curso.costo"
                  type="number"
                  label="Costo por participante"
                  lazy-rules
                  :rules="[
                    (val) => (val && val >= 0) || 'Ingrese un Costo válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  v-model="curso.cupos"
                  type="number"
                  label="Cupos disponibles"
                  lazy-rules
                  :rules="[
                    (val) => (val && val > 0) || 'Ingrese una cantidad válida',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  :readonly="readonly"
                  label="Fecha Fin matricula"
                  v-model="curso.fecha_fin_matricula"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val &&
                        isValidDate(val) &&
                        /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                      'Ingrese un Fecha Fin de matricula válida',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxyFechaFinMatricula"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          :readonly="readonly"
                          mask="DD/MM/YYYY"
                          v-model="curso.fecha_fin_matricula"
                          @input="
                            () => $refs.qDateProxyFechaFinMatricula.hide()
                          "
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Ingrese un Fecha Fin de matricula válida',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-toggle
                  :readonly="readonly"
                  v-model="curso.certificado"
                  :label="
                    curso.certificado
                      ? 'Incluye certificado'
                      : 'No incluye certificado'
                  "
                  icon="fa fa-graduation-cap"
                />
              </div>
            </div>

            <label>Instructores</label>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <q-list
                  dense=""
                  bordered
                  padding
                  style="height: 400px; background-color: white;"
                >


                  <q-item
                    v-ripple
                    tag="label"
                    v-for="option in instructores"
                    :key="option.nombre"
                  >
                    <q-item-section side top>
                      <q-checkbox
                        :readonly="readonly"
                        v-model="option.checked"
                      />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{ option.nombre }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
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

              <q-btn
                v-if="opcionEsVisible('btnAprobar')"
                class="bg-indigo text-white"
                @click="preguntar('aprobar')"
              >
                Aprobar
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
import {puedeVerCursos, puedeCrearCursos,puedeEditarCursos, puedeEliminarCursos, puedeEditarInscripciones} from '../../../helpers/accesos_helper'
export default {
  data() {
    return {
      nuevo: true,
      readonly: false,
      centros: [],
      selectAllInstructores: false,
      allInstructores: [],
      curso: {
        id: 0,
        id_centro: null,
        id_tipo: null,
        id_categoria: null,
        id_subcategoria: null,
        id_modo: null,
        id_modalidad: null,
        id_profesor: null,
        nombre: '',
        descripcion: '',
        competencias_adquiridas: '',
        id_pais: 1438,
        id_departamento: null,
        id_municipio: null,
        direccion: '',
        fecha_inicio: moment().format('DD/MM/YYYY'),
        fecha_fin_matricula: moment().format('DD/MM/YYYY'),
        fecha_fin: moment().add(3, 'months').format('DD/MM/YYYY'),
        id_unidad_duracion: 5523,
        duracion: 0,
        id_estado: 5531,
        certificado: false,
        costo: 0.0,
        cupos: 0,
      },
      loading: false,
      loadingCategorias: false,
      loadingCursos: false,
      loadingDepartamentos: false,
      loadingEstados: false,
      loadingMunicipios: false,
      loadingModalidades: false,
      loadingModos: false,
      loadingPaises: false,
      loadingProfesores: false,
      loadingSubcategorias: false,
      loadingTipos: false,
      loadingUnidadDuraciones: false,
      categorias: [],
      cursos: [],
      departamentos: [],
      estados: [],
      municipios: [],
      modalidades: [],
      modos: [],
      paises: [],
      instructores: [],
      subcategorias: [],
      tipos: [],
      unidad_duraciones: [],
      pregunta: '',
      confirm: false,
    }
  },
  created() {
    this.loading = true
    if (this.$route.name == 'editar_curso' && this.$route.params.id !== null) {
      this.CargarCurso()
      this.nuevo = false
    } else {
      // Nuevo
      this.nuevo = true
      try {
        this.curso.id_departamento = this.$store.state.departamento.id
        this.curso.id_municipio = this.$store.state.municipio.id
        // si el usuario es tipo centro seleccionamos e inhabilitamos
        if (this.id_rol == 4) {
          this.curso.id_centro = this.$store.state.centros[0]
        }
      } catch (error) {}
    }

    if (this.$route.name == 'ver_curso' && this.$route.params.id !== null) {
      this.readonly = true
      this.CargarCurso()
      this.nuevo = false
    }

    this.CargarCategorias()
    this.CargarCursos()
    this.CargarEstados()
    this.CargarModalidades()
    this.CargarModos()
    this.CargarDepartamentos('', false)
    this.CargarMunicipios()
    this.CargarTipos()
    this.CargarUnidadDuraciones()
    this.CargarPaises()
    this.CargarCentros()
    this.CargarInstructores()
    this.loading = false
  },
  methods: {


    Cancelar() {
      this.$router.push({
        path: '/admin/cursos',
      })
    },
    cancelarAcccion() {
      this.accion = ''
      this.pregunta = ''
    },

    opcionEsVisible(opcion) {
      let resultado = null
      switch (opcion) {
        case 'btnVer':
          resultado = this.tienePermiso(opcion)
          break

        case 'btnNuevo':
          resultado = this.tienePermiso(opcion)
          break
        case 'btnEditar':
          resultado =
            this.tienePermiso(opcion) &&
            this.curso.id_estado !== 5534 &&
            this.curso.id_estado !== 5558
          break
        case 'btnAprobar':
          resultado =
            this.tienePermiso(opcion) &&
            this.curso.id_estado == 5531 &&
            (this.$route.name == 'ver_curso' ||
              this.$route.name == 'editar_curso')
          break
        case 'btnCompletar':
          resultado = this.tienePermiso(opcion) && this.curso.id_estado == 5533
          break
        case 'btnFinalizar':
          resultado = this.tienePermiso(opcion) && this.curso.id_estado == 5534
          break
        case 'btnEliminar':
          resultado = this.tienePermiso(opcion) && this.curso.id_estado == 5531
          break
        case 'btninscripciones':
          resultado = this.tienePermiso(opcion) && this.curso.id_estado >= 5532
          break
        case 'btnNotas':
          resultado = this.tienePermiso(opcion) && this.curso.id_estado == 5533
          break
        default:
          resultado = false
          break
      }
      return resultado
    },

    tienePermiso(opcion) {
      let rol = Number(this.$store.state.user.rol)
      let resultado = null
      switch (opcion) {
        case 'btnVer':
          resultado = rol == 1 || rol == 2 || puedeVerCursos()
          break
        case 'btnNuevo':
          resultado = rol == 1 || rol == 2 || puedeCrearCursos()
          break
        case 'btnEditar':
          resultado = rol == 1 || rol == 2 || puedeEditarCursos()
          break

        case 'btnAprobar':
          resultado = rol == 1 || rol == 2
          break
        case 'btnCompletar':
          resultado = rol == 1 || rol == 2 || (puedeEditarCursos() && puedeEliminarCursos())
          break
        case 'btnFinalizar':
          resultado = rol == 1 || rol == 2
          break
        case 'btnEliminar':
          resultado = rol == 1 || rol == 2
          break
        case 'btninscripciones':
          resultado = rol == 1 || rol == 2 || puedeEditarInscripciones()
          break
        case 'btnNotas':
          resultado = rol == 1 || rol == 2 || puedeEditarInscripciones()
          break
        default:
          resultado = false
          break
      }
      return resultado
    },

    preguntar(opcion) {
      this.confirm = true
      this.pregunta =
        '¿Estás seguro que deseas ' + opcion + ' el curso seleccionado?'
      this.accion = opcion
    },
    ejecutarAccion() {
      switch (this.accion) {
        case 'aprobar': // pasa el estado del curso a 'matriculando'
          this.CambiarEstadoCurso(5532)
          break
      }
    },
    CambiarEstadoCurso(idEstado) {
      var url = process.env.API_URL + '/cursos/cambiarEstado'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'post',
        url: url,
        headers: headers,
        data: {
          id: this.curso.id,
          id_estado: idEstado,
        },
      })
        .then((response) => {
          if (response.data.result) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: 'Curso actualizado correctamente',
              position: 'bottom',
              timeout: 2000,
            })
            this.confirm = false

            this.$router.push({
              name: 'cursos',
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
        .catch((error) => {
          this.loading = false

          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data,
          })

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    obtenerCodigoCurso(CargarInstructores = true) {
      var url = process.env.API_URL + `/curso/obtener_codigo`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        id_curso: this.curso.id_curso,
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.curso.codigo = response.data.codigo
          this.curso.id_departamento = response.data.id_departamento
          this.curso.id_municipio = response.data.id_municipio
          this.curso.direccion = response.data.direccion

          this.CargarMunicipios()

          if (CargarInstructores) {
            this.CargarInstructores()
          }
        })
        .catch((error) => {
          this.loading = false

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarCurso() {
      if (this.$route.params.id) {
        var url =
          process.env.API_URL + `/admin/cursos/${this.$route.params.id}/edit`

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }
        axios({
          method: 'get',
          url: url,
          headers: headers,
        })
          .then((response) => {
            this.curso = response.data.curso
            this.curso.id_centro = Number(this.curso.id_centro)
            this.instructores = response.data.instructores

            this.instructores.forEach((item, index, arr) => {
              if (item.checked == 0) {
                arr[index].checked = false
              }
            })

            this.CargarSubcategorias()
            this.CargarMunicipios()
            this.CargarCursos()
          })
          .catch((error) => {
            this.loading = false

            if (error.response.status == 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },
    CantidadInstructoresValida() {
      return this.instructores.filter((p) => p.checked).length > 0
    },

    onSubmit() {
      if (!this.CantidadInstructoresValida()) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'debe seleccionar almenos un instructor para este curso',
        })

        return
      }

      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/cursos'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/cursos/' + this.curso.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { curso: this.curso, instructores: this.instructores },

        headers: headers,
      })
        .then((response) => {
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
            path: '/admin/cursos',
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

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    CargarCategorias(filtro = '') {
      this.loadingCategorias = true
      var url = process.env.API_URL + '/catalogos/categorias'

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
          this.categorias = response.data.categorias
          this.loadingCategorias = false
        })
        .catch((error) => {
          this.loadingCategorias = false

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarCursos(filtro = '') {
      this.loadingCursos = true
      var url = process.env.API_URL + '/catalogos/catalogo_cursos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        filtro: filtro,
        id_centro: this.curso.id_centro,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then((response) => {
          this.cursos = response.data.catalogo_cursos
          this.loadingCursos = false
        })
        .catch((error) => {
          this.loadingCursos = false

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarInstructores() {
      console.log('entro a cargar los instructores')
      var url = process.env.API_URL + '/centros/instructores'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      // Si es centro agarramos por defecto el primer centro
      if (!(this.id_rol == 1 || this.id_rol==2)) {
        console.log({ centros: this.$store.state.centros })
        if (typeof this.$store.state.centros == 'string') {
          this.curso.id_centro = JSON.parse(this.$store.state.centros)[0]
        } else {
          this.curso.id_centro = this.$store.state.centros[0]
        }
      }

      console.log({ centros: this.$store.state.centros })
      console.log({ id_centro: this.curso.id_centro })

      var params = {
        id_centro: this.curso.id_centro,
        id_curso: this.$route.params.id,
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          if (this.nuevo) {
            this.instructores = response.data.instructores
          } else {
            let instructors = response.data.instructores
            instructors.forEach((i, index, arr) => {
              arr[i].checked = i.checked
            })
            this.instructores = instructors
          }

          console.log({ instructores: this.instructores })
          this.curso.id_departamento = response.data.id_departamento
          this.curso.id_municipio = response.data.id_municipio

          this.CargarMunicipios()
        })
        .catch((error) => {
          console.log({ error })
          if (error.response.status == 401) {
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
        .then((response) => {
          this.departamentos = response.data.departamentos
          this.loadingDepartamentos = false
        })
        .catch((error) => {
          this.loadingDepartamentos = false

          if (error.response.status == 401) {
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
        .then((response) => {
          this.estados = response.data.estados_curso
          this.loadingEstados = false
        })
        .catch((error) => {
          this.loadingEstados = false

          if (error.response.status == 401) {
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
        .then((response) => {
          this.municipios = response.data.municipios
          this.loadingMunicipios = false
        })
        .catch((error) => {
          this.loadingMunicipios = false

          if (error.response.status == 401) {
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
        .then((response) => {
          this.modalidades = response.data.modalidades
          this.loadingModalidades = false
        })
        .catch((error) => {
          this.loadingModalidades = false

          if (error.response.status == 401) {
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
        .then((response) => {
          this.modos = response.data.modos
          this.loadingModalidades = false
        })
        .catch((error) => {
          this.loadingModos = false

          if (error.response.status == 401) {
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

          if (error.response.status == 401) {
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
        .then((response) => {
          this.subcategorias = response.data.subcategorias
          this.loadingSubcategorias = false
        })
        .catch((error) => {
          this.loadingSubcategorias = false

          if (error.response.status == 401) {
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
        .then((response) => {
          this.tipos = response.data.tipo_cursos
          this.loadingTipos = false
        })
        .catch((error) => {
          this.loadingTipos = false

          if (error.response.status == 401) {
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
        .then((response) => {
          this.unidad_duraciones = response.data.unidad_duraciones
          this.loadingUnidadDuraciones = false
        })
        .catch((error) => {
          this.loadingUnidadDuraciones = false

          if (error.response.status == 401) {
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
        .then((response) => {
          this.centros = response.data.centros
          this.loadingCentros = false
        })
        .catch((error) => {
          this.loadingCentros = false

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
  },
  watch: {
    'curso.id_centro': function (newValue, oldValue) {
      if (this.id_rol == 1 || this.id_rol == 2) {
        this.CargarInstructores()
      }
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
