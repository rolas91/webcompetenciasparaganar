<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn class="bg-primary text-white" @click="nuevoRole">Nuevo</q-btn>
        <q-btn
          v-if="selected.length > 0"
          class="bg-primary text-white"
          @click="editarRole"
        >
          Editar
        </q-btn>
        <q-btn
          v-if="selected.length > 0"
          class="bg-negative text-white"
          @click="pregunarEliminar"
        >
          Eliminar
        </q-btn>
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarRoles"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Roles"
        :data="roles"
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
      </q-table>
    </div>

    <q-dialog v-model="modalOpen" persistent>
      <q-card style="width: 1024px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white q-gutter-sm">
          <h5>{{ nuevo ? 'Nuevo Rol' : 'Editar Rol' }}</h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form @submit="onSubmit" class>
            <div class="row q-col-gutter-md">
              <div class="col-12 ">
                <q-input
                  color="primary"
                  v-model="role.nombre"
                  label="Nombre"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 191) ||
                      'Ingrese un Nombre válido',
                  ]"
                ></q-input>
              </div>
            </div>

            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn right icon="close" v-close-popup>Cancelar</q-btn>
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
        <!-- <q-separator></q-separator> -->
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">
            Esta seguro que desea eliminar el rol seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarRole"
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
  data() {
    return {
      confirm: false,
      nuevo: true,
      selected: [],
      visibleColumns: ['id', 'nombre'],
      role: {
        id: 0,
        nombre: '',
        created_at: null,
        updated_at: null,
      },
      roles: [],

      loading: false,

      modalOpen: false,
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
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true,
        },

        {
          name: 'nombre',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: row => row.nombre,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'Fecha Creación',
          required: true,
          label: 'created_at',
          align: 'left',
          field: row => row.created_at,
          format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'updated_at',
          required: true,
          label: 'Ultima Actualización',
          align: 'left',
          field: row => (row.updated_at ? row.updated_at : '-'),
          format: val => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarRoles()

    this.loading = false
  },
  methods: {
    onRequest(props) {
      this.CargarRoles(props)
    },

    nuevoRole() {
      this.modalOpen = true
      this.nuevo = true
      this.LimpiarDatos()
    },
    pregunarEliminar() {
      this.confirm = true
    },
    eliminarRole() {
      var url = process.env.API_URL + '/admin/roles/' + this.selected[0].id

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
            message: 'Role eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.modalOpen = false
          this.LimpiarDatos()
          this.CargarRoles()
          this.selected = []
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
    async editarRole() {
      this.nuevo = false
      Object.keys(this.selected[0]).forEach(key => {
        if (this.role.hasOwnProperty(key)) {
          this.role[key] = this.selected[0][key]
        }
      })
      this.modalOpen = true
      await this.CargarRoles()
    },
    LimpiarDatos() {
      this.role.id = 0
      this.role.nombre = ''
      this.role.created_at = null
      this.role.updated_at = null
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    filtrarRoles(val, update, abort) {
      update(() => {
        this.CargarRoles(val)
      })
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY',true).isValid()
    },
    onSubmit() {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/roles'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/roles/' + this.selected[0].id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        url: url,
        data: { role: this.role },

        headers: headers,
      })
        .then(response => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Role creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.modalOpen = false
          this.LimpiarDatos()
          this.CargarRoles()
          this.selected = []
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

    CargarRoles(props) {
      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      if (props && props.pagination) {
        // page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
      }
      this.loadingRoles = true
      this.loadingTable = true
      var url = process.env.API_URL + '/admin/roles'

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
          this.loadingRoles = false
          this.loading = false

          this.roles = response.data.roles.data
          this.pagination.rowsNumber = response.data.roles.total
          this.pagination.rowsPerPage = rowsPerPage
        })
        .catch(error => {
          this.loadingTable = false
          this.loadingRoles = false

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
