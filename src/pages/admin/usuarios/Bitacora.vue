<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarBitacora"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Bitacora de accesos"
        :data="bitacora"
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

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox dense v-model="props.selected" />
            </q-td>
            <q-td key="updated_at" :props="props">
              {{ formatoFecha(props.row.updated_at) }}
            </q-td>
            <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="usuario" :props="props">{{ props.row.usuario }}</q-td>
            <q-td key="action" :props="props">{{ props.row.action }}</q-td>
            <q-td key="model" :props="props">{{ props.row.model }}</q-td>
            <q-td key="id_model" :props="props">{{ props.row.id_model }}</q-td>
            <q-td key="ip_address" :props="props">
              {{ props.row.ip_address }}
            </q-td>
            <q-td key="user_agent" :props="props">
              {{ props.row.user_agent }}
            </q-td>
            <q-td key="url" :props="props">{{ props.row.url }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data() {
    return {
      bitacora: [],
      selected: [],
      usuarios: [],
      loading: false,
      loadingTable: false,
      filtro: '',
      pagination: {
        sortBy: 'updated_at',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      },
      columns: [
        {
          name: 'updated_at',
          required: true,
          label: 'Fecha',
          align: 'left',
          field: row => row.updated_at,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'usuario',
          required: true,
          label: 'Usuario',
          align: 'left',
          field: row => row.usuario,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'action',
          required: true,
          label: 'Acción',
          align: 'left',
          field: row => row.action,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'model',
          required: true,
          label: 'Tabla',
          align: 'left',
          field: row => row.model,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'id_model',
          required: true,
          label: 'id tabla',
          align: 'left',
          field: row => row.id_model,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'ip_address',
          required: true,
          label: 'ip',
          align: 'left',
          field: row => row.ip_address,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'user_agent',
          required: true,
          label: 'Agente',
          align: 'left',
          field: row => row.user_agent,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'url',
          required: true,
          label: 'Url',
          align: 'left',
          field: row => row.url,
          format: val => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarBitacora()
    this.loading = false
  },
  methods: {
    descargarExcel() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/bitacora/descargar'
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
          link.setAttribute('download', 'cursos.xlsx') // or any other extension
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

    CargarBitacora(props) {
      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      if (props && props.pagination) {
        page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
      }
      this.loadingBitacora = true
      var url = process.env.API_URL + '/admin/bitacora'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      this.loadingTable = true

      axios({
        method: 'get',
        url: url,
        params: { rowsPerPage: rowsPerPage, filtro: this.filtro, page: page },
        headers: headers,
      })
        .then(response => {
          this.loadingTable = false
          this.loadingBitacora = false
          this.bitacora = response.data.bitacora.data
          this.bitacora = response.data.bitacora.data
          this.loading = false
          this.pagination.rowsNumber = response.data.bitacora.total
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.page = response.data.bitacora.current_page
        })
        .catch(error => {
          this.loadingTable = false
          this.loadingBitacora = false
          console.log({ error })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarUsuarios(props) {
      this.loadingTable = true
      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      if (props && props.pagination) {
        // page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
      }
      this.loadingUsuarios = true
      var url = process.env.API_URL + '/admin/usuarios'

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
          this.usuarios = response.data.usuarios.data
          this.loadingUsuarios = false

          this.usuarios = response.data.usuarios.data
          this.loading = false
          this.loadingUsuarios = false
          this.pagination.rowsNumber = response.data.usuarios.total
          this.pagination.rowsPerPage = rowsPerPage
        })
        .catch(error => {
          this.loadingTable = false
          this.loadingUsuarios = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    onRequest(props) {
      this.CargarBitacora(props)
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    onSubmit(event, activar = false, verificar = false) {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/usuarios'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/usuarios/' + this.selected[0].id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: {
          usuario: this.usuario,
          activar: activar,
          verificar: verificar,
          centros: this.centros,
        },
        headers: headers,
      })
        .then(response => {
          this.loading = false
          if (response.data.result) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: response.data.message,
              position: 'bottom',
              timeout: 2000,
            })
            this.modalOpen = false
            this.LimpiarDatos()
            this.CargarUsuarios()
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
    formatoFecha(fecha) {
      let formatedDate = moment(fecha).format('DD/MM/YYYY hh:mm a')
      return formatedDate
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
}
</script>

<style scoped></style>
