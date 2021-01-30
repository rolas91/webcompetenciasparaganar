<template>
  <q-page class>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn
          v-if="$store.state.internetAvailable"
          class="bg-primary text-white"
          to="/admin/formularios/nuevo"
        >
          Nuevo
        </q-btn>
        <q-btn
          v-if="
            selected.length > 0 &&
            this.$store.state.internetAvailable &&
            opcionEsVisible('btnEditar')
          "
          class="bg-primary text-white"
          :to="`/admin/formularios/${this.selected[0].id}/editar`"
        >
          Editar
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && $store.state.internetAvailable"
          class="bg-green text-white"
          :to="`/admin/formularios/${this.selected[0].id}/duplicar`"
        >
          Duplicar
        </q-btn>
        <q-btn
          v-if="selected.length > 0"
          :disable="selected[0].cantidad_respuestas <= 0"
          class="bg-accent text-white"
          :to="`/respuestas/formulario/${this.selected[0].id}`"
        >
          Ver respuestas
        </q-btn>
        <q-btn
          v-if="
            selected.length > 0 &&
            $store.state.internetAvailable &&
            opcionEsVisible('btnEliminar')
          "
          class="bg-negative text-white"
          @click="pregunarEliminar"
        >
          Eliminar
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && $store.state.internetAvailable"
          color="primary"
          icon="print"
          :to="`/imprimir-formulario/${selected[0].id}`"
        >
          Imprimir
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && $store.state.internetAvailable"
          color="orange"
          icon="send"
          @click="modalcorreos = true"
        >
          Compartir enlace via correo
        </q-btn>

        <!-- <q-btn
          v-if="selected.length > 0 && $store.state.internetAvailable"
          icon="lock_open"
          class="bg-yellow text-black"
          @click="showUsuariosPermisos = true"
        >
          Permisos
        </q-btn> -->

        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarFormularios"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Formularios"
        :data="formularios"
        :columns="columns"
        row-key="id"
        selection="single"
        :selected.sync="selected"
        :loading="loadingTable"
        :pagination.sync="pagination"
        @request="onRequest"
        :filter="filtro"
      >
        <template v-slot:top-right>
          <q-input dense debounce="300" v-model="filtro" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox dense v-model="props.selected" />
            </q-td>

            <q-td key="nombre" :props="props">
              {{ props.row.nombre }}
              <q-btn dense round flat />
            </q-td>

            <q-td key="cantidad_respuestas" :props="props">
              {{ props.row.cantidad_respuestas }}
            </q-td>

            <q-td key="fecha_inicio" :props="props">
              {{ formatoFecha(props.row.fecha_inicio) }}
            </q-td>

            <q-td
              :class="!fechaValida(props.row.fecha_fin) ? 'text-red' : ''"
              key="fecha_fin"
              :props="props"
            >
              {{ formatoFecha(props.row.fecha_fin) }}
            </q-td>
            <q-td key="url" :props="props">
              <q-btn
                size="sm"
                :to="`/responder/formulario/${props.row.url}`"
                :disable="!fechaValida(props.row.fecha_fin)"
              >
                Responder
                <q-icon name="open_in_new"></q-icon>
              </q-btn>
              <q-btn
                color="primary"
                icon="content_copy"
                flat
                size="sm"
                :disable="!fechaValida(props.row.fecha_fin)"
                v-clipboard:copy="
                  `${appUrl}#/responder/formulario/${props.row.url}`
                "
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              ></q-btn>
            </q-td>

            <q-td key="usuario_creacion" :props="props">
              {{ props.row.usuario_creacion }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">
            Esta seguro que desea eliminar el formulario seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarFormulario"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showUsuariosPermisos" persistent>
      <q-card style="max-height: 70vh; width: 800px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white q-gutter-sm">
          <h5>Asignar permisos</h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-tree
            class="col-12 col-sm-6"
            :nodes="usuarios"
            node-key="label"
            tick-strategy="leaf"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalcorreos">
      <q-card style="width: 1024px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white q-gutter-sm">
          <h5>Compartir enlace</h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form class>
            <div class="row q-col-gutter-md">
              <div
                v-if="idRol === 1 || idRol === 2 || idRol === 3"
                class="col-12 col-md-4"
              >
                <q-select
                  v-model="id_centro"
                  label="Centro"
                  :options="centros"
                  lazy-rules
                  :rules="[(val) => val || 'Selecciona un centro']"
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

              <div class="col">
                <q-select
                  :readonly="id_centro === null"
                  v-model="id_curso"
                  label="Curso"
                  :options="cursos"
                  lazy-rules
                  :rules="[(val) => val || 'Selecciona un curso']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="CargarParticipantes"
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

            <div class="row">
              <div class="col">
                <q-table
                  :dense="$q.screen.lt.md"
                  title="participantes"
                  :data="participantes"
                  :columns="columnsParticipantes"
                  row-key="id"
                  :loading="loadingParticipantes"
                  :pagination.sync="paginationParticipantes"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="nombre" :props="props">
                        {{ props.row.nombre }}
                      </q-td>

                      <q-td key="correo" :props="props">
                        {{ props.row.correo }}
                      </q-td>
                      <q-td key="correo_enviado" :props="props">
                        <q-checkbox
                          disable=""
                          v-model="props.row.correo_enviado"
                        ></q-checkbox>
                      </q-td>

                      <q-td key="acciones">
                        <q-btn
                          size="sm"
                          icon-right="send"
                          color="primary"
                          @click="enviarCorreos(props.row.correo)"
                          :loading="loading"
                          :disable="loading"
                        >
                          <span style="margin-right: 5px;">Enviar correo</span>
                        </q-btn>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>

            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn right icon="close" v-close-popup>Cancelar</q-btn>
              <q-btn
                :loading="loading"
                :disable="loading"
                right
                class="bg-primary text-white"
                type="button"
                icon-right="send"
                @click="enviarCorreos(null)"
              >
                <span style="margin-right: 5px;">Enviar a todos</span>
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
        <!-- <q-separator></q-separator> -->
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from 'axios'
import { getRepository } from 'typeorm'
import moment from 'moment'
export default {
  name: 'formularios',
  data() {
    return {
      showUsuariosPermisos: false,
      usuarios: [],
      confirm: false,
      id_curso: null,
      id_centro: null,
      participantes: [],
      centros: [],
      cursos: [],
      modalcorreos: false,
      nuevo: true,
      selected: [],
      formulario: {
        id: 0,
        nombre: null,
        direccion: null,
        pais: { id: 1438, nombre: 'Nicaragua' },
        departamento: null,
        municipio: null,
      },
      paises: [],
      departamentos: [],
      municipios: [],
      formularios: [],
      loading: false,
      loadingPaises: false,
      loadingDepartamentos: false,
      loadingMunicipios: false,
      newFormulario: false,
      loadingTable: false,
      loadingParticipantes: false,
      filtro: '',
      pagination: {
        sortBy: 'fecha_inicio',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      paginationParticipantes: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      columns: [
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
          name: 'cantidad_respuestas',
          required: true,
          label: 'Cantidad Respuestas',
          align: 'left',
          field: (row) => row.cantidad_respuestas,
          sortable: true,
        },
        {
          name: 'fecha_inicio',
          required: true,
          label: 'Fecha de inicio',
          align: 'left',
          field: (row) => row.fecha_inicio,
          format: (val) => `${moment(val, 'DD/MM/YYYY')}`,
          sortable: true,
        },
        {
          name: 'fecha_fin',
          required: true,
          label: 'Fecha Fin',
          align: 'left',
          field: (row) => row.fecha_fin,
          format: (val) => `${moment(val, 'DD/MM/YYYY')}`,
          sortable: true,
        },
        {
          name: 'url',
          required: true,
          label: 'Url',
          align: 'left',
          field: (row) =>
            this.appUrl + '#' + '/responder/formulario/' + row.url,
          sortable: true,
        },
        {
          name: 'usuario_creacion',
          required: true,
          label: 'Creado por',
          align: 'left',
          field: (row) => row.usuario_creacion,
          sortable: true,
        },
      ],
      columnsParticipantes: [
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
          name: 'correo',
          required: true,
          label: 'Correo',
          align: 'left',
          field: (row) => row.correo,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'correo_enviado',
          required: true,
          label: 'Correo enviado',
          align: 'left',
          field: (row) => row.correo_enviado,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'acciones',
          required: true,
          label: 'Acciones',
          align: 'left',
          field: (row) => row.correo_enviado,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarFormularios()
    this.loading = false

    this.CargarCentros()

    // Si no es administrador o asesor , ocultamos el centro
    if (!(this.idRol === 1 || this.idRol === 2 || this.idRol === 3)) {
      this.id_centro = Number(JSON.parse(this.$store.state.centros)[0])
      await this.CargarCursos()
    }

    this.cargarUsuariosPermisos()
  },
  methods: {
    fechaValida(fecha_fin) {
      console.log(moment().isAfter(moment(fecha_fin, 'DD/MM/YYYY'), 'day'))
      return !moment().isAfter(moment(fecha_fin, 'DD/MM/YYYY'),'day')
    },
    tienePermiso(opcion) {
      let rol = Number(this.$store.state.user.rol)
      let resultado = null
      switch (opcion) {
        case 'btnVer':
          resultado = rol === 1 || rol === 2 || rol === 4
          break
        case 'btnNuevo':
          resultado = rol === 1 || rol === 2 || rol === 4
          break
        case 'btnEditar':
          resultado =
            (this.selected.length > 0 &&
              //si es superusuario, administrador o centro permitimos editar
              (rol === 1 ||
                rol === 2 ||
                //si el usuario es el mismo que lo creó permitimos editar
                this.selected[0].id_usuario_creacion ===
                  this.$store.state.user.id)) ||
            Number(this.selected[0].id_rol) ===
              Number(this.$store.state.user.rol)

          break
        case 'btnEliminar':
          resultado =
            ((rol === 1 || rol === 2) && this.selected.length > 0) ||
            (this.selected.length > 0 &&
              this.selected[0].id_usuario_creacion ===
                this.$store.state.user.id)
          break

        default:
          resultado = false
          break
      }
      return resultado
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
          resultado = this.tienePermiso(opcion)
          break

        case 'btnEliminar':
          resultado = this.tienePermiso(opcion)

          break

        default:
          resultado = false
          break
      }
      return resultado
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
        id_curso: this.id_curso,
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.participantes = response.data.participantes
          this.loadingParticipantes = false
          this.$forceUpdate()
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

    CargarCursos() {
      let idCentro = this.id_centro
      if (!idCentro) {
        return
      }
      this.loadingCursos = true
      var url = process.env.API_URL + '/catalogos/cursos'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      var params = {
        id_centro: idCentro,
      }
      axios
        .get(url, {
          params: params,
          headers: headers,
        })
        .then((response) => {
          this.id_curso = null
          console.log(response.data.cursos)
          this.cursos = response.data.cursos
          this.$forceUpdate()
        })
        .catch((error) => {
          console.log({ error })
        })
    },

    enviarCorreos(correo = null) {
      console.log(correo)
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/formularios/compartir_enlace'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      var formulario = {
        id_curso: this.id_curso,
        id_formulario: this.selected[0].id,
        correo: correo,
      }
      axios({
        method: method,
        url: url,
        data: formulario,
        headers: headers,
      })
        .then((response) => {
          this.loading = false
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Correos enviados correctamente',
            position: 'bottom',
            timeout: 2000,
          })

          if (correo !== '') {
            this.participantes.forEach((p, index, array) => {
              if (p.correo === correo) {
                array[index].correo_enviado = true
              }
            })
          }
        })
        .catch((error) => {
          this.loading = false
          console.log({ error })
          this.loadingPaises = false
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
    onCopy: function (e) {
      this.$q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'content_copy',
        message: 'Copiado al portapapeles!',
        position: 'bottom',
        timeout: 1500,
      })
    },
    onError: function (e) {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'fas fa-exclamation-triangle',
        message: 'Ha ocurrido un error al intentar copiar la url',
      })
    },

    onRequest(props) {
      this.CargarFormularios(props)
    },

    nuevoFormulario() {
      this.newFormulario = true
      this.nuevo = true
      this.LimpiarDatos()
    },
    pregunarEliminar() {
      this.confirm = true
    },
    eliminarFormulario() {
      var url =
        process.env.API_URL + '/admin/formularios/' + this.selected[0].id

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'delete',
        url: url,
        headers: headers,
      })
        .then((response) => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Formulario eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.newFormulario = false
          this.LimpiarDatos()
          this.CargarFormularios()
          this.selected = []
        })
        .catch((error) => {
          this.loading = false

          this.loadingPaises = false
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
    editarFormulario() {
      this.nuevo = false
      Object.keys(this.selected[0]).forEach((key) => {
        if (this.formulario.hasOwnProperty(key)) {
          this.formulario[key] = this.selected[0][key]
        }
      })

      var selected = this.selected[0]

      this.formulario.pais = { id: selected.id_pais, nombre: selected.pais }
      this.formulario.departamento = {
        id: selected.id_departamento,
        nombre: selected.departamento,
      }
      this.formulario.municipio = {
        id: selected.id_municipio,
        nombre: selected.municipio,
      }
      this.newFormulario = true
    },
    LimpiarDatos() {
      this.formulario.id = 0
      this.formulario.nombre = null
      this.formulario.direccion = null
      this.formulario.pais = { id: 1438, nombre: 'Nicaragua' }
      this.formulario.departamento = null
      this.formulario.municipio = null
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },
    filtrarPaises(val, update, abort) {
      update(() => {
        this.CargarPaises(val)
      })
    },
    filtrarDepartamentos(val, update, abort) {
      update(() => {
        this.CargarDepartamentos(val)
      })
    },
    filtrarMunicipios(val, update, abort) {
      update(() => {
        this.CargarMunicipios(val)
      })
    },
    onSubmit() {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/formularios'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/formularios/' + this.selected[0].id
        method = 'put'
      }
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      var formulario = {
        id: this.formulario.id,
        nombre: this.formulario.nombre,
        id_pais: 1438,
        id_departamento: this.formulario.departamento.id,
        id_municipio: this.formulario.municipio.id,
        direccion: this.formulario.direccion,
      }
      axios({
        method: method,
        url: url,
        data: formulario,
        headers: headers,
      })
        .then((response) => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Formulario creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.newFormulario = false
          this.LimpiarDatos()
          this.CargarFormularios()
          this.selected = []
        })
        .catch((error) => {
          this.loading = false

          this.loadingPaises = false
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
          this.paises = this.listaPaises
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
    CargarDepartamentos(filtro = '') {
      var url = process.env.API_URL + '/catalogos/departamentos'
      this.loadingDepartamentos = true
      this.formulario.municipio = null
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      var params = {
        q: filtro,
        id_padre: this.formulario.pais.id,
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
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data.message,
          })
        })
    },
    CargarMunicipios(filtro) {
      var url = process.env.API_URL + '/catalogos/municipios'
      this.loadingMunicipios = true
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      var params = {
        q: filtro,
        id_padre:
          this.formulario.departamento !== null
            ? this.formulario.departamento.id
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
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data.message,
          })
        })
    },
    CargarFormularios(props) {
      console.log('Cargando formularios')
      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      if (props && props.pagination) {
        page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
      }
      var url = process.env.API_URL + '/admin/formularios'
      this.loading = true
      this.loadingTable = true
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      if (this.$store.getters.online) {
        console.log('Haciendo la request')
        axios({
          method: 'get',
          url: url,
          params: {
            rowsPerPage: rowsPerPage,
            filtro: this.filtro,
            page: page,
            table_format: true,
          },
          headers: headers,
        })
          .then((response) => {
            this.formularios = response.data.formularios.data
            console.log('Forms cargados desde internet', this.formularios)
            this.loading = false
            this.loadingTable = false
            this.pagination.rowsNumber = response.data.formularios.total
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = response.data.formularios.current_page
          })
          .catch((error) => {
            console.error('Error en la petición', { error })
          })
      } else {
        let formRepo = getRepository('Formulario')
        formRepo.find().then((forms) => {
          let formularios = forms
          this.loading = false
          this.loadingTable = false
          if (formularios) {
            console.log('Formularios cargados desde base de datos', formularios)
            this.formularios = formularios
          } else {
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: 'No hay formularios disponibles',
            })
          }
        })
      }
    },
    formatoFecha(fecha) {
      let formatedDate = moment(fecha, 'DD/MM/YYYY').format('DD/MM/YYYY')
      return formatedDate
    },
    abrir_imprimir() {
      let routeData = this.$router.resolve({
        name: 'imprimir_formulario',
        query: { id_formulario: this.selected[0].id },
      })
      console.log(routeData)
      window.location.href = routeData.href
    },
    cargarUsuariosPermisos() {
      var url = process.env.API_URL + '/admin/listado_usuarios_centros'
      this.loading = true
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then((response) => {
          this.usuarios = response.data.usuarios
          this.loading = false
        })
        .catch((error) => {
          console.error('Error en la petición', { error })
        })
    },
  },
  computed: {
    appUrl() {
      return process.env.WEB_URL
    },
    idRol() {
      return Number(this.$store.state.user.rol)
    },
  },
  watch: {
    modalcorreos(val) {
      if (val === false) {
        this.participantes = []
        this.id_curso = null
      }
    },
  },
}
</script>
