<template>
  <q-page class>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn
          v-if="$store.state.internetAvailable"
          class="bg-primary text-white"
          to="/formularios/test-holland/nuevo"
        >
          Nuevo
        </q-btn>

        <q-btn
          v-if="$store.state.internetAvailable && this.selected.length > 0"
          class="bg-primary text-white"
          :to="`/formularios/test-holland/${this.selected[0].id}/editar`"
        >
          Editar
        </q-btn>

        <q-btn
          v-if="$store.state.internetAvailable && this.selected.length > 0"
          class="bg-negative text-white"
          @click="preguntarEliminar"
        >
          Eliminar
        </q-btn>

        <q-btn
          :disable="this.selected[0].respuestas <= 0"
          :title="
            this.selected[0].respuestas <= 0
              ? 'No hay respuestas vinculadas a este Test'
              : ''
          "
          v-if="$store.state.internetAvailable && this.selected.length > 0"
          class="bg-purple text-white"
          :to="`/formularios/test-holland/${this.selected[0].token}/respuestas`"
        >
          Ver respuestas
        </q-btn>

        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarTestsHolland"
        ></q-btn>
      </div>
      <!-- <div class="row q-pa-md">
        <div class="col-12 col-md-5">
          <q-select
            v-if="id_rol === 1 || id_rol === 2"
            v-model="id_centro"
            label="Centro"
            :options="centros"
            lazy-rules
            :rules="[(val) => val || 'Seleccione un Centro de estudio']"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            @input="CargarTestsHolland()"
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
      </div> -->

      <q-table
        :dense="$q.screen.lt.md"
        title="Tests de personalidad"
        :data="holland_tests"
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

            <q-td key="nombre" :props="props">
              {{ props.row.nombre }}
            </q-td>
            <q-td
              key="centro"
              :props="props"
              style="
                text-overflow: ellipsis;
                word-break: keep-all;
                white-space: pre-line;
                height: auto;
              "
            >
              {{ props.row.centro }}
            </q-td>

            <q-td key="respuestas" :props="props">
              {{ props.row.respuestas }}
            </q-td>
            <q-td key="fecha_inicio" :props="props">
              {{ props.row.fecha_inicio }}
            </q-td>
            <q-td key="fecha_fin" :props="props">
              {{ props.row.fecha_fin }}
            </q-td>
            <q-td key="boton" :props="props">
              <q-btn
                color="teal"
                size="sm"
                :to="`/formularios/test-holland/${props.row.token}/responder`"
                 :disable="!fechaValida(props.row.fecha_fin)"
              >
                responder
              </q-btn>

              <q-btn
                color="primary"
                icon="content_copy"
                flat
                size="sm"
                 :disable="!fechaValida(props.row.fecha_fin)"
                v-clipboard:copy="
                  `${appUrl}#/formularios/test-holland/${props.row.token}/responder`
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
            Esta seguro que desea eliminar el test seleccionado?
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
      holland_tests: [],
      loading: false,
      loadingTable: false,
      filtro: '',
      id_centro: null,
      centros: [],
      pagination: {
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
          name: 'centro',
          required: true,
          label: 'centro',
          align: 'left',
          field: (row) => row.centro,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'respuestas',
          required: true,
          label: 'Respuestas',
          align: 'left',
          field: (row) => row.respuestas,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'fecha_inicio',
          required: true,
          label: 'Fecha Inicio',
          align: 'left',
          field: (row) => row.fecha_inicio,
          format: (val) => `${moment(val, 'DD/MM/YYYY')}`,
          sortable: true,
        },
        {
          name: 'fecha_fin',
          required: true,
          label: 'Fecha fin',
          align: 'left',
          field: (row) => row.fecha_fin,
          format: (val) => `${moment(val, 'DD/MM/YYYY')}`,
          sortable: true,
        },
        {
          name: 'boton',
          required: false,
          label: 'Responder',
          align: 'left',
        },
        {
          name: 'usuario_creacion',
          required: true,
          label: 'Usuario Creación',
          align: 'left',
          field: (row) => row.usuario_creacion,
          format: (val) => `${moment(val, 'DD/MM/YYYY')}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarTestsHolland()
    await this.CargarCentros()
    this.loading = false
  },
  methods: {
     fechaValida(fecha_fin) {
      console.log(moment().isAfter(moment(fecha_fin, 'DD/MM/YYYY'), 'day'))
      return !moment().isAfter(moment(fecha_fin, 'DD/MM/YYYY'),'day')
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
    descargarExcel() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/formularios/holland_tests/descargar'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        responseType: 'blob',
        url: url,
        headers: headers,
      })
        .then((response) => {
          this.loading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'tests de holland.xlsx') // or any other extension
          document.body.appendChild(link)
          link.click()
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
    preguntarEliminar() {
      this.confirm = true
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
    formatoFecha(fecha) {
      let formatedDate = moment(fecha, 'DD/MM/YYYY').format('DD/MM/YYYY')
      return formatedDate
    },
    onRequest(props) {
      this.CargarTestsHolland(props)
    },
    eliminarTest() {
      var url =
        process.env.API_URL +
        '/formularios/test-holland/destroy/' +
        this.selected[0].id

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'delete',
        url: url,
        headers: headers,
      })
        .then((response) => {
          if (response.data.result) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'fas fa-check-circle',
              message: 'test eliminado correctamente',
              position: 'bottom',
              timeout: 2000,
            })
            this.CargarTestsHolland()
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
    CargarTestsHolland(props) {
      console.log('Cargando tests de holland')
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
      var url = process.env.API_URL + '/formularios/test-holland/index'
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
            id_centro:this.id_centro
          },
          headers: headers,
        })
          .then((response) => {
            this.holland_tests = response.data.holland_tests.data
            console.log('Forms cargados desde internet', this.holland_tests)
            this.loading = false
            this.loadingTable = false
            this.pagination.rowsNumber = response.data.holland_tests.total
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = response.data.holland_tests.current_page
            this.pagination.sortBy = sortBy
            this.pagination.descending = descending
          })
          .catch((error) => {
            console.error('Error en la petición', { error })
          })
      }
    },
  },
  computed: {
    appUrl() {
      return process.env.WEB_URL
    },
    id_rol() {
      return Number(this.$store.state.user.rol) || null
    },
  },
}
</script>
