<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn class="bg-primary text-white" to="/admin/instructores/nuevo">
          Nuevo
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && selected[0].estado === 'Activo'"
          class="bg-primary text-white"
          :to="`/admin/instructores/${this.selected[0].id}/editar`"
        >
          Editar
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && selected[0].estado === 'Inactivo'"
          class="bg-green text-white"
          @click="activarProfesor"
        >
          {{ selected[0].estado === 'Activo' ? 'Inactivar' : 'Activar' }}
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && selected[0].estado === 'Activo'"
          class="bg-negative text-white"
          @click="pregunarEliminar"
        >
          Eliminar
        </q-btn>
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarProfesores"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Instructores"
        :data="instructores"
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
            Esta seguro que desea eliminar el profesor seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarProfesore"
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

      selected: [],
      visibleColumns: [
        'id',
        'nombres',
        'apellidos',
        'telefono',
        'id_pais',
        'id_departamento',
        'id_municipio',
        'sexo',
        'fecha_nacimiento',
        'id_tipo_identificacion',
        'documento_identidad',
        'fecha_ingreso',
        'especialidad',
        'calificacion',
        'id_nivel_academico',
      ],

      instructores: [],
      profesor: null,
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
          name: 'nombres',
          required: true,
          label: 'Nombres',
          align: 'left',
          field: row => row.nombres,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'apellidos',
          required: true,
          label: 'Apellidos',
          align: 'left',
          field: row => row.apellidos,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'email',
          required: true,
          label: 'correo',
          align: 'left',
          field: row => row.email,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'centros_asignados',
          required: true,
          label: 'Centros asignados',
          align: 'left',
          field: row => row.centros_asignados,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'telefono_1',
          required: true,
          label: 'Telefono Claro',
          align: 'left',
          field: row => (row.telefono_1 ? row.telefono_1 : '-'),
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'telefono_2',
          required: true,
          label: 'Telefono Movistar',
          align: 'left',
          field: row => (row.telefono_2 ? row.telefono_2 : '-'),
          sortable: true,
        },
        {
          name: 'telefono_otro',
          required: true,
          label: 'Otro Telefono',
          align: 'left',
          field: row => (row.telefono_otro ? row.telefono_otro : '-'),
          sortable: true,
        },
        {
          name: 'pais',
          required: true,
          label: 'Pais',
          align: 'left',
          field: row => row.pais,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'departamento',
          required: true,
          label: 'Departamento',
          align: 'left',
          field: row => row.departamento,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'municipio',
          required: true,
          label: 'Municipio',
          align: 'left',
          field: row => row.municipio,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'sexo',
          required: true,
          label: 'Sexo',
          align: 'left',
          field: row => row.sexo,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'edad',
          required: true,
          label: 'Edad',
          align: 'left',
          field: row => row.edad,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'fecha_ingreso',
          required: true,
          label: 'Años de experiencia',
          align: 'left',
          field: row => row.anios_experiencia,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'especialidad',
          required: true,
          label: 'Especialidad',
          align: 'left',
          field: row => row.especialidad,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'calificacion',
          required: true,
          label: 'Calificacion',
          align: 'left',
          field: row => row.calificacion,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'nivel_academico',
          required: true,
          label: 'Nivel Academico',
          align: 'left',
          field: row => row.nivel_academico,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'estado',
          required: true,
          label: 'estado',
          align: 'left',
          field: row => row.estado,
          format: val => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarProfesores()
    this.loading = false
  },
  methods: {
    descargarExcel() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/instructores/descargar'
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
        .then(response => {
          this.loading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'instructores.xlsx') // or any other extension
          document.body.appendChild(link)
          link.click()
        })
        .catch(error => {
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

    activarProfesor() {
      this.profesor = this.selected[0]
      this.nuevo = false
      this.onSubmit(true)
    },
    onSubmit(activar) {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/instructores'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/instructores/' + this.profesor.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { instructore: this.profesor, activar: activar },

        headers: headers,
      })
        .then(response => {
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

          this.selected = []

          this.CargarProfesores()
        })
        .catch(error => {
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
    onRequest(props) {
      this.CargarProfesores(props)
    },

    pregunarEliminar() {
      this.confirm = true
    },
    eliminarProfesore() {
      var url =
        process.env.API_URL + '/admin/instructores/' + this.selected[0].id

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'delete',
        url: url,

        headers: headers,
      })
        .then(response => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Instructor eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })

          this.selected = []

          this.CargarProfesores()
        })
        .catch(error => {
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

    CargarProfesores(props) {
      this.loadingTable = true
      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      if (props && props.pagination) {
        page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
      }
      this.loadingProfesores = true
      var url = process.env.API_URL + '/admin/instructores'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        params: { rowsPerPage: rowsPerPage, filtro: this.filtro, page: page },

        headers: headers,
      })
        .then(response => {
          this.loadingTable = false
          this.instructores = response.data.instructores.data
          this.loadingProfesores = false

          this.instructores = response.data.instructores.data
          this.loading = false
          this.loadingProfesores = false
          this.pagination.rowsNumber = response.data.instructores.total
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.page = response.data.instructores.current_page
        })
        .catch(error => {
          this.loadingProfesores = false
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
}
</script>

<style scoped></style>
