<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="row q-gutter-md">
        <!-- <q-btn class="bg-primary text-white"   to="/admin/participantes/nuevo">Nuevo</q-btn> -->

          <q-btn
          v-if="selected && selected.length > 0"
          class="bg-primary text-white"
          :to="`/admin/participantes/${this.selected[0].id}/Ver`"
        >
          Ver
        </q-btn>
        <q-btn
          v-if="selected && selected.length > 0"
          class="bg-primary text-white"
          :to="`/admin/participantes/${this.selected[0].id}/editar`"
        >
          Editar
        </q-btn>
        <q-btn
          v-if="
            selected && selected.length > 0 && selected[0].estado === 'Activo'
          "
          class="bg-negative text-white"
          @click="pregunarEliminar"
        >
          Inactivar
        </q-btn>
        <q-btn
          v-if="
            selected && selected.length > 0 && selected[0].estado === 'Inactivo'
          "
          class="bg-green text-white"
          @click="pregunarEliminar"
        >
          Activar
        </q-btn>
        <q-btn
          icon="autorenew"
          class="bg-primary text-white"
          @click="CargarEstudiantes"
        ></q-btn>
      </div>
      <q-table
        :dense="$q.screen.lt.md"
        title="Participantes"
        :data="participantes"
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
            Esta seguro que desea eliminar el participante seleccionado?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="default" v-close-popup />
          <q-btn
            flat
            label="Aceptar"
            class="bg-primary text-white"
            @click="eliminarEstudiante"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      confirm: false,

      selected: [],
      visibleColumns: [
        "id",
        "foto",
        "nombres",
        "apellidos",
        "telefono",
        "id_tipo_identificacion",
        "documento_identidad",
        "menor_edad",
        "fecha_nacimiento",
        "id_estado_civil",
        "sexo",
        "id_pais",
        "id_departamento",
        "id_ciudad",
        "direccion",
        "id_nivel_educacion",
        "estudiando",
        "curso_estudiando",
        "trabajando",
        "lugar_trabajo",
        "salario",
        "referencia_nombre",
        "referencia_cedula",
        "referencia_telefono",
        "referencia_correo"
      ],
      participantes: [],
      loading: false,
      loadingTable: false,
      filtro: "",
      pagination: {
        sortBy: "id",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: "nombre_completo",
          required: true,
          label: "Nombre participante",
          align: "left",
          field: row => row.nombre_completo,
          format: val => `${val}`,
          sortable: true
        },
        // {
        //   name: 'apellidos',
        //   required: true,
        //   label: 'Apellidos',
        //   align: 'left',
        //   field: row => row.apellidos,
        //   format: val => `${val}`,
        //   sortable: true
        // },
        {
          name: "telefono",
          required: true,
          label: "Telefono",
          align: "left",
          field: row => row.telefono,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "documento_identidad",
          required: true,
          label: "Cedula",
          align: "left",
          field: row => row.documento_identidad,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "fecha_nacimiento",
          required: true,
          label: "Fecha Nacimiento",
          align: "left",
          field: row => row.fecha_nacimiento,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "edad",
          required: true,
          label: "Edad",
          align: "left",
          field: row => row.edad,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "estado_civil",
          required: true,
          label: "Estado Civil",
          align: "left",
          field: row => row.estado_civil,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "sexo",
          required: true,
          label: "Sexo",
          align: "left",
          field: row => row.sexo,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "pais",
          required: true,
          label: "Pais",
          align: "left",
          field: row => row.pais,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "departamento",
          required: true,
          label: "Departamento",
          align: "left",
          field: row => row.departamento,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "ciudad",
          required: true,
          label: "Ciudad",
          align: "left",
          field: row => row.ciudad,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "direccion",
          required: true,
          label: "Dirección",
          align: "left",
          field: row => row.direccion,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "nivel_educacion",
          required: true,
          label: "Nivel Educación",
          align: "left",
          field: row => row.nivel_educacion,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "estado",
          required: true,
          label: "Estado",
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
    await this.CargarEstudiantes();

    this.loading = false;
  },
  methods: {
    descargarExcel() {
      this.loading = true;
      var method = "post";
      var url = process.env.API_URL + "/participantes/descargar";
      var headers = {
        Authorization: "Bearer " + this.$store.state.token
      };

      axios({
        method: method,
        responseType: "blob",
        url: url,
        headers: headers
      })
        .then(response => {
          this.loading = false;
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "participantes.xlsx"); // or any other extension
          document.body.appendChild(link);
          link.click();
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

    onRequest(props) {
      this.CargarEstudiantes(props);
    },

    nuevoEstudiante() {
      this.modalOpen = true;
      this.nuevo = true;
      this.LimpiarDatos();
    },
    pregunarEliminar() {
      this.confirm = true;
    },

    eliminarEstudiante() {
      var url =
        process.env.API_URL + "/admin/participantes/" + this.selected[0].id;

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
            message: "Participante eliminado correctamente",
            position: "bottom",
            timeout: 2000
          });
          this.selected = [];
          this.CargarEstudiantes();
        })
        .catch(error => {
          this.loading = false;
          console.log({ error });

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

    removeCredentials() {
      this.$store.dispatch("removeCredentials");
    },

    filtrarEstudiantes(val, update, abort) {
      update(() => {
        this.CargarEstudiantes(val);
      });
    },
    CargarEstudiantes(props) {
      this.loadingTable = true;
      let rowsPerPage = this.pagination.rowsPerPage;
      let page = this.pagination.page;
      if (props && props.pagination) {
        page = props.pagination.page;
        rowsPerPage = props.pagination.rowsPerPage;
      }
      this.loadingEstudiantes = true;
      var url = process.env.API_URL + "/admin/participantes";

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
          this.loadingTable = false;
          // this.participantes.splice(0, this.participantes.length, ...response.data.participantes.data)
          this.participantes = response.data.participantes.data;
          this.loadingEstudiantes = false;

          this.participantes = response.data.participantes.data;
          this.loading = false;
          this.loadingEstudiantes = false;
          this.pagination.rowsNumber = response.data.participantes.total;
          this.pagination.rowsPerPage = rowsPerPage;
          this.selected = [];
          this.pagination.page = response.data.participantes.current_page;
        })
        .catch(error => {
          this.loadingEstudiantes = false;
          this.loadingTable = false;

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
