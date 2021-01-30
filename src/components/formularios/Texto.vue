<template>
  <div class="itemPadding">
    <q-input
      :readonly="readonly"
      dense
      style="background-color: white; margin-bottom: 10px;"
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
          style="cursor: pointer;"
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
        style="background-position: center !important; cursor: pointer;"
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

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-select
          :readonly="readonly"
          dense
          v-model="campo.tipo_input"
          :options="options"
          label="Tipo de respuesta"
          option-value="id"
          option-label="nombre"
        >
          <template v-slot:prepend>
            <q-icon style="margin-top: 15px;" :name="icono" @click.stop />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icono" />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.nombre" />
                <!-- <q-item-label caption>{{ scope.opt.nombre }}</q-item-label> -->
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div v-if="showNota" class="col-12 col-md-2">
        <q-input
          :readonly="readonly"
          dense
          @change="actualizarNota"
          v-model.number="campo.nota"
          type="number"
          style="max-width: 200px;"
          label="Puntos"
          lazy-rules
          :rules="[
            (val) => (val && val >= 0) || !val || 'Ingrese un valor mayor a 0',
          ]"
        />
      </div>

      <div
        v-if="campo.id_tipo === 2 && campo.tipo_input.id === 4"
        class="col-12 col-md-3"
      >
        <q-input
          :readonly="readonly"
          label="Minimo"
          dense
          outlined
          v-model="campo.minimo"
          lazy-rules
          :rules="[
            (val) =>
              (isValidDate(val) && /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
              'Ingrese un fecha válida',
          ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                :ref="'qDateProxy' + campo.id + 'Minimo'"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  mask="DD/MM/YYYY"
                  v-model="campo.minimo"
                  @input="
                    () => hideDatePopUp('qDateProxy' + campo.id + 'Minimo')
                  "
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div
        v-if="campo.id_tipo === 2 && campo.tipo_input.id === 4"
        class="col-12 col-md-3"
      >
        <q-input
          :readonly="readonly"
          label="Máximo"
          dense
          outlined
          v-model="campo.maximo"
          lazy-rules
          :rules="[
            (val) =>
              (isValidDate(val) && /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
              'Ingrese un fecha válida',
          ]"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                :ref="'qDateProxy' + campo.id + 'Máximo'"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  mask="DD/MM/YYYY"
                  v-model="campo.maximo"
                  @input="
                    () => hideDatePopUp('qDateProxy' + campo.id + 'Máximo')
                  "
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Si es tipo numero añadimos opcion de valor maximo -->
      <div
        v-if="campo.id_tipo === 2 && campo.tipo_input.id === 3"
        class="col-12 col-md-2"
      >
        <q-input
          :readonly="readonly"
          dense
          v-model.number="campo.minimo"
          type="number"
          style="max-width: 200px;"
          label="Mínimo"
        />
      </div>

      <!-- Si es tipo numero añadimos opcion de valor valor maximo -->
      <div
        v-if="campo.id_tipo === 2 && campo.tipo_input.id === 3"
        class="col-12 col-md-2"
      >
        <q-input
          :readonly="readonly"
          dense
          v-model.number="campo.maximo"
          type="number"
          style="max-width: 200px;"
          label="Máximo"
        />
      </div>

      <q-space></q-space>
      <div class="col-md-3 col-12">
        <q-toggle v-model="campo.requerido">Requerido</q-toggle>
      </div>


    </div>

    <div class="row full-width">
      <div class="col-12">
        <q-input
          :readonly="readonly"

          dense=""
          style="background-color: white; margin-top: 10px;"
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
import moment from 'moment'
export default {
  name: 'Texto',
  props: ['campo', 'showNota', 'readonly'],
  data() {
    return {
      emptyUrl: process.env.IMAGE_URL + '/placeholder.jpg',
      imageUrl: process.env.API_URL + '/admin/formularios/uploadImage',
      selected_file: '',
      uploadedUrl: '',
      options: [
        { id: 1, nombre: 'Texto Corto', icono: 'short_text' },
        { id: 2, nombre: 'Texto Largo', icono: 'format_align_justify' },
        { id: 3, nombre: 'Numero', icono: 'filter_1' },
        { id: 4, nombre: 'Fecha', icono: 'date_range' },
      ],
    }
  },
  methods: {
    actualizarNota() {
      this.$emit('actualizarNota')
    },
    hideDatePopUp(ref) {
      console.log({ ref: this.$refs[ref] })
      this.$refs[ref].hide() // <= accessing the dynamic ref to hide the popup
    },
    isValidDate(val) {
      console.log({ val })
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },
    openFile() {
      this.$refs[this.ref].reset()
      setTimeout(() => {
        this.$refs[this.ref].pickFiles()
      }, 0)
    },
    deleteImage() {
      this.RemoveFile()
      this.campo.imagen = null
      this.campo.imagen_url = null
    },
    file_selected(file) {
      this.selected_file = file[0]
      this.check_if_document_upload = true
    },

    previewImage() {
      this.campo.imagen = URL.createObjectURL(this.$refs[this.ref].files[0])
    },
    RemoveFile() {
      this.$refs[this.ref].reset()
    },
  },
  computed: {
    icono() {
      let result = ''
      switch (this.campo.tipo_input.id) {
        case 1:
          result = 'short_text'
          break

        case 2:
          result = 'format_align_justify'
          break

        case 3:
          result = 'filter_1'
          break

        case 4:
          result = 'date_range'
          break

        default:
          break
      }

      return result
    },
    ref() {
      return 'uploader' + this.campo.id
    },
  },
}
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
