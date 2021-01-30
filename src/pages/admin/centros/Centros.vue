<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <q-btn
          v-if="opcionEsVisible('btnNuevo')"
          class="bg-primary text-white"
          to="/admin/centros/nuevo"
          @click="nuevoCentro"
        >
          Nuevo
        </q-btn>
        <q-btn
          v-if="selected.length > 0 && opcionEsVisible('btnEditar') && selected[0].estado =='Activo'"
          :to="`/admin/centros/${this.selected[0].id}/editar`"
          class="bg-primary text-white"
          @click="editarCentro"
        >
          Editar
        </q-btn>
        <q-btn
          v-if="
            selected.length > 0 &&
            !selected[0].deleted_at &&

            opcionEsVisible('btnInactivar')
          "
          class="bg-negative text-white"
          @click="preguntarInactivar"
        >
          Inactivar
        </q-btn>

        <q-btn
          v-if="
            selected.length > 0 &&
            selected[0].deleted_at &&
            opcionEsVisible('btnReactivar')
          "
          class="bg-green text-white"
          @click="preguntarReactivar"
        >
          Activar
        </q-btn>
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          :loading="loadingCentros"
          :disabled="loadingCentros"
          @click="CargarCentros"
        >
          <template v-slot:loading>
            <q-spinner-gears />
          </template>
        </q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Centros"
        :data="centros"
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
          v-if="idRol ==1 || idRol ==2"
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
            <q-td
              key="nombre"
              :props="props"
              :class="props.row.deleted_at ? 'text-red' : 'text-black'"
            >
              {{ props.row.nombre }}
              <q-btn
                dense
                round
                flat
                :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'"
                @click="props.expand = !props.expand"
              />
            </q-td>
            <q-td key="foto_representante" :props="props">
              <img
                v-if="props.row.foto_representante"
                :src="FotoUrl + '/' + props.row.foto_representante"
                alt=""
                style="width: 50px;"
              />
            </q-td>
            <q-td key="departamento" :props="props">
              {{ props.row.departamento }}
            </q-td>
            <q-td key="municipio" :props="props">
              {{ props.row.municipio }}
            </q-td>

            <q-td
              key="estado"
              :props="props"
              :class="props.row.deleted_at ? 'text-red' : 'text-green'"
            >
              {{ props.row.deleted_at ? 'Inactivo' : 'Activo' }}
            </q-td>

             <q-td key="tipo" :props="props">
              {{ props.row.tipo }}
            </q-td>

            <q-td key="direccion" :props="props">
              {{ props.row.direccion }}
            </q-td>
            <q-td key="contacto_nombre" :props="props">
              {{ props.row.contacto_nombre }}
            </q-td>
            <q-td key="contacto_telefono" :props="props">
              {{ props.row.contacto_telefono }}
            </q-td>
            <q-td key="contacto_correo" :props="props">
              {{ props.row.contacto_correo }}
            </q-td>
            <q-td key="telefono" :props="props">{{ props.row.telefono }}</q-td>
            <q-td key="correo" :props="props">{{ props.row.correo }}</q-td>
            <q-td key="web_url" :props="props">{{ props.row.web_url }}</q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div
                v-if="
                  CursosXCentro(props.row.id) &&
                  CursosXCentro(props.row.id).length > 0
                "
              >
                <div
                  class="row text-left flex"
                  style="margin-top: 5px;"
                  v-for="curso in CursosXCentro(props.row.id)"
                  :key="curso.id"
                >
                  <div class="col-12 col-md-3">
                    {{ curso.codigo }} {{ curso.tipo.nombre }} -
                    {{ curso.nombre }}
                  </div>

                  <div class="col-12 col-md-6 text-left">
                    <q-btn
                      flat
                      class="bg-primary text-white"
                      size="sm"
                      :to="`/admin/cursos/${curso.id}/ver`"
                    >
                      Ver detalle
                    </q-btn>
                  </div>
                </div>
              </div>
              <div v-else class="text-left">
                Este centro no tiene cursos relacionados
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- confirmInactivarar Inactivar -->
    <q-dialog v-model="confirmInactivar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">
            Esta seguro que desea inactivar el centro seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="inactivarCentro"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirm reactivar -->
    <q-dialog v-model="confirmReactivar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">
            Esta seguro que desea reactivar el centro seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="reactivarCentro"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from 'axios'
