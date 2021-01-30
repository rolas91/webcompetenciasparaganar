<template>
  <q-page v-cloak>
    <q-dialog v-model="openTestHolland" persistent>
      <q-card style="width: 1024px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white q-gutter-sm">
          <h5>Buscar Test de Holland Participante</h5>
        </q-card-section>
        <q-separator />
        <q-card-section class="">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-if="selected_opcion.value != 'test_holland'"
                :mask="selected_opcion.mask"
                :type="selected_opcion.type"
                :label="selected_opcion.label"
                v-model="busqueda"
                :rules="[
                  (val) =>
                    (val && selected_opcion.rule.test(val)) ||
                    'Ingresa un valor válido',
                ]"
                debounce="300"
                @input="BuscarTestHolland()"
              ></q-input>

              <q-select
                v-else
                bg-color="white"
                v-model="selected_holland"
                label="Tests de Holland"
                :options="holland_tests"
                emit-value
                map-options
                @input="BuscarTestHolland()"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                bg-color="white"
                v-model="selected_opcion"
                label="Tipo busqueda"
                :options="opciones_busqueda"
              />
            </div>
          </div>

          <q-table
            :dense="$q.screen.lt.md"
            title="Resultados"
            :data="resultados"
            :columns="columns"
            row-key="id"
            selection="single"
            :selected.sync="selected"
            :loading="loadingTable"
            :pagination.sync="pagination"
            @request="onRequest"
            :filter="filtro"
          ></q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Seleccionar"
            class="bg-primary text-white"
            v-close-popup
            icon-right="check"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="bg-blue-background text-white q-gutter-sm">
          <h5 class="page-title">
            {{ nuevo ? 'Nueva ' : 'Editar ' }} Inscripción
          </h5>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="onSubmit" class>
            <div class="row">
              <div class="col-4">
                <q-input
                  v-if="this.curso && this.curso.id_tipo !== 5614 && puedeVerTestHolland"
                  color="primary"
                  v-model="participante_seleccionado"
                  label="Test de Holland"
                  readonly=""
                >
                  <template v-slot:append>
                    <q-icon
                      name="search"
                      class="cursor-pointer"
                      @click="openTestHolland = true"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <br />
            <h5>Datos personales</h5>

            <div class="row">
              <div class="col-12 col-md-4">
                <q-toggle
                  v-model="cursos_matricula.menor_edad"
                  :label="
                    cursos_matricula.menor_edad
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
                  color="primary"
                  v-model="cursos_matricula.documento_identidad"
                  mask="###-######-####A"
                  label="Cédula"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && cedulaRegex.test(val)) ||
                      !val ||
                      'Ingresa una cédula válida con el formato: ###-######-####X',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="cursos_matricula.nombres_participante"
                  label="Nombres"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val.length < 50) ||
                      'Ingrese un Nombres Participante válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="cursos_matricula.apellidos_participante"
                  label="Apellidos"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val.length < 50) ||
                      'Ingrese un Apellidos Participante válido',
                  ]"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="cursos_matricula.correo"
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
                  color="primary"
                  v-model="cursos_matricula.telefono"
                  label="Teléfono"
                  :rules="[
                    (val) =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingresa una teléfono válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  bg-color="white"
                  v-model="cursos_matricula.sexo"
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
                <q-select
                  v-model="cursos_matricula.id_estado_civil"
                  label="Estado civil"
                  :options="estado_civiles"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Estado Civil válido']"
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
                  label="Fecha Nacimiento"
                  v-model="cursos_matricula.fecha_nacimiento"
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
                          v-model="cursos_matricula.fecha_nacimiento"
                          @input="() => $refs.qDateProxyFechaNacimiento.hide()"
                          lazy-rules
                          :rules="[
                            (val) =>
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
                <q-select
                  v-model="cursos_matricula.id_departamento"
                  label="Departamento"
                  :options="departamentos"
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
                  v-show="false"
                  v-model="cursos_matricula.id_pais"
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
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="cursos_matricula.id_municipio"
                  label="Municipio"
                  :options="municipios"
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

              <div class="col-12 col-md-8">
                <q-input
                  color="primary"
                  v-model="cursos_matricula.direccion"
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
                <h5>Datos Academicos</h5>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="cursos_matricula.id_nivel_academico"
                  label="Nivel Académico"
                  :options="nivel_academicos"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Nivel Académico válido']"
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
                <q-toggle
                  v-model="cursos_matricula.estudiando"
                  :label="
                    cursos_matricula.estudiando
                      ? 'Actualmente estudiando'
                      : 'Actualmente no estudiando'
                  "
                  icon="fas fa-graduation-cap"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-if="cursos_matricula.estudiando"
                  color="primary"
                  v-model="cursos_matricula.curso_estudiando"
                  label="¿Qué curso que está estudiando?"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <h5>Datos Laborales</h5>
              </div>

              <div class="col-12 col-md-4">
                <q-toggle
                  v-model="cursos_matricula.trabajando"
                  :label="
                    cursos_matricula.trabajando
                      ? 'Actualmente trabajando'
                      : 'Actualmente no trabajando'
                  "
                  icon="fas fa-briefcase"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-if="cursos_matricula.trabajando"
                  color="primary"
                  v-model="cursos_matricula.lugar_trabajo"
                  label="Lugar Trabajo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Ingrese un lugar de trabajo',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-if="cursos_matricula.trabajando"
                  v-model="cursos_matricula.salario"
                  type="number"
                  label="Salario"
                  prefix="C$"
                  lazy-rules
                  :rules="[
                    (val) => (val && val >= 0) || 'Ingrese un Salario válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <h5>Datos referencia (Persona Adicional)</h5>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="cursos_matricula.id_parentezco"
                  label="Parentesco"
                  :options="parentescos"
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
                  color="primary"
                  v-model="cursos_matricula.referencia_nombre"
                  label="Nombre Completo"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="cursos_matricula.referencia_cedula"
                  mask="###-######-####A"
                  label="Cédula"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && cedulaRegex.test(val)) ||
                      !val ||
                      'Ingresa una cédula válida con el formato: ###-######-####X',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="cursos_matricula.referencia_telefono"
                  label="Teléfono"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-if="cursos_matricula.menor_edad"
                  color="primary"
                  v-model="cursos_matricula.referencia_correo"
                  label="Correo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingresa una teléfono válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <br />

            <br />
            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn right icon="keyboard_arrow_left" @click="$router.go(-1)">Regresar</q-btn>
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
      </q-card>
    </div>
  </q-page>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import loadMap from 'highcharts/modules/map';
