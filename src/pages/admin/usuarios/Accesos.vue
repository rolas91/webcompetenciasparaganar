<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <!-- <q-btn class="bg-primary text-white" @click="nuevoAcceso">Nuevo</q-btn> -->
        <q-btn
          v-if="selected.length > 0"
          class="bg-primary text-white"
          @click="editarAcceso"
          >Editar</q-btn
        >
        <q-btn
          v-if="selected.length > 0"
          class="bg-negative text-white"
          @click="pregunarEliminar"
          >Eliminar</q-btn
        >
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarAccesos"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Accesos"
        :data="accesos"
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
          <h5>{{ nuevo ? "Nuevo Acceso" : "Editar Acceso" }}</h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form @submit="onSubmit" class>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="acceso.nombre"
                  label="Nombre"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 100) ||
                      'Ingrese un Nombre válido'
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="acceso.descripcion"
                  label="Descripcion"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="acceso.icon"
                  label="Icon"
                ></q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  color="primary"
                  v-model="acceso.path"
                  label="Path"
                ></q-input>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                bg-color="white"
                v-model="acceso.orden"
                type="number"
                label="Orden"
                lazy-rules
                :rules="[
                  val =>
                    val >= 0 ||
                    'Ingrese los experiencia (Un número entre 0 y 100)'
                ]"
              ></q-input>
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
                >Guardar</q-btn
              >
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
          <span class="q-ml-sm"
            >Esta seguro que desea eliminar el acceso seleccionado?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarAcceso"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      confirm: false,
      nuevo: true,
      selected: [],
      visibleColumns: ["id", "nombre", "descripcion", "icon", "path"],
      acceso: {
        id: 0,
        nombre: "",
        descripcion: "",
        icon: "",
        path: "",
        orden: 0
        // created_at : null,
        // updated_at : null,
      },
      accesos: [],
      loading: false,
      modalOpen: false,
      loadingTable: false,
      filtro: "",
      pagination: {
        sortBy: "orden",
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 10
      },
      columns: [
        {
          name: "id",
          required: true,
          label: "Id",
          align: "left",
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "nombre",
          required: true,
          label: "Nombre",
          align: "left",
          field: row => row.nombre,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "descripcion",
          required: true,
          label: "Descripcion",
          align: "left",
          field: row => row.descripcion,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "icon",
          required: true,
          label: "Icon",
          align: "left",
          field: row => row.icon,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "path",
          required: true,
          label: "Path",
          align: "left",
          field: row => row.path,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "orden",
          required: true,
          label: "Orden",
          align: "left",
          field: row => row.orden,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "estado",
          required: true,
          label: "estado",
          align: "left",
          field: row => row.estado,
          format: val => `${val}`,
          sortable: true
        }
      ]
    };
  },
  async created() {
    this.loading = true;
    await this.CargarAccesos();

    this.loading = false;
  },
  methods: {
    RecargarAccesos() {
      let url = process.env.API_URL + "/usuarios/accesos";

      var headers = {
        Authorization: "Bearer " + this.$store.state.token
      };
      axios({
        method: "get",
        url: url,
        headers: headers
      })
        .then(response => {
          // console.log({ accesos: this.response.data.accesos })
          this.$store.commit("setAccesos", response.data.accesos);
          localStorage.setItem(
            "accesos",
            JSON.stringify(response.data.accesos)
          );
        })
        .catch(error => {
          this.loadingAccesos = false;

          if (error.response.status === 401) {
            this.removeCredentials();
            this.$router.push({
              name: "login"
            });
          }
        });
    },
    onRequest(props) {
      this.CargarAccesos(props);
    },

    nuevoAcceso() {
      this.modalOpen = true;
      this.nuevo = true;
      this.LimpiarDatos();
    },
    pregunarEliminar() {
      this.confirm = true;
    },
    eliminarAcceso() {
      var url = process.env.API_URL + "/admin/accesos/" + this.selected[0].id;

      var headers = {
        Authorization: "Bearer " + this.$store.state.token
      };

      axios({
        method: "delete",
        url: url,

        headers: headers
      })
        .then(response => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "fas fa-check-circle",
            message: "Acceso eliminado correctamente",
            position: "bottom",
            timeout: 2000
          });
          this.modalOpen = false;
          this.LimpiarDatos();
          this.CargarAccesos();
          this.selected = [];
        })
        .catch(error => {
          this.loading = false;
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "fas fa-exclamation-triangle",
            message: error.response.data
          });

          if (error.response.status === 401) {
            this.removeCredentials();
            this.$router.push({
              name: "login"
            });
          }
        });
    },
    async editarAcceso() {
      this.nuevo = false;
      Object.keys(this.selected[0]).forEach(key => {
        if (this.acceso.hasOwnProperty(key)) {
          this.acceso[key] = this.selected[0][key];
        }
      });
      this.modalOpen = true;
      await this.CargarAccesos();
    },
    LimpiarDatos() {
      this.acceso.id = 0;
      this.acceso.nombre = "";
      this.acceso.descripcion = "";
      this.acceso.icon = "";
      this.acceso.path = "";
      this.acceso.created_at = null;
      this.acceso.updated_at = null;
    },

    removeCredentials() {
      this.$store.dispatch("removeCredentials");
    },

    filtrarAccesos(val, update, abort) {
      update(() => {
        this.CargarAccesos(val);
      });
    },

    isValidDate(val) {
      return moment(val, "DD/MM/YYYY",true).isValid();
    },
    onSubmit() {
      this.loading = true;
      var method = "post";

      var url = process.env.API_URL + "/admin/accesos";
      if (!this.nuevo) {
        url = process.env.API_URL + "/admin/accesos/" + this.selected[0].id;
        method = "put";
      }

      var headers = {
        Authorization: "Bearer " + this.$store.state.token
      };

      axios({
        method: method,
        url: url,
        data: { acceso: this.acceso },

        headers: headers
      })
        .then(response => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "fas fa-check-circle",
            message: "Acceso creado correctamente",
            position: "bottom",
            timeout: 2000
          });
          this.modalOpen = false;
          this.LimpiarDatos();
          this.CargarAccesos();
          this.selected = [];
        })
        .catch(error => {
          this.loading = false;
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "fas fa-exclamation-triangle",
            message: error.response.data.message
          });

          if (error.response.status === 401) {
            this.removeCredentials();
            this.$router.push({
              name: "login"
            });
          }
        });
    },

    CargarAccesos(props) {
      let rowsPerPage = this.pagination.rowsPerPage;
      let page = this.pagination.page;
      if (props && props.pagination) {
        // page = props.pagination.page
        rowsPerPage = props.pagination.rowsPerPage;
      }
      this.loadingAccesos = true;
      var url = process.env.API_URL + "/admin/accesos";

      var headers = {
        Authorization: "Bearer " + this.$store.state.token
      };

      axios({
        method: "get",
        url: url,
        params: { rowsPerPage: rowsPerPage, filtro: this.filtro, page: page },

        headers: headers
      })
        .then(response => {
          this.accesos = response.data.accesos.data;
          this.loadingAccesos = false;

          this.accesos = response.data.accesos.data;
          this.loading = false;
          this.loadingAccesos = false;
          this.pagination.rowsNumber = response.data.accesos.total;
          this.pagination.rowsPerPage = rowsPerPage;
        })
        .catch(error => {
          this.loadingAccesos = false;

          if (error.response.status === 401) {
            this.removeCredentials();
            this.$router.push({
              name: "login"
            });
          }
        });
    }
  }
};
</script>

<style scoped></style>
