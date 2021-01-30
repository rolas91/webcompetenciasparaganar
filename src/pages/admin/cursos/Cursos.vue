<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn
          v-if="opcionEsVisible('btnNuevo')"
          class="bg-primary text-white"
          to="/admin/cursos/nuevo"
        >
          Iniciar Nuevo Curso
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnVer')"
          class="bg-primary text-white"
          :to="`/admin/cursos/${this.selected[0].id}/ver`"
        >
          Ver
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnEditar')"
          class="bg-primary text-white"
          :to="`/admin/cursos/${this.selected[0].id}/editar`"
        >
          Editar
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnAprobar')"
          class="bg-indigo text-white"
          @click="preguntar('aprobar')"
        >
          Aprobar
        </q-btn>

        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnCompletar')"
          class="bg-green text-white"
          @click="preguntar('completar')"
        >
          Marcar como completado
        </q-btn>

        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnFinalizar')"
          class="bg-yellow text-black"
          @click="preguntar('finalizar')"
        >
          Finalizar
        </q-btn>

        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnEliminar')"
          class="bg-negative text-white"
          @click="preguntar('eliminar')"
        >
          Eliminar
        </q-btn>

        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btninscripciones')"
          class="bg-purple text-white"
          :to="{
            name: 'curso_inscripciones',
            params: {
              id: selected[0].id,
            },
          }"
        >
          inscripciones
        </q-btn>

        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnNotas')"
          class="bg-orange text-black"
          :to="`/admin/cursos/${this.selected[0].id}/notas`"
        >
          Notas Estudiantes
        </q-btn>

        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarCursos"
        ></q-btn>
      </div>
      <div class="row q-pa-md">
        <div class="col-12 col-md-5">
          <q-select v-if="id_rol===1 || id_rol===2"
                  v-model="id_centro"
                  label="Centro"
                  :options="centros"
                  lazy-rules
                  :rules="[val => val || 'Seleccione un Centro de estudio']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="CargarCursos(null,true)"
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
      <q-table
        :dense="$q.screen.lt.md"
        title="Cursos"
        :data="cursos"
        :columns="columns"
        row-key="id"
        selection="single"
        :selected.sync="selected"
        :loading="loadingTable"
        :pagination.sync="pagination"
        @request="onRequest"
        :filter="filtro"
      >
        <template v-slot:top>
          <q-btn
            icon="fas fa-file-excel"
            dense
            color="green"
            :disable="loading"
            label="Descargar Excel"
            @click="descargarExcel"
          />

          <q-space />
          <q-input
            placeholder="Buscar"
            dense
            debounce="300"
            color="primary"
            v-model="filtro"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>

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
  </q-page>
</template>

<script>
import axios from 'axios'
import {puedeVerCursosEjecucion, puedeCrearCursosEjecucion,puedeEditarCursosEjecucion, puedeEliminarCursosEjecucion, puedeEditarInscripciones} from '../../../helpers/accesos_helper'

