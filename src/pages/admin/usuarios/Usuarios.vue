<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn class="bg-primary text-white" @click="nuevoUsuario">Nuevo</q-btn>
        <q-btn
          v-if="selected.length > 0 && selected[0].estado === 'Activo'"
          class="bg-primary text-white"
          @click="editarUsuario"
        >
          Editar
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && selected[0].estado === 'Inactivo'"
          class="bg-green text-white"
          @click="activarUsuario"
        >
          Activar
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && selected[0].verificado === 'No'"
          class="bg-green text-white"
          @click="verificarUsuario"
        >
          Verificar
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && selected[0].estado === 'Activo'"
          class="bg-negative text-white"
          @click="pregunarEliminar"
        >
          Inactivar
        </q-btn>
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarUsuarios"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Usuarios"
        :data="usuarios"
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

    <q-dialog v-model="modalOpen" persistent>
      <q-card style="max-height: 70vh; width: 800px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white q-gutter-sm">
          <h5>{{ nuevo ? 'Nuevo Usuario' : 'Editar Usuario' }}</h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form @submit="onSubmit" class>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="usuario.nombre"
                  label="Nombre"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val.length < 191) ||
                      'Ingrese un Nombre válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="usuario.email"
                  label="Email"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val &&
                        val.length > 0 &&
                        val.length < 191 &&
                        emailRegex.test(val)) ||
                      'Ingrese un Email válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                v-if="usuario.id_rol != 5"
                  v-model="usuario.id_rol"
                  label="Rol"
                  :options="roles"
                  lazy-rules
                  :rules="[(val) => val || 'Ingrese un Id Rol válido']"
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
            </div>

            <label v-if="$store.state.user.rol <= 2">Centros</label>
            <div v-if="$store.state.user.rol <= 2" class="row q-col-gutter-lg">
              <div class="col-12">
                <q-list dense padding style="background-color: white;">
                  <q-item-label header>
                    <q-checkbox
                      v-model="allCentros"
                      @input="selectAllCentros"
                    />
                    Todos
                  </q-item-label>

                  <q-item
                    v-ripple
                    tag="label"
                    v-for="option in centros"
                    :key="option.nombre"
                  >
                    <q-item-section side top>
                      <q-checkbox v-model="option.checked" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{ option.nombre }}</q-item-label>
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
            Esta seguro que desea eliminar el usuario seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarUsuario"
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
      allCentros: false,
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      confirm: false,
      nuevo: true,
      selected: [],
      visibleColumns: ['id', 'nombre', 'email'],
      usuario: {
        id: 0,
        nombre: '',
        email: '',
        fecha_verificacion_email: null,
        remember_token: '',
        id_rol: null,
      },
      usuarios: [],
      roles: [],
      centros: [],
      loading: false,
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
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: (row) => row.id,
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
          name: 'email',
          required: true,
          label: 'Email',
          align: 'left',
          field: (row) => row.email,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'centros_asignados',
          required: true,
          label: 'Centros Asignados',
          align: 'left',
          field: (row) => row.centros_asignados,
          format: (val) => `${val}`,
          sortable: true,
          style:
            'min-width:400px;width: 400px;text-overflow: ellipsis;word-break: keep-all;white-space: pre-line;height: auto;',
        },

        {
          name: 'fecha_verificacion_email',
          required: true,
          label: 'fecha de verificación',
          align: 'left',
          field: (row) => row.fecha_verificacion_email,
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
          name: 'verificado',
          required: true,
          label: 'verificado',
          align: 'left',
          field: (row) => row.verificado,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'rol',
          required: true,
          label: 'Rol',
          align: 'left',
          field: (row) => row.rol,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarUsuarios()
    await this.CargarRoles()
    await this.CargarCentros()

    this.loading = false
  },
  methods: {
    descargarExcel() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/usuarios/descargar'
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
          link.setAttribute('download', 'usuarios.xlsx') // or any other extension
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
    selectAllCentros() {
      this.centros.forEach((val, index, arr) => {
        arr[index].checked = this.allCentros
      })
    },

    verificarUsuario() {
      this.usuario = this.selected[0]
      this.nuevo = false
      this.onSubmit(null, false, true)
    },
    activarUsuario() {
      this.usuario = this.selected[0]
      this.nuevo = false
      this.onSubmit(null, true)
    },
    onRequest(props) {
      this.CargarUsuarios(props)
    },

    nuevoUsuario() {
      this.modalOpen = true
      this.nuevo = true
      this.LimpiarDatos()
    },
    pregunarEliminar() {
      this.confirm = true
    },
    CargarUsuario() {
      this.loading = true
      var url =
        process.env.API_URL + `/admin/usuarios/${this.selected[0].id}/edit`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then((response) => {
          this.centros = response.data.centros
          this.centros.forEach((item, index, arr) => {
            if (item.checked === 0) {
              arr[index].checked = false
            }
          })
          this.loading = false
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
    CargarCentros(filtro = '') {
      this.loadingCentros = true
      var url = process.env.API_URL + '/catalogos/centros'

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
          this.centros = response.data.centros
          this.centros.forEach((item, index, arr) => {
            if (item.checked === 0) {
              arr[index].checked = false
            }
          })
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

    eliminarUsuario() {
      var url = process.env.API_URL + '/admin/usuarios/' + this.selected[0].id

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
            message: 'Usuario Inactivado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.modalOpen = false
          this.LimpiarDatos()
          this.CargarUsuarios()
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
    async editarUsuario() {
      this.nuevo = false
      Object.keys(this.selected[0]).forEach((key) => {
        if (this.usuario.hasOwnProperty(key)) {
          this.usuario[key] = this.selected[0][key]
        }
      })
      this.modalOpen = true
      await this.CargarUsuarios()
      await this.CargarRoles()
      await this.CargarUsuario()
      if(this.usuario){
        this.usuario.id_rol = Number(this.usuario.id_rol)
      }
    },
    LimpiarDatos() {
      this.usuario.id = this.usuario.nombre = ''
      this.usuario.email = ''
      this.usuario.fecha_verificacion_email = this.usuario.password = ''
      this.usuario.remember_token = ''
      this.usuario.created_at = this.usuario.updated_at = this.usuario.id_rol = null

      this.centros.forEach((item, index, arr) => {
        arr[index].checked = false
      })
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    filtrarUsuarios(val, update, abort) {
      update(() => {
        this.CargarUsuarios(val)
      })
    },

    filtrarRoles(val, update, abort) {
      update(() => {
        this.CargarRoles(val)
      })
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
        .then((response) => {
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
        .catch((error) => {
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

    CargarUsuarios(props) {
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
      this.loadingUsuarios = true
      var url = process.env.API_URL + '/admin/usuarios'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        params: {
          rowsPerPage: rowsPerPage,
          filtro: this.filtro,
          page,
          sortBy,
          descending,
        },

        headers: headers,
      })
        .then((response) => {
          this.loadingTable = false
          this.usuarios = response.data.usuarios.data
          this.loadingUsuarios = false

          this.usuarios = response.data.usuarios.data
          this.loading = false
          this.loadingUsuarios = false
          this.pagination.rowsNumber = response.data.usuarios.total
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.page = response.data.usuarios.current_page
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
        })
        .catch((error) => {
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
        .then((response) => {
          this.roles = response.data.roles
          this.loadingRoles = false
        })
        .catch((error) => {
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
  watch: {
    centros: {
      handler: function (newValue) {
        if (
          this.centros.length ===
          this.centros.filter((item) => item.checked).length
        ) {
          this.allCentros = true
        } else if (
          this.centros.length >
          this.centros.filter((item) => item.checked).length
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