import {puedeVerCentros, puedeCrearCentros,puedeEditarCentros, puedeEliminarCentros} from '../../../helpers/accesos_helper'
export default {
  data() {
    return {
      confirmInactivar: false,
      confirmReactivar: false,
      FotoUrl: process.env.IMAGE_URL + '/fotos_representantes',
      selected: [],
      centros: [],
      cursos: [],
      loading: false,
      modalOpen: false,
      loadingTable: false,
      filtro: '',
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 10,
      },
      columns: [
        {
          name: 'nombre',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: (row) => row.nombre,
          sortable: true,
        },

        {
          name: 'foto_representante',
          required: true,
          label: 'Foto Representante',
          align: 'left',
          field: (row) => row.foto_representante,
          sortable: true,
        },
        {
          name: 'departamento',
          required: true,
          label: 'Departamento',
          align: 'left',
          field: (row) => row.departamento,
          sortable: true,
        },
        {
          name: 'municipio',
          required: true,
          label: 'Municipio',
          align: 'left',
          field: (row) => row.municipio,
          sortable: true,
        },
        {
          name: 'estado',
          required: true,
          label: 'Estado',
          align: 'left',
          field: (row) => row.deleted_at === null,
          sortable: true,
        },
        {
          name: 'tipo',
          required: true,
          label: 'tipo',
          align: 'left',
          field: (row) => row.tipo,
          sortable: true,
        },
        {
          name: 'direccion',
          required: true,
          label: 'Dirección',
          align: 'left',
          field: (row) => row.direccion,
          sortable: true,
        },
        {
          name: 'contacto_nombre',
          required: true,
          label: 'Contacto Nombre',
          align: 'left',
          field: (row) => row.contacto_nombre,
          sortable: true,
        },
        {
          name: 'contacto_telefono',
          required: true,
          label: 'Contacto Telefono',
          align: 'left',
          field: (row) => row.contacto_telefono,
          sortable: true,
        },
        {
          name: 'contacto_correo',
          required: true,
          label: 'Contacto Correo',
          align: 'left',
          field: (row) => row.contacto_correo,
          sortable: true,
        },
        {
          name: 'telefono',
          required: true,
          label: 'Telefono',
          align: 'left',
          field: (row) => row.telefono,
          sortable: true,
        },
        {
          name: 'correo',
          required: true,
          label: 'Correo',
          align: 'left',
          field: (row) => row.correo,
          sortable: true,
        },
        {
          name: 'web_url',
          required: true,
          label: 'Web',
          align: 'left',
          field: (row) => row.web_url,
          sortable: true,
        },
      ],
    }
  },
  async created() {
    this.loading = true
    await this.CargarCentros()

    this.loading = false
  },
  methods: {
    tienePermiso(opcion) {

      let resultado = null
      switch (opcion) {
        case 'btnNuevo':
          resultado = puedeCrearCentros()
          break
        case 'btnEditar':
          resultado = puedeEditarCentros()
          break

        case 'btnInactivar':
          resultado = puedeEliminarCentros()
          break
        case 'btnReactivar':
          resultado = puedeEliminarCentros()
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
        case 'btnNuevo':
          resultado = this.tienePermiso(opcion)
          break
        case 'btnEditar':
          resultado = this.tienePermiso(opcion)
          break
        case 'btnInactivar':
          resultado = this.tienePermiso(opcion)
          break
        case 'btnReactivar':
          resultado = this.tienePermiso(opcion)
          break

        default:
          resultado = false
          break
      }
      return resultado
    },
      descargarExcel() {
        this.loading = true
        var method = 'post'
        var url = process.env.API_URL + '/centros/descargar'
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
            link.setAttribute('download', 'centros.xlsx') // or any other extension
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
    nuevoCentro() {
      // this.$store.commit('setNuevoCentro', true)
    },
    editarCentro() {
      // this.$store.commit('setNuevoCentro', false)
      // this.$store.commit('setSelected', this.selected)
    },
    onRequest(props) {
      this.CargarCentros(props)
    },

    preguntarInactivar() {
      this.confirmInactivar = true
    },

    preguntarReactivar() {
      this.confirmReactivar = true
    },

    reactivarCentro() {
      var url =
        process.env.API_URL + '/admin/centros/reactivar/' + this.selected[0].id

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'post',
        url: url,
        headers: headers,
      })
        .then((response) => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Centro eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.modalOpen = false
          this.CargarCentros()
          this.selected = []
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

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    inactivarCentro() {
      var url = process.env.API_URL + '/admin/centros/' + this.selected[0].id

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
            message: 'Centro eliminado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.modalOpen = false
          this.CargarCentros()
          this.selected = []
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

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    filtrarCentros(val, update, abort) {
      update(() => {
        this.CargarCentros(val)
      })
    },

    CargarCentros(props) {
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
      this.loadingCentros = true
      var url = process.env.API_URL + '/admin/centros'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      console.log({ headers })

      this.loadingTable = true

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
          console.log({ responseData: response.data })
          this.loadingTable = false
          this.centros = response.data.centros.data
          this.cursos = response.data.cursos
          this.loadingCentros = false

          this.centros = response.data.centros.data
          this.loading = false
          this.loadingCentros = false
          this.pagination.rowsNumber = response.data.centros.total
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.page = response.data.centros.current_page
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
        })
        .catch((error) => {
          this.loadingTable = false
          this.loadingCentros = false

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
    CursosXCentro(id) {
      return this.cursos.filter((c) => c.id_centro === id)
    },
  },
   computed: {

    idRol() {
      return Number(this.$store.state.user.rol)
    },
  },
}
</script>

<style scoped>
.Inactivo {
  font-weight: 600;
  color: grey;
}
</style>
