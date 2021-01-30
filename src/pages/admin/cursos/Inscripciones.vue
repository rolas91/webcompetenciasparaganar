<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn
          v-if="id_curso"
          class="bg-primary text-white"
          :to="`/admin/cursos/${this.id_curso}/inscribir`"
        >
          Nueva Inscripción
        </q-btn>

        <q-btn
          v-if="selected.length && id_curso"
          class="bg-primary text-white"
          :to="{
            name: 'inscripcion_editar',
            params: { idCurso: id_curso, idMatricula: selected[0].id },
          }"
        >
          Editar
        </q-btn>

        <q-btn
          v-if="selected.length && id_curso && selected[0].id_estado >= 5532"
          :class="
            selected[0].egresado == 0
              ? 'bg-green text-white'
              : 'bg-red text-white'
          "
          @click="pregunarEgresado"
        >
          {{
            selected[0].egresado == 0
              ? 'Marcar como egresado'
              : 'Marcar como no egresado'
          }}
        </q-btn>

        <q-btn
          v-if="
            selected && selected.length > 0 && selected[0].id_estado <= 5532 && opcionEsVisible('btnEliminar')
          "
          class="bg-negative text-white"
          @click="pregunarEliminar"
        >
          Eliminar
        </q-btn>
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarCursosMatriculas"
        ></q-btn>
      </div>

     <div class="row  q-gutter-md">
         <div class="col-12 col-md-5"  v-if="id_rol===1 || id_rol===2">
                <q-select
                  dense
                  v-model="id_centro"
                  label="Centro"
                  :options="centros"
                  lazy-rules
                  :rules="[val => val || 'Seleccione un Centro de estudio']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="cargarCursos('',true)"
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


        <div class="col-12 col-md-6">

      <q-select
        v-model="id_curso"
        dense
        use-input
        input-debounce="200"
        label="Curso"
        :options="cursos"
        :loading="loadingCursos"
        lazy-rules
        :rules="[(val) => val || 'Ingrese un Curso válido']"
        option-value="id"
        option-label="nombre"
        hide-selected
        fill-input
        emit-value
        map-options
        @filter="filtrarCursos"
        @input="SetIdMatricula()"
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



      <div v-if="curso" class="row q-pa">
        <div class="col-md-4">
          <h5>{{ curso.tipo }}: {{ curso.nombre }}</h5>
        </div>
      </div>

      <div v-if="curso" class="row q-gutted-md">
        <div class="col-12 col-md-4">
          Cupos Restantes: {{ curso.cupos_disponibles }}
        </div>

        <div class="col-12 col-md-4">
          Último día para inscribirse: {{ curso.fecha_fin_matricula }}
        </div>

        <div class="col-12 col-md-4">
          Fecha de inicio del curso: {{ curso.fecha_inicio }}
        </div>
      </div>

      <q-table
        :dense="$q.screen.lt.md"
        title="Inscripciones"
        :data="cursos_matriculas"
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
          <span class="q-ml-sm">
            Esta seguro que desea eliminar el cursos_matricula seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarCursosMatricula"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="egresadoConfirm" persistent>
      <q-card>
        <q-card-section class="">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">
            Esta seguro que desea al participante como
            {{ selected.length > 0 && selected[0].egresado ? 'no' : '' }}
            egresado?
          </span>
          <div class="q-pa-md">
            <div class="q-pa-md">
              <q-input
                v-if="selected.length > 0"
                label="Nota/Calificación"
                type="number"
                outlined
                v-model="selected[0].calificacion"
              />
            </div>
            <div class="q-pa-md">
              <q-input
                v-if="selected.length > 0"
                v-model="selected[0].comentarios"
                label="Comentarios"
                outlined
                type="textarea"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="toggleParticipanteEgresado"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      confirm: false,
      egresadoConfirm: false,
      id_curso: null,
      readonly: false,
      selected: [],
      curso: null,
      visibleColumns: [
        'id',
        'id_curso',
        'id_estudiante',
        'nombres_estudiante',
        'apellidos_estudiante',
        'telefono',
        'id_tipo_identificacion',
        'documento_identidad',
        'edad',
        'id_estado_civil',
        'sexo',
        'id_pais',
        'id_departamento',
        'id_municipio',
        'direccion',
        'id_nivel_educacion',
        'estudiando',
        'curso_estudiando',
        'trabajando',
        'lugar_trabajo',
        'salario',
        'calificacion',
      ],
      cursos_matriculas: [],
      cursos: [],
      centros:[],
      id_centro:null,
      loading: false,
      loadingTable: false,
      loadingCursos: false,
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
          name: 'participante',
          required: true,
          label: 'Participante',
          align: 'left',
          field: (row) => row.participante,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'documento_identidad',
          required: true,
          label: 'Cédula',
          align: 'left',
          field: (row) => row.documento_identidad,
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
          name: 'egresado',
          required: true,
          label: 'Egresado',
          align: 'left',
          field: (row) => (row.egresado ? '✓' : 'x'),
          format: (val) => `${val}`,
          sortable: true,
          style: 'font-size:18px;font-weight:600;',
        },
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
          name: 'curso',
          required: true,
          label: 'Curso',
          align: 'left',
          field: (row) => row.curso,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'calificacion',
          required: true,
          label: 'Calificacion',
          align: 'left',
          field: (row) => row.calificacion,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'comentarios',
          required: true,
          label: 'Comentarios',
          align: 'left',
          field: (row) => row.comentarios,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'edad',
          required: true,
          label: 'Edad',
          align: 'left',
          field: (row) => row.edad,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'estado_civil',
          required: true,
          label: 'Estado civil',
          align: 'left',
          field: (row) => row.estado_civil,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'sexo',
          required: true,
          label: 'Sexo',
          align: 'left',
          field: (row) => row.sexo,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'pais',
          required: true,
          label: 'Pais',
          align: 'left',
          field: (row) => row.pais,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'departamento',
          required: true,
          label: 'Departamento',
          align: 'left',
          field: (row) => row.departamento,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'municipio',
          required: true,
          label: 'Municipio',
          align: 'left',
          field: (row) => row.municipio,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'direccion',
          required: true,
          label: 'Dirección',
          align: 'left',
          field: (row) => row.direccion,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'nivel_academico',
          required: true,
          label: 'Nivel academico',
          align: 'left',
          field: (row) => row.nivel_academico,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          trabajando: 'desc',
          required: true,
          label: 'Trabajando',
          align: 'left',
          field: (row) => (row.trabajando ? 'Si' : 'No'),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          lugar_trabajo: 'desc',
          required: true,
          label: 'Lugar Trabajo',
          align: 'left',
          field: (row) => (row.lugar_trabajo ? row.lugar_trabajo : '-'),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          salario: 'desc',
          required: true,
          label: 'Salario',
          align: 'left',
          field: (row) => row.salario,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    this.id_curso = Number(this.$route.params.id)
    await this.CargarCursosMatriculas()
    await this.CargarCurso(true)
    await this.cargarCursos()
    await  this.CargarCentros()

    if (this.id_rol === 4) {
          this.id_centro = this.$store.state.centros[0]
        }
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
      var url = process.env.API_URL + '/inscripciones/descargar'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        responseType: 'blob',
        url: url,
        headers: headers,
        params: {id_curso:Number(this.$route.params.id)}
      })
        .then((response) => {
          this.loading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'inscripciones.xlsx') // or any other extension
          document.body.appendChild(link)
          link.click()
        })
        .catch((error) => {

          console.log({error})
          this.loading = false

          // this.$q.notify({
          //   color: 'red-5',
          //   textColor: 'white',
          //   icon: 'fas fa-exclamation-triangle',
          //   message: error.response.data,
          // })

          // if (error.response.status === 401) {
          //   this.removeCredentials()
          //   this.$router.push({
          //     name: 'login',
          //   })
          // }
        })
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
          resultado = this.tienePermiso(opcion)
          break
        case 'btnEliminar':
          resultado =
            this.tienePermiso(opcion) && this.selected[0].id_estado <= 5533
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
    tienePermiso(opcion) {
      let rol = Number(this.$store.state.user.rol)
      console.log({rol})
      let resultado = null
      switch (opcion) {
        case 'btnVer':
          resultado = rol === 1 || rol === 2 || rol === 4
          break
        case 'btnNuevo':
          resultado = rol === 1 || rol === 2 || rol === 4
          break
        case 'btnEditar':
          resultado = rol === 1 || rol === 2 || rol === 4
          break

        case 'btnAprobar':
          resultado = rol === 1 || rol === 2
          break
        case 'btnCompletar':
          resultado = rol === 1 || rol === 2 || rol === 4
          break
        case 'btnFinalizar':
          resultado = rol === 1 || rol === 2
          break
        case 'btnEliminar':

          resultado = rol === 1 || rol === 2
          break
        case 'btninscripciones':
          resultado = rol === 1 || rol === 2 || rol === 4 || rol === 5
          break
        case 'btnNotas':
          resultado = rol === 1 || rol === 2 || rol === 4 || rol === 5
          break
        default:
          resultado = false
          break
      }
      return resultado
    },
    SetIdMatricula() {
      this.$router.push({
        name: 'curso_inscripciones',
        params: {
          id: this.id_curso,
        },
      })
      setTimeout(() => {
        this.CargarCursosMatriculas()
        this.CargarCurso()
      }, 300)
    },
    onRequest(props) {
      this.CargarCursosMatriculas(props)
    },

    cargarCursos(filtro = '', resetearSelectorCursos= false) {
      this.loadingCursos = true
      var url = process.env.API_URL + '/admin/catalogos/cursos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      if(resetearSelectorCursos){
        this.id_curso = null
      }

      let rol = Number(this.$store.state.user.rol)
      let id_centro = null
      if(rol === 1 || rol === 2){
        id_centro = this.id_centro
      }

      var params = {
        filter: filtro,
        id_centro: id_centro
      }

      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.cursos = response.data.cursos
          this.loadingCursos = false
        })
        .catch((error) => {
          this.loadingCursos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    pregunarEliminar() {
      this.confirm = true
    },

    pregunarEgresado() {
      this.egresadoConfirm = true
    },
    eliminarCursosMatricula() {
      var url =
        process.env.API_URL + '/admin/cursos_matriculas/' + this.selected[0].id

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
            message: 'CursosMatricula eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })

          this.CargarCursosMatriculas()
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

    toggleParticipanteEgresado() {
      var url =
        process.env.API_URL +
        '/admin/cursos_matriculas/' +
        this.selected[0].id +
        '/toggle-egresado'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'post',
        url: url,
        params: {
          calificacion: this.selected[0].calificacion,
          comentarios: this.selected[0].comentarios,
        },
        headers: headers,
      })
        .then((response) => {
          console.log({response})
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Se ha cambiado el estado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.CargarCursosMatriculas()
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

    filtrarCursosMatriculas(val, update, abort) {
      update(() => {
        console.log({ val })
        // if (val != '' || this.cursos_matriculas.length === 0) {
        this.CargarCursosMatriculas(val)

        // }
      })
    },

    filtrarCursos(val, update, abort) {
      update(() => {
        if (val != '' || this.cursos.length === 0) {
          this.cargarCursos(val)
        }
      })
    },

    CargarCursosMatriculas(props) {
      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      if (props && props.pagination) {
        page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
      }
      this.loadingCursosMatriculas = true
      var url = process.env.API_URL + '/admin/cursos_matriculas'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      this.loadingTable = true
      this.selected = []

      axios({
        method: 'get',
        url: url,
        params: {
          rowsPerPage: rowsPerPage,
          filtro: this.filtro,
          page: page,
          id_curso: this.$route.params.id,
          mobile: this.$route.name === 'todas_matriculas',
        },
        headers: headers,
      })
        .then((response) => {
          this.loadingTable = false
          this.cursos_matriculas = response.data.cursos_matriculas.data

          this.cursos_matriculas = response.data.cursos_matriculas.data
          this.loading = false
          this.loadingCursosMatriculas = false
          this.pagination.rowsNumber = response.data.cursos_matriculas.total
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.page = response.data.cursos_matriculas.current_page
        })
        .catch((error) => {
          this.loadingTable = false
          this.loadingCursosMatriculas = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    CargarCurso(cargar_centro = false) {
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
            console.log('entro a cargar el curso')
            this.curso = response.data.curso
            if(cargar_centro){
              this.id_centro = Number(this.curso.id_centro)
            }
            console.log({ curso: this.curso })
            this.cargarCursos()
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
  },
  computed: {
    id_rol() {
      return Number(this.$store.state.user.rol)
    },
  },
}
</script>

<style></style>
