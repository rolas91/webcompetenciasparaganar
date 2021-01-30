<template>
  <div class="">
    <div class="itemPadding">
      <q-input
        :readonly="readonly"
        dense
        style="background-color:white;margin-bottom:10px;"
        full-width
        outlined
        color="primary"
        v-model="campo.texto"
        :label="campo.tipo"
      >
      </q-input>
      <label>[Municipios]</label>

      <div class="row">
        <div v-if="showNota" class="col-md-4 col-12">
          <q-input
            :readonly="readonly"
            v-model.number="campo.nota"
            type="number"
            style="max-width: 200px"
            label="Puntos"
            @change="actualizarNota"
            lazy-rules
            :rules="[
              val => (val && val >= 0) || !val || 'Ingrese un valor mayor a 0'
            ]"
          />
        </div>

        <div class="col-md-4 col-12">
          <q-toggle :disable="readonly" v-model="campo.requerido"
            >Requerido</q-toggle
          >
        </div>

        <div class="col-md-4 col-12">
          <q-toggle @input="recargarMunicipios" :disable="readonly" v-model="campo.FiltrarXDepartamento"
            >Filtrar por departamento</q-toggle
          >
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <q-select
            :readonly="readonly"
            v-if="showNota && campo.id_tipo === 1 && campo.tipo_input.id === 2"
            multiple=""
            v-model="campo.respuestas_correctas"
            :options="campo.opciones"
            label="Respuesta correcta"
            option-value="id"
            option-label="nombre"
          >
          </q-select>

          <q-select
            :readonly="readonly"
            v-if="
              showNota && !(campo.id_tipo === 1 && campo.tipo_input.id === 2)
            "
            v-model="campo.respuesta_correcta"
            :options="campo.opciones"
            label="Respuesta correcta"
            option-value="id"
            option-label="nombre"
          >
          </q-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function arrayMax(arr) {
  return arr.reduce(function(p, v) {
    return p.id > v.id ? p.id : v.id;
  });
}
export default {
  name: "Opcion",

  props: ["campo", "showNota", "readonly"],
  data() {
    return {
      emptyUrl: process.env.IMAGE_URL + "/placeholder.jpg",
      imageUrl: process.env.API_URL + "/admin/formularios/uploadImage",
      selected_file: "",
      uploadedUrl: "",
      drag: false,
      options: [
        { id: 1, nombre: "Seleccion Multiple", icono: "far fa-dot-circle" },
        {
          id: 2,
          nombre: "Casillas de verificación",
          icono: "far fa-check-square"
        },
        { id: 3, nombre: "Desplegable", icono: "far fa-caret-square-down" }
      ]
    };
  },
  methods: {
    actualizarNota() {
      if (this.readonly) return;
      this.$emit("actualizarNota");
    },

    recargarMunicipios(){
      this.$emit("recargarMunicipios");
    },
    openFile() {
      if (this.readonly) return;
      this.$refs[this.ref].reset();
      setTimeout(() => {
        this.$refs[this.ref].pickFiles();
      }, 0);
    },
    deleteImage() {
      if (this.readonly) return;
      this.RemoveFile();
      this.campo.imagen = null;
      this.campo.imagen_url = null;
    },
    file_selected(file) {
      if (this.readonly) return;
      this.selected_file = file[0];
      this.check_if_document_upload = true;
    },

    previewImage() {
      if (this.readonly) return;
      this.campo.imagen = URL.createObjectURL(this.$refs[this.ref].files[0]);
    },
    RemoveFile() {
      if (this.readonly) return;
      this.$refs[this.ref].reset();
    },
    eliminarOpcion(campo, opcion) {
      if (this.readonly) return;
      campo.opciones = campo.opciones.filter(item => item.id !== opcion.id);
    },
    agregarNuevaOpcion(campo) {
      if (this.readonly) return;
      let max =
        campo.opciones.length <= 2
          ? campo.opciones.length
          : arrayMax(campo.opciones);
      let size = max === 0 ? 1 : max + 1;
      let nuevaOpcion = {
        id: size,
        nombre: "Opcion" + size
      };
      campo.opciones.push(nuevaOpcion);
    }
  },
  computed: {
    icono() {
      let result = "";
      switch (this.campo.tipo_input.id) {
        case 1:
          result = "far fa-dot-circle";
          break;

        case 2:
          result = "far fa-check-square";
          break;

        case 3:
          result = "far fa-caret-square-down";
          break;

        default:
          break;
      }

      return result;
    },
    ref() {
      return "uploader" + this.campo.id;
    }
  }
};
</script>

<style scoped>
.option-item {
  margin-left: 30px;
  margin-top: 10px;
}
.btnAgregarOpcion {
  margin: 10px 10px 10px 0px;
}
.btnEliminarOpcion {
  display: block;
  position: absolute;
  right: -60px;
  top: 3px;
}

.flex-right {
  display: flex;
  justify-content: flex-end;
}

.itemPadding {
  margin: 23px 30px;
}

.q-pa-md {
  padding: 16px;
}

.handle {
  float: left;
  padding-top: 12px;
  padding-bottom: 8px;
  padding-right: 15px;
  cursor: grabbing;
  color: #444;
}

.list-group {
  padding-left: 0;
  margin-bottom: 20px;
}

ol,
ul {
  margin-top: 0;
  margin-bottom: 10px;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 10px 15px;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #ddd;
}
.btn-delete {
  padding: 5px !important;
}
</style>
