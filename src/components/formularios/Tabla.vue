<template>
  <div class="">
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
          v-if="campo.imagen && campo.imagen.length > 0"
          :src="campo.imagen"
          spinner-color="white"
          contain
          style="background-position: center !important; cursor: pointer;"
          @click="openFile()"
        />
        <div class="center-mobile">
          <q-btn
            :disable="readonly"
            v-if="campo.imagen && campo.imagen.length > 0"
            class="btn-delete-image"
            icon="delete_forever"
            @click="deleteImage"
            color="red"
          ></q-btn>
        </div>

        <q-uploader
          :disable="readonly"
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
        <div class="col-12 col-md-6">
          <!-- Filas -->
          <draggable

            tag="ul"
            class="list-group"
            @start="drag = true"
            @end="drag = false"
            handle=".handle"
            :list="campo.opciones[0].filas"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12">Filas</div>
            </div>
            <li
              class="list-group-item"
              v-for="(opcion, key) in campo.opciones[0].filas"
              :key="key"
            >
              <i class="fas fa-grip-vertical handle"></i>

              <div class="row">
                <div class="col-12">
                  <q-input
                    :readonly="readonly"
                    dense
                    style="background-color: white;"
                    v-model="campo.opciones[0].filas[key].nombre"
                    label="Opcion"
                    autofocus=""
                    @input="$emit('actualizarArregloTabla')"
                  >
                    <div
                      id="btnRemoveComponent"
                      style="display: flex; justify-content: right;"
                    >
                      <q-btn
                        :disable="readonly"
                        tabindex="-1"
                        flat
                        push=""
                        color="red"
                        class="btnClearOpcion btn-delete"
                        icon="clear"
                        @click="eliminarFila(campo, opcion)"
                      ></q-btn>
                    </div>
                  </q-input>
                </div>
              </div>
            </li>
          </draggable>
        </div>

        <div class="col-12 col-md-6">
          <!-- Columnas -->
          <draggable
            tag="ul"
            class="list-group"
            @start="drag = true"
            @end="drag = false"
            handle=".handle"
            :list="campo.opciones[1].columnas"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12">Columnas</div>
            </div>
            <li
              class="list-group-item"
              v-for="(opcion, key) in campo.opciones[1].columnas"
              :key="key"
            >
              <i class="fas fa-grip-vertical handle"></i>

              <div class="col-3">
                <q-input
                  :disable="readonly"
                  dense
                  style="background-color: white;"
                  v-model="campo.opciones[1].columnas[key].nombre"
                  label="Opcion"
                  autofocus=""
                  @input="$emit('actualizarArregloTabla')"
                >
                  <div
                    id="btnRemoveComponent"
                    style="display: flex; justify-content: right;"
                  >
                    <q-btn
                      :disable="readonly"
                      tabindex="-1"
                      flat
                      push=""
                      color="red"
                      class="btnClearOpcion btn-delete"
                      icon="clear"
                      @click="eliminarColumna(campo, opcion)"
                    ></q-btn>
                  </div>
                </q-input>
              </div>
            </li>
          </draggable>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-6 col-md-4">
          <q-btn class="btnAgregarOpcion" @click="agregarFila(campo)">
            Agregar Fila
          </q-btn>
        </div>

        <div class="col-6 col-md-4 offset-md-3">
          <q-btn class="btnAgregarOpcion" @click="agregarColumna(campo)">
            Agregar Columna
          </q-btn>
        </div>
      </div>

      <div class="row full-width">
        <div class="col-12">
          <q-input
            :disable="readonly"
            dense=""
            style="background-color: white; margin-top: 10px;"
            full-width
            outlined
            autofocus
            color="primary"
            v-model="campo.subtitulo"
            label="Subtitulo"
          ></q-input>
        </div>
      </div>

      <div class="row flex-right">
        <div v-if="showNota" class="col-md-4 col-12">
          <q-input
            readonly=""
            v-model.number="campo.nota"
            type="number"
            style="max-width: 200px; font-size: 18px; font-weight: bold;"
            label="Máximo de Puntos"
            @change="actualizarNota"
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
                  <!-- <q-item-label caption>{{ scope.opt.nombre }}</q-item-label> -->
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-md-4 col-12">
          <q-toggle :disable="readonly" v-model="campo.requerido">
            Los Valores de las filas son requeridos
          </q-toggle>
        </div>
      </div>

      <!-- Tabla -->

      <div
        v-if="showNota && campo.arregloTable && campo.arregloTable.length > 0"
        class="row q-col-gutter-md bg-white"
      >
        <label class="titulo">Configuración de puntos</label>
        <table>
          <thead class="text-center">
            <td></td>
            <td
              class="col"
              v-for="col in campo.arregloTable[0].columns"
              :key="col.id"
            >
              {{ col.valor }}
            </td>
          </thead>
          <tr v-for="fila in campo.arregloTable" :key="fila.id">
            <span style="display: flex; margin-top: 30pxmargin-topmargin-top;">
              {{ fila.valor }}
            </span>
            <td v-for="columna in fila.columns" :key="columna.id">
              <q-input
                :disable="readonly"
                @change="updateNotaTabla"
                input-class="text-right"
                type="number"
                v-model="columna.nota"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val >= 0) ||
                    !val ||
                    'Ingrese un valor mayor o igual a 0',
                ]"
              ></q-input>
            </td>
          </tr>
        </table>
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
    updateNotaTabla() {
      this.$emit('updateNotaTabla')

      // this.$forceUpdate()
    },

    actualizarNota() {
      this.$emit('actualizarNota')
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
    eliminarOpcion(campo, opcion) {
      campo.opciones = campo.opciones.filter((item) => item.id !== opcion.id)
      this.$emit('actualizarArregloTabla')
    },

    eliminarFila(campo, opcion) {
      campo.opciones[0].filas = campo.opciones[0].filas.filter(
        (item) => item.id !== opcion.id,
      )
      this.$emit('actualizarArregloTabla')
    },

    eliminarColumna(campo, opcion) {
      campo.opciones[1].columnas = campo.opciones[1].columnas.filter(
        (item) => item.id !== opcion.id,
      )
      this.$emit('actualizarArregloTabla')
    },

    agregarFila(campo) {
      let max =
        campo.opciones[0].filas.length <= 2
          ? campo.opciones[0].filas.length
          : arrayMax(campo.opciones[0].filas)
      let size = max === 0 ? 1 : max + 1
      let nuevaOpcion = {
        id: size,
        nombre: 'Fila' + size,
      }
      campo.opciones[0].filas.push(nuevaOpcion)
      this.$emit('actualizarArregloTabla')
    },
    agregarColumna(campo) {
      let max =
        campo.opciones[1].columnas.length <= 2
          ? campo.opciones[1].columnas.length
          : arrayMax(campo.opciones[1].columnas)
      let size = max === 0 ? 1 : max + 1
      let nuevaOpcion = {
        id: size,
        nombre: 'Columna' + size,
        valor: false,
        nota: 0,
      }
      campo.opciones[1].columnas.push(nuevaOpcion)
      this.$emit('actualizarArregloTabla')
    },
    actualizarArregloTabla() {
      this.$emit('ActualizarArregloTabla')
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
    filas(){
      return campo.opciones[0].filas;
    },
    columnas(){
      return campo.opciones[1].columnas
    }
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

.btnClearOpcion {
  display: block;
  position: absolute;
  right: 0px;
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

.titulo {
  font-size: 20px;
  font-weight: 600;
  color: #027be3;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
