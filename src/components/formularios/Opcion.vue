<template>
  <div class="">
    <div class="itemPadding">
      <q-input
        :readonly="readonly"
        dense
        style="background-color: white; margin-bottom: 10px;"
        full-width
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
            v-if="!readonly && campo.imagen && campo.imagen.length > 0"
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

      <draggable
        :readonly="readonly"
        tag="ul"
        class="list-group"
        @start="drag = true"
        @end="drag = false"
        handle=".handle"
        :list="campo.opciones"
      >
        <li
          class="list-group-item"
          v-for="(opcion, index) in campo.opciones"
          :key="index"
        >
          <i class="fas fa-grip-vertical handle"></i>

          <div
            v-if="campo.tipo_input.id === 1 || campo.tipo_input.id === 3"
            class="row q-col-gutter-md"
          >
            <!-- Si es tipo radio button o Select -->
            <div class="col-10 col-sm-10">
              <q-input
                :readonly="readonly"
                dense
                style="background-color: white;"
                outlined
                v-model="opcion.nombre"
                label="Opcion"
              >
                <div
                  id="btnRemoveComponent"
                  style="display: flex; justify-content: right;"
                >
                  <q-btn
                    v-if="!readonly"
                    :readonly="readonly"
                    tabindex="-1"
                    flat
                    push=""
                    color="red"
                    class="btnEliminarOpcion btn-delete"
                    icon="delete_forever"
                    @click="eliminarOpcion(campo, opcion)"
                  ></q-btn>
                </div>
              </q-input>
            </div>
          </div>

          <div
            v-if="campo.id_tipo === 1 && campo.tipo_input.id === 2"
            class="row q-col-gutter-md"
          >
            <!-- Si es checkbox multiple -->
            <div class="col-10">
              <q-input
                outlined=""
                :readonly="readonly"
                style="background-color: white;"
                dense=""
                v-model="opcion.nombre"
                label="Opcion"
              >
                <div
                  id="btnRemoveComponent"
                  style="display: flex; justify-content: right;"
                >
                  <q-btn
                    v-if="!readonly"
                    :readonly="readonly"
                    tabindex="-1"
                    flat
                    push=""
                    color="red"
                    class=""
                    icon="delete_forever"
                    @click="eliminarOpcion(campo, opcion)"
                  ></q-btn>
                </div>
              </q-input>
            </div>

            <div class="col" v-if="showNota">
              <q-input
                outlined=""
                type="number"
                input-class="text-right"
                label="Puntos"
                dense=""
                style="max-width: 100px;"
                v-model="opcion.nota"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val >= 0) || !val || 'Ingrese un valor mayor a 0',
                ]"
                @input="actualizarNota"
              ></q-input>
            </div>
          </div>
        </li>
      </draggable>

      <div class="row q-col-gutter-md">
        <div class>
          <q-btn
            :readonly="readonly"
            class="btnAgregarOpcion"
            @click="agregarNuevaOpcion(campo)"
          >
            Agregar Opción
          </q-btn>
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

      <div class="row flex-right">
        <div v-if="showNota" class="col-md-4 col-12">
          <q-input
            :readonly="readonly || campo.tipo_input.id === 2"
            v-model.number="campo.nota"
            type="number"
            style="max-width: 200px;"
            label="Puntos"
            @input="actualizarNota"
            lazy-rules
            :rules="[
              (val) =>
                (val && val >= 0) || !val || 'Ingrese un valor mayor a 0',
            ]"
          />
        </div>
        <div class="col-md-4 col-12">
          <q-select
            :readonly="readonly"
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
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-md-4 col-12">
          <q-toggle :disable="readonly" v-model="campo.requerido">
            Requerido
          </q-toggle>
        </div>
      </div>

      <div
        v-if="campo.tipo_input.id === 1 || campo.tipo_input.id === 3"
        class="row"
      >
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
          ></q-select>

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
          ></q-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
function arrayMax(arr) {
  return arr.reduce(function (p, v) {
    return p.id > v.id ? p.id : v.id
  })
}
export default {
  name: 'Opcion',
  components: {
    draggable,
  },
  props: ['campo', 'showNota', 'readonly'],
  data() {
    return {
      emptyUrl: process.env.IMAGE_URL + '/placeholder.jpg',
      imageUrl: process.env.API_URL + '/admin/formularios/uploadImage',
      selected_file: '',
      uploadedUrl: '',
      drag: false,
      options: [
        { id: 1, nombre: 'Seleccion Multiple', icono: 'far fa-dot-circle' },
        {
          id: 2,
          nombre: 'Casillas de verificación',
          icono: 'far fa-check-square',
        },
        { id: 3, nombre: 'Desplegable', icono: 'far fa-caret-square-down' },
      ],
    }
  },
  methods: {
    actualizarNota() {
      if (this.readonly) return

      // Si es multiples opciones, actualizamos la nota a nivel de campo
      if (this.campo.tipo_input.id === 2) {
        let nota = 0
        this.campo.opciones.forEach((opcion) => {
          nota += Number(opcion.nota)
        })
        this.campo.nota = nota
      }

      this.$emit('actualizarNota')
    },
    openFile() {
      if (this.readonly) return
      this.$refs[this.ref].reset()
      setTimeout(() => {
        this.$refs[this.ref].pickFiles()
      }, 0)
    },
    deleteImage() {
      if (this.readonly) return
      this.RemoveFile()
      this.campo.imagen = null
      this.campo.imagen_url = null
    },
    file_selected(file) {
      if (this.readonly) return
      this.selected_file = file[0]
      this.check_if_document_upload = true
    },

    previewImage() {
      if (this.readonly) return
      this.campo.imagen = URL.createObjectURL(this.$refs[this.ref].files[0])
    },
    RemoveFile() {
      if (this.readonly) return
      this.$refs[this.ref].reset()
    },
    eliminarOpcion(campo, opcion) {
      if (this.readonly) return
      campo.opciones = campo.opciones.filter((item) => item.id !== opcion.id)
    },
    agregarNuevaOpcion(campo) {
      if (this.readonly) return
      let max =
        campo.opciones.length <= 2
          ? campo.opciones.length
          : arrayMax(campo.opciones)
      let size = max === 0 ? 1 : max + 1
      let nuevaOpcion = {
        id: size,
        nombre: 'Opcion' + size,
        respuesta: null,
        nota: 0,
      }
      campo.opciones.push(nuevaOpcion)
    },
  },
  computed: {
    icono() {
      let result = ''
      switch (this.campo.tipo_input.id) {
        case 1:
          result = 'far fa-dot-circle'
          break

        case 2:
          result = 'far fa-check-square'
          break

        case 3:
          result = 'far fa-caret-square-down'
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
