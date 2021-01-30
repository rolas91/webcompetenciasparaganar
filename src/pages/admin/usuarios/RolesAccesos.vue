<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn class="bg-primary text-white" @click="nuevoRolesAcceso">
          Nuevo
        </q-btn>
        <q-btn
          v-if="selected.length > 0"
          class="bg-primary text-white"
          @click="editarRolesAcceso"
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
          @click="CargarRolesAccesos"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="RolesAccesos"
        :data="roles_accesos"
        :columns="columns"
        row-key="id_rol"
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

    <q-dialog
      v-if="this.selected.length > 0 && modalOpen"
      :maximized="$q.screen.lt.md"
      :full-width="$q.screen.lt.md"
      :full-height="$q.screen.lt.md"
      v-model="modalOpen"
      persistent
    >
      <q-card style="width: 100%; max-width: 100vw;">
        <q-card-section class="bg-primary text-white q-gutter-sm">
          <h5>{{ nuevo ? 'Nuevo Rol Acceso' : 'Editar Rol Acceso' }}</h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form @submit="onSubmit" class>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="id_rol"
                  label="Rol"
                  :options="roles"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Rol válido']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="setRol"
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
                <h5>Permisos</h5>

                <q-list dense padding style="background-color:white">
                  <q-item-label header>
                    <div class="row q-col-gutter-md bg-green text-white">
                      <div class="col-3">
                        <label></label>
                      </div>
                      <div class="col-2">
                        <label>Ver</label>
                      </div>
                      <div class="col-2">
                        <label>Crear</label>
                      </div>
                      <div class="col-2">
                        <label>Editar</label>
                      </div>
                      <div class="col-2">
                        <label>Eliminar</label>
                      </div>
                    </div>
                  </q-item-label>

                  <q-item
                    v-ripple
                    tag="label"
                    v-for="option in accesos"
                    :key="option.id"
                  >
                    <q-item-section>
                      <div class="row">
                        <div class="col-3">
                          <q-item-label class="label-item">
                            {{ option.acceso }}
                          </q-item-label>
                        </div>
                        <div class="col-2">
                          <q-checkbox
                            :readonly="readonly"
                            v-model="option.ver"
                          />
                        </div>
                        <div class="col-2">
                          <q-checkbox
                            :readonly="readonly"
                            v-model="option.crear"
                          />
                        </div>
                        <div class="col-2">
                          <q-checkbox
                            :readonly="readonly"
                            v-model="option.editar"
                          />
                        </div>
                        <div class="col-2">
                          <q-checkbox
                            :readonly="readonly"
                            v-model="option.eliminar"
                          />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
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
            Esta seguro que desea eliminar el roles_acceso seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarRolesAcceso"
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
      readonly: false,
      confirm: false,
      selectAllAccesos: false,
      nuevo: true,
      selected: [],
      visibleColumns: [
        'id',
        'id_acceso',
        'id_rol',
        'ver',
        'crear',
        'editar',
        'eliminar',
      ],
      id_rol: null,
      roles_accesos: [],
      accesos: [],
      roles: [],

      loading: false,
      loadingAccesos: false,
      loadingRoles: false,

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
          name: 'roles',
          required: true,
          label: 'Rol',
          align: 'left',
          field: row => row.rol,
          format: val => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarRolesAccesos()
    await this.CargarAccesos()
    await this.CargarRoles()

    this.loading = false
  },
  methods: {
    setRol() {
      this.accesos.forEach((access, index, arr) => {
        arr[index].id_rol = this.id_rol
      })
    },
    onRequest(props) {
      this.CargarRolesAccesos(props)
    },

    nuevoRolesAcceso() {
      this.modalOpen = true
      this.nuevo = true
      this.LimpiarDatos()
    },
    pregunarEliminar() {
      this.confirm = true
    },
    eliminarRolesAcceso() {
      var url =
        process.env.API_URL + '/admin/roles_accesos/' + this.selected[0].id

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
            message: 'RolesAcceso eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.modalOpen = false
          this.LimpiarDatos()
          this.CargarRolesAccesos()
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
    async editarRolesAcceso() {
      this.nuevo = false
      await this.cargarPermisos()
      this.modalOpen = true
    },
    cargarPermisos() {
      this.loadingAccesos = true
      var url = `${process.env.API_URL}/catalogos/rolesAccesos/edit`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        id_rol: this.selected[0].id_rol,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
        params: params,
      })
        .then(response => {
          this.accesos = response.data.accesos
          this.id_rol = response.data.id_rol
          this.CargarRoles()
          this.loadingAccesos = false
        })
        .catch(error => {
          this.loadingAccesos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    LimpiarDatos() {
      this.id_rol = null
      this.accesos.forEach((acceso, index, arr) => {
        arr[index].ver = false
        arr[index].crear = false
        arr[index].editar = false
        arr[index].eliminar = false
      })
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    filtrarRolesAccesos(val, update, abort) {
      update(() => {
        this.CargarRolesAccesos(val)
      })
    },

    filtrarAccesos(val, update, abort) {
      update(() => {
        this.CargarAccesos(val)
      })
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

      var url = process.env.API_URL + '/admin/roles_accesos'
      if (!this.nuevo) {
        url =
          process.env.API_URL + '/admin/roles_accesos/' + this.selected[0].id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      let rolesAccesos = this.accesos
      rolesAccesos.map((item, index, arr) => {
        arr[index].nombre = undefined
        arr[index].id = undefined
        arr[index].created_at = moment().format('YYYY/MM/MM')
      })

      axios({
        method: method,
        url: url,
        data: { roles_accesos: rolesAccesos },
        headers: headers,
      })
        .then(response => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'RolesAcceso creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })

          this.modalOpen = false
          this.LimpiarDatos()
          this.CargarRolesAccesos()
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

    CargarRolesAccesos(props) {
      let rowsPerPage = this.pagination.rowsPerPage
      let page = this.pagination.page
      if (props && props.pagination) {
        // page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage
      }
      this.loadingRolesAccesos = true
      var url = process.env.API_URL + '/admin/roles_accesos'

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
          this.roles_accesos = response.data.roles_accesos.data
          this.loadingRolesAccesos = false

          this.roles_accesos = response.data.roles_accesos.data
          this.loading = false
          this.loadingRolesAccesos = false
          this.pagination.rowsNumber = response.data.roles_accesos.total
          this.pagination.rowsPerPage = rowsPerPage
        })
        .catch(error => {
          this.loadingTable = false
          this.loadingRolesAccesos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarAccesos(filtro = '') {
      this.loadingAccesos = true
      var url = process.env.API_URL + '/catalogos/accesos'

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
        .then(response => {
          this.accesos = response.data.accesos
          this.loadingAccesos = false
        })
        .catch(error => {
          this.loadingAccesos = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarRoles(filtro = '') {
      this.loadingRoles = true
      var url = process.env.API_URL + '/catalogos/roles'

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
        .then(response => {
          this.roles = response.data.roles
          this.loadingRoles = false
        })
        .catch(error => {
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

<style scoped>
.label-item {
  margin-top: 10px;
}
</style>