export default {
  name: 'Cursos',
  data() {
    return {
      mostrar_importado: false,
      confirm: false,
      pregunta: '',
      accion: '',
      selected: [],
      visibleColumns: [
        'id',
        'id_centro',
        'id_tipo',
        'id_categoria',
        'id_subcategoria',
        'id_profesor',
        'nombre',
        'descripcion',
        'resultado_aprendizaje',
        'plan_estudio',
        'id_pais',
        'id_departamento',
        'id_municipio',
        'direccion',
        'fecha_inicio',
        'fecha_fin',
        'id_unidad_duracion',
        'duracion',
        'id_estado',
        'certificado',
        'costo',
      ],

      cursos: [],
      centros:[],
      id_centro:null,
      loading: false,
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
          name: 'codigo',
          required: true,
          label: 'Código',
          align: 'left',
          field: (row) => row.codigo,
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
          name: 'centro',
          required: true,
          label: 'Centro',
          align: 'left',
          field: (row) => row.centro,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'tipo',
          required: true,
          label: 'Tipo',
          align: 'left',
          field: (row) => row.tipo,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'sector',
          required: true,
          label: 'Sector',
          align: 'left',
          field: (row) => row.sector,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'descripcion',
          required: true,
          label: 'Descripcion',
          align: 'left',
          field: (row) => row.descripcion,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'duracion',
          required: true,
          label: 'Duracion',
          align: 'left',
          field: (row) => row.duracion,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'unidad_duracion',
          required: true,
          label: 'Unidad duracion',
          align: 'left',
          field: (row) => row.unidad_duracion,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'estado',
          required: true,
          label: 'Estado',
          align: 'left',
          field: (row) => row.estado,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'fecha_inicio',
          required: true,
          label: 'Fecha inicio',
          align: 'left',
          field: (row) => row.fecha_inicio,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'fecha_fin_matricula',
          required: true,
          label: 'Fecha fin Matricula',
          align: 'left',
          field: (row) => row.fecha_fin_matricula,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarCursos()
    await this.CargarCentros()
    this.loading = false
  },
  methods: {
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
    descargarExcel() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/cursos/descargar'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        responseType: 'blob',
        url: url,
        params: { filtro: this.filtro },
        headers: headers,
      })
        .then((response) => {
          this.loading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'cursos.xlsx') // or any other extension
          document.body.appendChild(link)
          link.click()
        })
        .catch((error) => {
          this.loading = false

          console.log({ error: error.response.statusText })

          if (error.response.status === 404) {
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message:
                'Ruta no encontrada, si el error persiste contacta al administrador',
            })

            return
          }

          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.statusText,
          })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    cancelarAcccion() {
      this.accion = ''
      this.pregunta = ''
    },

    tienePermiso(opcion) {
      let rol = Number(this.$store.state.user.rol)
      let resultado = null
      switch (opcion) {
        case 'btnVer':
          resultado = rol === 1 || rol === 2 || puedeVerCursosEjecucion()
          break
        case 'btnNuevo':
          resultado = rol === 1 || rol === 2 || puedeCrearCursosEjecucion()
          break
        case 'btnEditar':
          resultado = rol === 1 || rol === 2 || puedeEditarCursosEjecucion()
          break

        case 'btnAprobar':
          resultado = rol === 1 || rol === 2
          break
        case 'btnCompletar':
          resultado = rol === 1 || rol === 2  || puedeEditarCursosEjecucion()
          break
        case 'btnFinalizar':
          resultado = rol === 1 || rol === 2
          break
        case 'btnEliminar':
          resultado = rol === 1 || rol === 2
          break
        case 'btninscripciones':
          resultado = rol === 1 || rol === 2 || puedeEditarInscripciones()
          break
        case 'btnNotas':
          resultado = rol === 1 || rol === 2 || puedeEditarInscripciones()
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
          resultado =
            this.tienePermiso(opcion) &&
            this.selected[0].id_estado !== 5534 &&
            this.selected[0].id_estado !== 5558
          break
        case 'btnAprobar':
          resultado =
            this.tienePermiso(opcion) && this.selected[0].id_estado === 5531
          break
        case 'btnCompletar':
          resultado =
            this.tienePermiso(opcion) && this.selected[0].id_estado === 5533
          break
        case 'btnFinalizar':
          resultado =
            this.tienePermiso(opcion) && this.selected[0].id_estado === 5534
          break
        case 'btnEliminar':
          resultado =
            this.tienePermiso(opcion) && this.selected[0].id_estado === 5531
          break
        case 'btninscripciones':
          resultado =
            this.tienePermiso(opcion) && this.selected[0].id_estado >= 5532
          break
        case 'btnNotas':
          resultado =
            this.tienePermiso(opcion) && this.selected[0].id_estado === 5533
          break
        default:
          resultado = false
          break
      }
      return resultado
    },
    onRequest(props) {
      this.CargarCursos(props)
    },

    preguntar(opcion) {
      this.confirm = true
      this.pregunta =
        '¿Estás seguro que deseas ' + opcion + ' el curso seleccionado?'
      this.accion = opcion
    },
    ejecutarAccion() {
      switch (this.accion) {
        case 'eliminar':
          this.eliminarCurso()
          break
        case 'aprobar': // pasa el estado del curso a 'matriculando'
          this.CambiarEstadoCurso(5532)
          break

        case 'completar':
          this.CambiarEstadoCurso(5534)
          break

        case 'finalizar':
          this.CambiarEstadoCurso(5558)
          break

        default:
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
          id: this.selected[0].id,
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
            this.CargarCursos()
            this.selected = []
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

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    eliminarCurso() {
      var url = process.env.API_URL + '/admin/cursos/' + this.selected[0].id

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
            message: 'Curso eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.modalOpen = false
          this.LimpiarDatos()
          this.CargarCursos()
          this.selected = []
        })
        .catch((error) => {
          this.loading = false

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

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    CargarCursos(props, resetearSelectorCursos= false) {
      this.loadingTable = true
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


 if(resetearSelectorCursos){
        this.cursos = []
      }

      this.loadingCursos = true
      var url = process.env.API_URL + '/admin/cursos'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'get',
        url: url,
        params: {
          rowsPerPage: rowsPerPage,
          filtro: this.filtro,
          page: page,
          sortBy,
          descending,
          mostrar_importado: this.mostrar_importado,
          id_centro:this.id_centro
        },
        headers: headers,
      })
        .then((response) => {
          this.loadingTable = false
          this.cursos = response.data.cursos.data
          this.loadingCursos = false
          this.cursos = response.data.cursos.data
          this.loading = false
          this.loadingCursos = false
          this.pagination.rowsNumber = response.data.cursos.total
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.page = response.data.cursos.current_page
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
        })
        .catch((error) => {
          console.log({ error })
          this.loadingCursos = false
          this.loadingTable = false
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

<style scoped></style>
