<template>
  <q-page class>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn
          :to="{
            name: 'holland-listado',
          }"
          label="Regresar"
        ></q-btn>
        <q-btn
          v-if="$store.state.internetAvailable && this.selected.length > 0"
          class="bg-purple text-white"
          :to="
            `/formularios/test-holland/${this.$route.params.token}/resultado/${this.selected[0].id}`
          "
        >
          Ver detalle
        </q-btn>

        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarRespuestas"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Test de personalidad"
        :data="holland_respuestas"
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

            <q-td key="nombre_participante" :props="props">
              {{ props.row.nombre_participante }}
            </q-td>

            <q-td key="correo" :props="props">
              {{ props.row.correo }}
            </q-td>

            <q-td key="telefono" :props="props">
              {{ props.row.telefono }}
            </q-td>

            <q-td key="cedula" :props="props">
              {{ props.row.cedula }}
            </q-td>

            <q-td key="personalidad" :props="props">
              {{ props.row.personalidad }}
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
            @click="eliminarTest"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'test_holland',
  data() {
    return {
      confirm: false,
      selected: [],
      holland_respuestas: [],
      loading: false,
      loadingTable: false,
      filtro: '',
      pagination: {
        sortBy: 'nombre',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },

      columns: [
        {
          name: 'nombre_participante',
          required: true,
          label: 'Nombre Participante',
          align: 'left',
          field: row => row.nombre_participante,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'correo',
          required: true,
          label: 'Correo',
          align: 'left',
          field: row => row.correo,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'telefono',
          required: true,
          label: 'Telefono',
          align: 'left',
          field: row => row.telefono,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'cedula',
          required: true,
          label: 'Cédula',
          align: 'left',
          field: row => row.cedula,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'personalidad',
          required: true,
          label: 'Personalidad',
          align: 'left',
          field: row => row.personalidad,
          format: val => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarRespuestas()
    this.loading = false
  },
  methods: {
    onCopy: function(e) {
      this.$q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'content_copy',
        message: 'Copiado al portapapeles!',
        position: 'bottom',
        timeout: 1500,
      })
    },
    onError: function(e) {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'fas fa-exclamation-triangle',
        message: 'Ha ocurrido un error al intentar copiar la url',
      })
    },

    descargarExcel() {
      this.loading = true
      var method = 'post'
      var url =
        process.env.API_URL + '/formularios/holland_respuestas/descargar'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        responseType: 'blob',
        url: url,
        headers: headers,
        data: {
          token: this.$route.params.token,
        },
      })
        .then(response => {
          this.loading = false
          var nombre_holland = response.data.nombre_holland
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'respuestas_holland.xlsx') // or any other extension
          document.body.appendChild(link)
          link.click()
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
    formatoFecha(fecha) {
      let formatedDate = moment(fecha, 'DD/MM/YYYY').format('DD/MM/YYYY')
      return formatedDate
    },
    onRequest(props) {
      this.CargarRespuestas(props)
    },
    eliminarTest() {
      var url =
        process.env.API_URL +
        'formularios/test-holland/destroy' +
        this.selected[0].id

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
            message: 'test eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.newFormulario = false
          this.LimpiarDatos()
          this.CargarRespuestas()
          this.selected = []
        })
        .catch(error => {
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
    CargarRespuestas(props = null) {
      console.log('Cargando respuestas de tests de holland')
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

      var url =
        process.env.API_URL +
        `/formularios/test-holland/${this.$route.params.token}/respuestas`
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
            page,
            sortBy,
            descending,
            table_format: true,
          },
          headers: headers,
        })
          .then(response => {
            this.holland_respuestas = response.data.holland_respuestas.data
            console.log(
              'Forms cargados desde internet',
              this.holland_respuestas,
            )
            this.loading = false
            this.loadingTable = false
            this.pagination.rowsNumber = response.data.holland_respuestas.total
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = response.data.holland_respuestas.current_page
            this.pagination.sortBy = sortBy
            this.pagination.descending = descending
          })
          .catch(error => {
            console.error('Error en la petición', { error })
          })
      }
    },
  },
  computed: {
    appUrl() {
      return process.env.WEB_URL
    },
    idRol() {
      return Number(this.$store.state.user.rol) || null
    },
  },
}
</script>