import {puedeVerTestHolland} from '../../../helpers/accesos_helper'

export default {
  data() {
    return {
      nuevo: true,
      openTestHolland: false,
      busqueda: null,
      resultados: [],
      holland_tests: [],
      selected_holland:[],
      participante_seleccionado:null,
      curso: null,
      columns: [
        {
          name: 'cedula',
          required: true,
          label: 'Cedula',
          align: 'left',
          field: (row) => row.cedula,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'correo',
          required: true,
          label: 'Correo',
          align: 'left',
          field: (row) => row.correo,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'nombre_participante',
          required: true,
          label: 'Nombre participante',
          align: 'left',
          field: (row) => row.nombre_participante,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'telefono',
          required: true,
          label: 'Telefono',
          align: 'left',
          field: (row) => row.telefono,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'personalidad',
          required: true,
          label: 'Personalidad',
          align: 'left',
          field: (row) => row.personalidad,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
      selected: [],
      loadingTable: false,
      filtro: '',
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },

      opciones_busqueda: [
        {
          value: 'documento_identidad',
          label: 'Cédula Participante',
          mask: '###-######-####A',
          type: 'text',
          rule: new RegExp(/^\d{3}-?\d{6}-?\d{4}[a-zA-Z]{1}$/),
        },
        {
          value: 'nombres',
          label: 'Nombre Participante',
          mask: '',
          type: 'text',
          rule: new RegExp(/\w+/),
        },
        {
          value: 'correo',
          label: 'Corrreo Participante',
          mask: '',
          type: 'email',
          rule: new RegExp(
            /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
          ),
        },

        {
          value: 'test_holland',
          label: 'Tests de Holland',
          mask: '',
          type: 'text',
          rule: new RegExp(/\w+/),
        },
      ],
      selected_opcion: {
        value: 'test_holland',
        label: 'Tests de Holland',
        mask: '',
        type: 'text',
        rule: new RegExp(/\w+/),
      },
      cedulaRegex: new RegExp(/^\d{3}-?\d{6}-?\d{4}[a-zA-Z]{1}$/),
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      phoneRegex: new RegExp(/^[\s.-]?\(?\d{4}\)?[\s.-]?\d{4}$/),
      cursos_matricula: {
        id: 0,
        id_curso: 0,
        menor_edad: false,
        id_participante: 0,
        nombres_participante: '',
        apellidos_participante: '',
        telefono: '',
        correo: '',
        id_tipo_identificacion: null,
        documento_identidad: '',
        fecha_nacimiento: null,
        id_estado_civil: null,
        sexo: '',
        id_pais: 1438,
        id_departamento: null,
        id_municipio: null,
        direccion: '',
        id_nivel_academico: null,
        estudiando: false,
        curso_estudiando: '',
        trabajando: false,
        lugar_trabajo: '',
        salario: 0.0,
        calificacion: 0,
        referencia_nombre: null,
        id_parentezco: null,
        referencia_cedula: null,
        referencia_telefono: null,
        referencia_correo: null,
      },
      parentescos: [],
      tipo_sexo: [
        { value: 'F', label: 'Femenino' },
        { value: 'M', label: 'Masculino' },
      ],

      cursos: [],
      departamentos: [],
      estado_civiles: [],
      Participantes: [],
      municipios: [],
      nivel_academicos: [],
      paises: [],
      participantes: [],
      loading: false,
      tipo_identificaciones: [],
      loadingCursos: false,
      loadingDepartamentos: false,
      loadingEstadoCiviles: false,
      loadingParticipantes: false,
      loadingMunicipios: false,
      loadingNivelAcademicos: false,
      loadingPaises: false,
      loadingTipoIdentificaciones: false,
    }
  },
  async created() {
    this.loading = true
    this.nuevo = true
    if (
      this.$route.name === 'inscripcion_editar' &&
      this.$route.params.idCurso &&
      this.$route.params.idMatricula
    ) {
      this.cursos_matricula.id = this.$route.params.idMatricula
      await this.CargarCursosMatriculas()
      this.nuevo = false
    }
    this.cursos_matricula.id_curso = this.$route.params.idCurso


    await this.getDatosCurso()
    await this.cargarListadoTestsHolland()
    await this.CargarPaises()
    await this.CargarEstadoCiviles()
    await this.CargarParticipantes()
    await this.CargarNivelAcademicos()
    await this.CargarTipoIdentificaciones()
    await this.CargarDepartamentos()
    await this.CargarMunicipios('', false)
    await this.cargarParentescos()
    this.loading = false
    this.cursos_matricula.id_curso = this.$route.params.idCurso
  },
  methods: {
    filtrarParticipantes(val, update, abort) {
      update(() => {
        if (val) {
          this.CargarParticipantes(val)
        }
      })
    },

    onRequest(props) {
      this.BuscarTestHolland(props)
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },

    BuscarTestHolland(props) {
      var url = process.env.API_URL + '/test-holland/buscar-participante'

      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      let sortBy = this.pagination.sortBy
      let descending = this.pagination.descending
      if (props && props.pagination) {
        page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
        sortBy = props.pagination.sortBy
        descending = props.pagination.descending
      }

      this.loadingTable = true
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      if (this.$store.getters.online) {
        console.log('Haciendo la request')
        axios({
          method: 'POST',
          url: url,
          params: {
            rowsPerPage: rowsPerPage,
            filtro: this.filtro,
            page,
            sortBy,
            descending,
            table_format: true,
            tipo_busqueda: this.selected_opcion.value,
            valor: this.selected_opcion.value ==='test_holland'? this.selected_holland : this.busqueda,
          },
          headers: headers,
        })
          .then((response) => {
            console.log({ data: response.data })

            this.loadingTable = false
            this.pagination.rowsNumber = response.data.holland_respuestas.total
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = response.data.holland_respuestas.current_page
            this.pagination.sortBy = sortBy
            this.pagination.descending = descending

            this.resultados = response.data.holland_respuestas.data

            console.log('resultados:', this.resultados)
          })
          .catch((error) => {
            this.loadingTable = false
            console.error('Error en la petición', { error })
          })
      }
    },

    cargarListadoTestsHolland() {
      var url = process.env.API_URL + '/test-holland/getTests'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then((response) => {
          this.holland_tests = response.data.holland_tests
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    onSubmit() {

      //Validamos si es necesario vincular el test de holland
      if( this.puedeVerTestHolland &&  this.curso.id_tipo !== 5614 && !this.participante_seleccionado){
           this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: "Es necesario seleccionar el Test de Holland relacionado para poder continuar",
            })
            return
      }


      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/cursos_matriculas'
      if (!this.nuevo) {
        url =
          process.env.API_URL +
          '/admin/cursos_matriculas/' +
          this.cursos_matricula.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { cursos_matricula: this.cursos_matricula },

        headers: headers,
      })
        .then((response) => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'CursosMatricula creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.$router.go(-1)
        })
        .catch((error) => {
          this.loading = false

          console.log('response:', error.response)
          console.log('errors:', error.response.data.errors)

          if (error.response.status === 422) {
            var message = ''
            if (error.response.data.errors) {
              let errors = error.response.data.errors
              for (let key in errors) {
                message += ' | ' + errors[key] + ' | '
              }
            } else {
              message = error.response.data.message
            }

            console.log('variable message:', message)
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: message,
            })
          } else if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          } else {
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: error.response.data.message,
            })
          }
        })
    },

    CargarCursosMatriculas() {

      this.loading = true
      var url = `${process.env.API_URL}/admin/cursos_matriculas/${this.$route.params.idMatricula}/edit`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then((response) => {
          if(response.data.curso_matricula){
            this.cursos_matricula = response.data.curso_matricula
          }
          this.participante_seleccionado = response.data.curso_matricula.nombre_participante_holland
          this.loading = false
          this.CargarMunicipios()
        })
        .catch((error) => {
          this.loading = false
          console.log({error})

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    cargarParentescos() {
      var url = process.env.API_URL + '/catalogos/parentescos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var loadAll = false
      if(this.nuevo ===false){
        loadAll =true
      }

      var params = {
        q: '',
        loadAll:loadAll
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.parentescos = response.data.parentescos
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    getDatosCurso(){
       this.loading = true
      var url = process.env.API_URL + '/inscripciones/getDatosCurso'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        id_curso: this.$route.params.idCurso
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.curso = response.data.data
          this.loading =false
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
    },

    CargarDepartamentos() {
      this.loadingDepartamentos = true
      var url = process.env.API_URL + '/catalogos/departamentos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: '',
        id_padre: this.cursos_matricula.id_pais,
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

    CargarParticipantes(filtro = '') {
      this.loadingParticipantes = true
      var url = process.env.API_URL + '/catalogos/participantes'

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
          this.Participantes = response.data.participantes
          this.loadingParticipantes = false
        })
        .catch((error) => {
          this.loadingParticipantes = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarMunicipios(filtro = '') {
      this.loadingMunicipios = true
      var url = process.env.API_URL + '/catalogos/municipios'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
        id_padre:
          this.cursos_matricula.id_departamento !== null
            ? this.cursos_matricula.id_departamento
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
          this.loadingMunicipios = false
        })
        .catch((error) => {
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
        .then((response) => {
          this.nivel_academicos = response.data.nivel_academicos
          this.loadingNivelAcademicos = false
        })
        .catch((error) => {
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
    CargarDatosParticipante() {
      if (!this.cursos_matricula.id_participante) {
        // Limpiamos los datos
        this.cursos_matricula.id_departamento = null
        this.cursos_matricula.id_municipio = null
        this.cursos_matricula.id_estado_civil = null
        this.cursos_matricula.documento_identidad = ''
        this.cursos_matricula.sexo = ''
        this.cursos_matricula.fecha_nacimiento = ''
        this.cursos_matricula.nombres_participante = ''
        this.cursos_matricula.apellidos_participante = ''
        this.cursos_matricula.telefono = ''
        this.cursos_matricula.correo = ''
        this.cursos_matricula.id_nivel_academico = ''
        this.cursos_matricula.direccion = ''
        this.cursos_matricula.estudiando = false
        this.cursos_matricula.curso_estudiando = ''
        this.cursos_matricula.trabajando = false
        this.cursos_matricula.lugar_trabajo = ''
        this.cursos_matricula.salario = 0
        this.cursos_matricula.referencia_nombre = ''
        this.cursos_matricula.referencia_cedula = ''
        this.cursos_matricula.referencia_telefono = ''
        this.cursos_matricula.referencia_correo = ''
        this.cursos_matricula.id_parentezco = null
        this.cursos_matricula.id_test_holland = null
      }

      this.loading = true
      var url =
        process.env.API_URL +
        `/admin/participantes/${this.cursos_matricula.id_participante}/edit`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then((response) => {
          let participante = response.data.participante

          // esto es para evitar un error hechizo
          if (!participante || !participante.id_departamento) {
            return
          }

          this.cursos_matricula.id_departamento = participante.id_departamento
          this.cursos_matricula.id_municipio = participante.id_ciudad
          this.cursos_matricula.id_estado_civil = participante.id_estado_civil
          this.cursos_matricula.documento_identidad =
            participante.documento_identidad
          this.cursos_matricula.sexo = participante.sexo
          this.cursos_matricula.fecha_nacimiento = participante.fecha_nacimiento
          this.cursos_matricula.nombres_participante = participante.nombres
          this.cursos_matricula.apellidos_participante = participante.apellidos
          this.cursos_matricula.telefono = participante.telefono
          this.cursos_matricula.correo = participante.correo
          this.cursos_matricula.id_nivel_academico =
            participante.id_nivel_educacion
          this.cursos_matricula.direccion = participante.direccion
          this.cursos_matricula.estudiando = participante.estudiando
          this.cursos_matricula.curso_estudiando = participante.curso_estudiando
          this.cursos_matricula.trabajando = participante.trabajando
          this.cursos_matricula.lugar_trabajo = participante.lugar_trabajo
          this.cursos_matricula.salario = participante.salario
          this.cursos_matricula.referencia_nombre =
            participante.referencia_nombre
          this.cursos_matricula.referencia_cedula =
            participante.referencia_cedula
          this.cursos_matricula.referencia_telefono =
            participante.referencia_telefono
          this.cursos_matricula.referencia_correo =
            participante.referencia_correo
          this.cursos_matricula.id_parentezco = participante.id_parentezco
          this.cursos_matricula.id_test_holland = participante.id_test_holland

          this.CargarPaises()
          this.CargarDepartamentos('', false)
          this.CargarMunicipios()
          this.CargarEstadoCiviles()
          this.CargarNivelAcademicos()
          this.CargarTipoIdentificaciones()
          this.cargarParentescos()
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.loadingparticipantes = false

          if (error && error.response && error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
  },

  computed:{
    puedeVerTestHolland(){
      return puedeVerTestHolland()
    }
  },

  watch:{
    "selected"(newVal){
      console.log("Entro al watcher")
      if(newVal){
        console.log("newVal:",newVal,"this.selected[0]:", this.selected[0])
        this.participante_seleccionado = this.selected[0].nombre_participante
        this.cursos_matricula.id_test_holland = this.selected[0].id
      }
    }


  }
}
</script>
<style>
.bg-blue-background {
  background-color: #027be3;
}

h5 {
  margin: 10px 15px;
}

form h5 {
  margin: 10px 0px;
  color: #027be3;
}
</style>
