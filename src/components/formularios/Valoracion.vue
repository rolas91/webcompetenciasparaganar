<template>
  <div class="itemPadding">
    <q-input
      :readonly="readonly"
      dense
      style="background-color:white;margin-bottom:10px;"
      full-width
      autofocus
      outlined
      color="primary"
      v-model="campo.texto"
      :label="campo.tipo"
    >
      <template v-slot:append>
        <q-icon
          @click="openFile()"
          name="image"
          class="bg-primary text-white"
          style="cursor:pointer"
        />
      </template>
    </q-input>

    <div>
      <q-img
        :readonly="readonly"
        v-if="campo.imagen && campo.imagen.length > 0"
        :src="campo.imagen"
        spinner-color="white"
        contain
        style="background-position: center!important;cursor:pointer"
        @click="openFile()"
      />
      <div class="center-mobile">
        <q-btn
          :readonly="readonly"
          v-if="campo.imagen && campo.imagen.length > 0"
          class="btn-delete-image"
          icon="delete_forever"
          @click="deleteImage"
          color="red"
        ></q-btn>
      </div>

      <q-uploader
        :readonly="readonly"
        :ref="ref"
        v-show="false"
        v-model="campo.imagen"
        label="Logo"
        :url="imageUrl"
        style="max-width: 300px;"
        @added="previewImage"
        @removed="RemoveFile"
        field-name="campo.imagen"
        hide-upload-btn
        no-thumbnails
        accept=".jpg, image/*"
      ></q-uploader>
    </div>

    <div class="row">
      <div class="col">
        <q-rating readonly="" v-model="ratingModel" size="3.5em" max="10" />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <q-space></q-space>
      <div class="col-md-3 col-12">
        <q-toggle v-model="campo.requerido">Requerido</q-toggle>
      </div>

      <div class="col-md-4 col-12">
        <q-toggle v-model="campo.agregarSubtitulo">Agregar subtitulo</q-toggle>
      </div>
    </div>

    <div class="row full-width">
      <div class="col-12">
        <q-input
          :readonly="readonly"
          v-if="campo.agregarSubtitulo"
          dense=""
          style="background-color:white;margin-top:10px;"
          full-width
          outlined
          color="primary"
          v-model="campo.subtitulo"
          label="Subtitulo"
        ></q-input>
      </div>
    </div>
    <br />
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "Texto",
  props: ["campo", "showNota", "readonly"],
  data() {
    return {
      emptyUrl: process.env.IMAGE_URL + "/placeholder.jpg",
      imageUrl: process.env.API_URL + "/admin/formularios/uploadImage",
      selected_file: "",
      uploadedUrl: "",
      options: [
        { id: 1, nombre: "Texto Corto", icono: "short_text" },
        { id: 2, nombre: "Texto Largo", icono: "format_align_justify" },
        { id: 3, nombre: "Numero", icono: "filter_1" },
        { id: 4, nombre: "Fecha", icono: "date_range" }
      ],
      ratingModel: 4,
      ratingColors: [
        "light-green-1",
        "light-green-2",
        "light-green-3",
        "light-green-4",
        "light-green-5",
        "light-green-6",
        "light-green-7",
        "light-green-8",
        "green-9",
        "green-10"
      ]
    };
  },
  methods: {
    hideDatePopUp(ref) {
      console.log({ ref: this.$refs[ref] });
      this.$refs[ref].hide(); // <= accessing the dynamic ref to hide the popup
    },
    isValidDate(val) {
      return moment(val, "DD/MM/YYYY",true).isValid();
    },
    openFile() {
      this.$refs[this.ref].reset();
      setTimeout(() => {
        this.$refs[this.ref].pickFiles();
      }, 0);
    },
    deleteImage() {
      this.RemoveFile();
      this.campo.imagen = null;
      this.campo.imagen_url = null;
    },
    file_selected(file) {
      this.selected_file = file[0];
      this.check_if_document_upload = true;
    },

    previewImage() {
      this.campo.imagen = URL.createObjectURL(this.$refs[this.ref].files[0]);
    },
    RemoveFile() {
      this.$refs[this.ref].reset();
    }
  },
  computed: {
    icono() {
      let result = "";
      switch (this.campo.tipo_input.id) {
        case 1:
          result = "short_text";
          break;

        case 2:
          result = "format_align_justify";
          break;

        case 3:
          result = "filter_1";
          break;

        case 4:
          result = "date_range";
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
.itemPadding {
  margin: 23px 30px;
}

.q-pa-md {
  padding: 16px;
}

.flex-right {
  display: flex;
  justify-content: flex-end;
}
</style>
