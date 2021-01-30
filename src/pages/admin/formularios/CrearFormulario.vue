<template>
  <div class="bg-white">
    <q-page
      id="crearFormulario"
      class="bg-white"
      style="margin: auto; padding-top: 80px;"
      :style="'width:' + ancho"
    >
      <q-page-sticky
        position="top-right"
        style="
          z-index: 99;
          width: 100%;
          justify-content: flex-end;
          background-color: white;
          padding: 18px;
        "
      >
        <q-btn
          flat
          title="Vista Previa"
          color="primary"
          icon="visibility"
          @click="VistaPrevia"
        >
          Vista Previa
        </q-btn>
      </q-page-sticky>

      <q-page-sticky position="top-left" style="z-index: 99; padding: 18px;">
        <q-btn
          v-if="!readonly"
          color="primary"
          flat
          icon="save"
          @click="onSubmit"
        >
          Guardar
        </q-btn>
      </q-page-sticky>

      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm">
              Hay un borrador guardado, desea continuar o iniciar uno nuevo?
            </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Nuevo"
              color="default"
              v-close-popup
              @click="nuevoFormulario"
            />
            <q-btn
              flat
              label="Continuar"
              class="bg-primary text-white"
              @click="continuar"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="PreguntaEliminarRegla" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm">
              ¿Estás seguro(a) de eliminar la regla seleccionada?
            </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="default" v-close-popup />
            <q-btn
              flat
              label="Eliminar"
              class="bg-red text-white"
              @click="eliminarReglaSeleccionada"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="reglasOpen">
        <q-card style="width: 1200px; max-width: 90vw;">
          <q-card-section class="bg-blue-background text-white q-gutter-sm">
            <div class="text-h6">Reglas de exclusión</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-3">
                <q-select
                  dense
                  options-dense
                  v-model="idseccion"
                  :options="formulario.secciones"
                  option-value="id"
                  option-label="titulo"
                  label="Seleccione la sección"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-6 col-md-3">
                <q-select
                  dense
                  options-dense
                  v-model="idcampo"
                  :readonly="!camposEvaluar"
                  :options="camposEvaluar"
                  option-value="id"
                  option-label="texto"
                  label="Seleccione el campo"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-6 col-md-1">
                <q-select
                  dense
                  options-dense
                  v-model="operacion"
                  :readonly="!camposEvaluar"
                  :options="operaciones"
                  label="operador"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-6 col-md-2">
                <q-select
                  v-if="!idcampo"
                  dense
                  options-dense
                  v-model="idrespuesta"
                  :readonly="true"
                  :options="opcionesExclusion"
                  option-value="id"
                  option-label="nombre"
                  label="Seleccione el valor"
                  emit-value
                  map-options
                />
                <q-select
                  v-if="idcampo && getTipoCampo == 1"
                  dense
                  options-dense
                  v-model="idrespuesta"
                  :readonly="!idseccion || !operacion || !idcampo"
                  :options="opcionesExclusion"
                  option-value="id"
                  option-label="nombre"
                  label="Seleccione el valor"
                  emit-value
                  map-options
                />

                <!-- texto -->
                <q-input
                  dense
                  v-if="esCampoTexto"
                  v-model.number="idrespuesta"
                  :readonly="!idseccion || !operacion || !idcampo"
                  type="text"
                />

                <!-- numero -->
                <q-input
                  :readonly="!idseccion || !operacion || !idcampo"
                  dense
                  v-if="esCampoNumerico"
                  v-model.number="idrespuesta"
                  type="number"
                />

                <!-- Fecha -->
                <q-input
                  :readonly="!idseccion || !operacion || !idcampo"
                  dense
                  v-if="esCampoFecha"
                  v-model="idrespuesta"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        :ref="'qDateProxy' + idrespuesta"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          mask="DD/MM/YYYY"
                          v-model="idrespuesta"
                          @input="
                            () => hideDatePopUp('qDateProxy' + idrespuesta)
                          "
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-6 col-md-3">
                <q-select
                  dense
                  options-dense
                  v-model="Eidseccion"
                  :readonly="!idrespuesta"
                  :options="formulario.secciones"
                  option-value="id"
                  option-label="titulo"
                  label="sección a excluir"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-6 col-md-3" v-if="!excluirFullSeccion">
                <q-select
                  dense
                  options-dense
                  v-model="Eidcampo"
                  :readonly="!Eidseccion"
                  :options="camposExcluir"
                  option-value="id"
                  option-label="texto"
                  label="campo a excluir"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-6-col-md-2">
                <q-checkbox
                  :disable="!Eidseccion"
                  left-label
                  v-model="excluirFullSeccion"
                  label="Excluir toda la sección"
                />
              </div>

              <div class="col-3 col-md-2">
                <q-btn
                  :disable="
                    !idseccion ||
                    !operacion ||
                    !idcampo ||
                    !Eidseccion ||
                    !idrespuesta
                  "
                  :label="nuevaRegla ? 'Agregar Regla' : 'Editar Regla'"
                  color="primary"
                  @click="guardarRegla"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator></q-separator>

          <q-card-section>
            <q-table
              :dense="$q.screen.lt.md"
              title="Reglas de exclusión"
              :data="reglasTabla"
              :columns="columns"
              row-key="id"
              selection="single"
              :selected.sync="selected"
              :loading="loadingTable"
              :pagination.sync="pagination"
            >
              <template v-slot:top>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-btn
                      dense
                      class="bg-primary text-white"
                      :disable="loading || selected.length == 0 || !nuevaRegla"
                      label="Editar"
                      @click="editarRegla"
                    />
                  </div>
                  <div class="col" v-if="selected.length > 0 && !nuevaRegla">
                    <q-btn
                      dense
                      class="bg-black text-white"
                      label="Cancelar"
                      @click="limpiarCamposRegla"
                    />
                  </div>

                  <div class="col" v-if="selected.length > 0">
                    <q-btn
                      dense
                      class="bg-red text-white"
                      label="Eliminar"
                      @click="PreguntaEliminarRegla = true"
                    />
                  </div>
                </div>
              </template>
            </q-table>
          </q-card-section>

          <q-card-actions
            align="right"
            class="bg-white text-teal q-pt-xl q-px-xl"
          >
            <q-btn
              class="q-px-xl"
              flat
              label="Cancelar"
              color="black"
              v-close-popup
            />
            <q-btn flat label="Aceptar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-card-section class="bg-white" v-show="!loading">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-form ref="formCentro" @submit="onSubmit">
            <div class="row q-col-gutter-md bg-grey-2">
              <div class="col-12">
                <label style="display: inline-flex;">Nombre:</label>
                <q-input
                  :readonly="readonly"
                  v-if="formulario.editandoNombre"
                  input-class="inputcampo bg-white"
                  dense
                  v-model="formulario.temp"
                  style="width: 80%; display: inline-flex;"
                  autofocus
                  @blur="finalizarEdicionNombre"
                  @keyup.enter="finalizarEdicionNombre"
                  @keyup.esc="cancelarEdicionNombre"
                ></q-input>
                <label
                  :readonly="readonly"
                  v-if="!formulario.editandoNombre"
                  class="nombreFormulario"
                  @click="modoEdicionNombre"
                >
                  {{ formulario.nombre }}
                </label>
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  :readonly="readonly"
                  label="Fecha Inicio"
                  v-model="formulario.fecha_inicio"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val &&
                        isValidDate(val) &&
                        /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                      'Ingrese un Fecha Inicio válido',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxyFechaInicio"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          :readonly="readonly"
                          mask="DD/MM/YYYY"
                          v-model="formulario.fecha_inicio"
                          @input="() => $refs.qDateProxyFechaInicio.hide()"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Ingrese un Fecha Inicio válido',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  dense
                  :readonly="readonly"
                  label="Fecha Fin"
                  v-model="formulario.fecha_fin"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val &&
                        isValidDate(val) &&
                        /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                      'Ingrese un Fecha Fin válido',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxyFechaFin"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          :readonly="readonly"
                          mask="DD/MM/YYYY"
                          v-model="formulario.fecha_fin"
                          @input="() => $refs.qDateProxyFechaFin.hide()"
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Ingrese un FechaFin válido',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  :readonly="readonly"
                  dense
                  v-model="formulario.id_tipo"
                  label="Tipo de Formulario"
                  :options="tipos_formularios"
                  :loading="loadingTiposFormularios"
                  lazy-rules
                  :rules="[(val) => val || 'Selecciona un tipo de formulario']"
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
            <div class="row q-col-gutter-md bg-grey-2" v-if="false">
              <div class="col-12 col-md-4">
                <q-select
                  :readonly="readonly"
                  dense
                  v-model="formulario.id_tema"
                  label="Tema del Formulario"
                  :options="temas"
                  :loading="loadingTemas"
                  lazy-rules
                  :rules="[(val) => val || 'Selecciona un tema']"
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
            <div class="row q-col-gutter-md bg-grey-2">
              <div class="col-12">
                <label style="display: inline-flex; font-weight: 600;">
                  {{ app_url }}
                </label>
                <q-input
                  :readonly="readonly"
                  v-if="formulario.editandoUrl"
                  input-class="bg-white"
                  dense
                  v-model="formulario.temp"
                  style="width: 328px; display: inline-flex;"
                  autofocus
                  @blur="finalizarEdicionUrl"
                  @keyup.enter="finalizarEdicionUrl"
                  @keyup.esc="cancelarEdicionUrl"
                ></q-input>
                <label
                  :readonly="readonly"
                  v-if="!formulario.editandoUrl"
                  class="nombreFormulario"
                  @click="modoEdicionUrl"
                >
                  {{ formulario.url }}
                </label>
                <q-btn
                  flat
                  class="btnTopNavbar"
                  color="black"
                  icon="content_copy"
                  v-clipboard:copy="app_url + formulario.url"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <template>
                    <q-tooltip>Copiar Url</q-tooltip>
                  </template>
                </q-btn>
              </div>
            </div>

            <div class="row">
              <div v-if="formulario.id_tipo == 5561" class="col-12 col-md-3">
                <q-input
                  readonly=""
                  v-model="formulario.nota_maxima"
                  type="number"
                  label="Puntos del formulario"
                  style="font-size: 20px; font-weight: bold;"
                ></q-input>
              </div>

              <div v-if="formulario.id_tipo == 5561" class="col-12 col-md-5">
                <q-toggle
                  :disable="readonly"
                  v-model="formulario.ordenar_aleatoriamente"
                  style="margin-top: 10px;"
                >
                  Ordenar preguntas aleatoriamente
                </q-toggle>
              </div>

              <div class="col-md-12 col-12">
                <q-option-group
                  :disable="readonly"
                  v-model="formulario.id_modo"
                  :options="modos"
                  color="primary"
                  inline
                />
              </div>
            </div>

            <div class="row">
              <q-input
                v-model.number="formulario.duracion"
                type="number"
                style="max-width: 200px;"
                label="Duracion en minutos"
                hint="Ingresa una duración mayor a 0 para aplicar un temporizador al formulario"
              />

              <q-btn
                flat
                dense
                size="small"
                color="black"
                icon="call_split"
                @click="reglasOpen = true"
                label="Reglas de exclusión"
              ></q-btn>
            </div>

            <br />

            <div
              class="row q-col-gutter-md bg-grey-2"
              v-for="(seccion, index_seccion) in formulario.secciones"
              :key="seccion.id"
              style="margin-top: 50px;"
            >
              <div class="row full-width">
                <div class="col-11">
                  <label class="seccion-titulo">
                    {{ 'Sección ' + (index_seccion + 1) }}
                  </label>
                </div>
                <div class="0ffset-11">
                  <q-btn
                    flat
                    color="red"
                    v-if="!readonly"
                    icon="delete_forever"
                    @click="eliminarSeccion(seccion)"
                  ></q-btn>
                </div>
              </div>
              <div class="col-12">
                <q-input
                  :readonly="readonly"
                  input-class="inputcampo"
                  v-if="seccion.editandoTitulo"
                  style="background-color: white;"
                  full-width
                  outlined
                  autofocus
                  @blur="finalizarEdicionTitulo(seccion)"
                  @keyup.enter="finalizarEdicionTitulo(seccion)"
                  @keyup.esc="cancelarEdicionTitulo(seccion)"
                  color="primary"
                  v-model="seccion.tempTitulo"
                  label="Titulo"
                ></q-input>
                <label
                  :readonly="readonly"
                  v-if="!seccion.editandoTitulo"
                  class="campo"
                  @click="modoEdicionTitulo(seccion)"
                >
                  {{ seccion.titulo }}
                </label>

                <q-editor
                  :readonly="readonly"
                  color="primary"
                  min-height="15rem"
                  v-model="seccion.descripcion"
                  autofocus
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                      'subscript',
                      'superscript',
                    ],
                    ['token', 'hr', 'link', 'custom_btn'],
                    [, 'fullscreen'],
                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: [
                          'p',
                          'h1',
                          'h2',
                          'h3',
                          'h4',
                          'h5',
                          'h6',
                          'code',
                        ],
                      },
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },

                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                />

                <div v-for="(campo, key) in seccion.campos" :key="campo.id">
                  <!-- OPCION -->
                  <FormularioItem
                    :readonly="readonly"
                    ref="formularioItem"
                    :index="key"
                    :puedeSubir="puedeSubir(seccion, campo)"
                    :puedeBajar="puedeBajar(seccion, campo)"
                    @moverArriba="moverArriba(seccion, campo)"
                    @moverAbajo="moverAbajo(seccion, campo)"
                    @eliminarCampo="eliminarCampo(seccion, campo)"
                    @copiarElemento="copiarElemento(seccion, campo)"
                    @actualizarNota="actualizarNotasFormulario"
                    @actualizarArregloTabla="actualizarArregloTabla(campo)"
                    @updateNotaTabla="updateNotaTabla(campo)"
                    @DepartamentoSelected="DepartamentoSelected(campo)"
                    @recargarMunicipios="recargarMunicipios(campo)"
                    :campo="campo"
                    :seccion="seccion"
                    :form="formulario"
                    :idTipoFormulario="formulario.id_tipo"
                  ></FormularioItem>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <q-btn class="bg-primary text-white" @click="toggleOptions">
                    Agregar
                  </q-btn>

                  <q-btn-toggle
                    dense=""
                    v-if="!readonly && showOptions"
                    v-model="selectedOption"
                    toggle-color="primary"
                    @click="agregarCampo(seccion)"
                    class="bg-white text-primary q-pa-sm q-mb-lg"
                    :options="[
                      { label: 'Texto', value: 'texto', slot: 'texto' },
                      { label: 'Opción', value: 'opcion', slot: 'opcion' },
                      { label: 'Sección', value: 'seccion', slot: 'seccion' },
                      { label: 'Tabla', value: 'tabla', slot: 'tabla' },
                      {
                        label: 'Departamento',
                        value: 'departamento',
                        slot: 'departamento',
                      },
                      {
                        label: 'Municipio',
                        value: 'municipio',
                        slot: 'municipio',
                      },
                      {
                        label: 'Valoración',
                        value: 'valoracion',
                        slot: 'valoracion',
                      },
                    ]"
                  >
                    <template v-slot:opcion>
                      <q-icon name="album" style="padding: 0px 20px;" />
                    </template>

                    <template v-slot:texto>
                      <q-icon name="border_color" />
                    </template>

                    <template v-slot:seccion>
                      <div class="row items-center no-wrap">
                        <div
                          class="text-center"
                          style="padding-left: 5px;"
                        ></div>
                        <q-icon name="photo_size_select_small" />
                      </div>
                    </template>

                    <template v-slot:tabla>
                      <div class="row items-center no-wrap">
                        <div
                          class="text-center"
                          style="padding-left: 5px;"
                        ></div>
                        <q-icon name="grid_on" />
                      </div>
                    </template>

                    <template v-slot:departamento>
                      <div class="row items-center no-wrap">
                        <div class="text-center"></div>
                        <q-icon name="location_on" />
                      </div>
                    </template>

                    <template v-slot:municipio>
                      <div class="row items-center no-wrap">
                        <div class="text-center"></div>
                        <q-icon name="location_on" />
                      </div>
                    </template>

                    <template v-slot:valoracion>
                      <div class="row items-center no-wrap">
                        <div
                          class="text-center"
                          style="padding-left: 5px;"
                        ></div>
                        <q-icon name="star" />
                      </div>
                    </template>
                  </q-btn-toggle>
                  <div>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </transition>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card-section>
      <div
        class="bg-primary text-white"
        v-if="formulario.secciones.length == 0"
      >
        <q-btn
          :disable="readonly"
          flat
          icon="add_circle_outline"
          class="full-width q-pa-md"
          @click="agregarSeccion"
        >
          Agregar nueva seccion
        </q-btn>
      </div>
    </q-page>
  </div>
</template>

<style></style>

<script>
import axios from 'axios'
import moment from 'moment'
import FormularioItem from './../../../components/formularios/FormularioItem.vue'

export default {
  name: 'crearFormulario',
  components: { FormularioItem },
  data() {
    return {
      reglasOpen: false,

      reglas: [],
      reglasTabla: [],
      Eidseccion: null,
      Eidcampo: null,
      idseccion: null,
      idcampo: null,
      confirm: false,
      operacion: null,
      idrespuesta: null,
      operaciones: ['=', '<', '>', '!='],
      excluirFullSeccion: false,
      recompute: 0,
      PreguntaEliminarRegla: false,

      selected: [],
      columns: [
        {
          name: 'seccion_excluyente',
          required: true,
          label: 'Seccion excluyente',
          align: 'left',
          field: (row) => row.seccion_excluyente,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'campo_excluyente',
          required: true,
          label: 'Campo excluyente',
          align: 'left',
          field: (row) => row.campo_excluyente,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'operacion',
          required: true,
          label: 'Operación',
          align: 'left',
          field: (row) => row.operacion,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'respuesta_excluyente',
          required: true,
          label: 'Respuesta excluyente',
          align: 'left',
          field: (row) => row.respuesta_excluyente,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'seccion_excluida',
          required: true,
          label: 'Sección Excluida',
          align: 'left',
          field: (row) => row.seccion_excluida,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'excluir_full_seccion',
          required: true,
          label: 'Excluir toda la sección',
          align: 'left',
          field: (row) => row.excluir_full_seccion,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'campo_excluido',
          required: true,
          label: 'Campo Excluido',
          align: 'left',
          field: (row) => (row.campo_excluido ? row.campo_excluido : 'N/A'),

          sortable: true,
        },
      ],

      loadingTable: false,
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      nuevaRegla: true,
      cantidad: 0,
      inicializado: false,
      confirm: false,
      departamentos: [],
      municipios: [],
      loadingDepartamentos: false,
      loadingMunicipios: false,
      loadingTiposFormularios: false,
      nuevo: true,
      readonly: false,
      formulario: {
        id_modo: 5603,
        id: null,
        id_tipo: 5560,
        id_tema: 5569,
        nota_maxima: 0,
        duracion: 0,
        fecha_inicio: moment().format('DD/MM/YYYY'),
        fecha_fin: moment().format('DD/MM/YYYY'),
        url: this.nuevo ? 'formulario-' + this.randomString(8) : null,
        reglas: [],
        reglasTabla: [],
        secciones: [
          {
            id: 1,
            titulo: 'Titulo',
            descripcion: 'Descripcion',
            campos: [],
            editandoTitulo: false,
            tempTitulo: null,
            editandoDescripcion: false,
            tempDescripcion: null,
          },
        ],
        nombre: 'Nombre del Formulario',
        editandoNombre: false,
        temp: null,
        editandoUrl: false,
        ordenar_aleatoriamente: true,
      },
      copiado: false,
      showOptions: false,
      selectedOption: null,
      loading: false,
      loadingTipos: false,
      loadingTemas: false,
      tipos_formularios: [],
      temas: [],
      modos: [
        { label: 'Participantes', value: 5603 },
        { label: 'Abierto', value: 5604 },
        { label: 'Anónimo', value: 5605 },
      ],
    }
  },
  created() {
    if (this.$route.name == 'ver_formulario' && this.$route.params.id) {
      this.nuevo = false
      this.readonly = true
      this.CargarFormulario()
    }

    if (this.$route.name == 'editar_formulario' && this.$route.params.id) {
      this.nuevo = false
      this.CargarFormulario()
    } else if (
      this.$route.name == 'duplicar_formulario' &&
      this.$route.params.id
    ) {
      this.nuevo = true
      this.CargarFormulario()
      this.formulario.url = this.randomString(8)
    } else {
      this.nuevo = true
      this.formulario.url = this.randomString(8)

      // Si hay un borrador lo cargamos
      let form = JSON.parse(localStorage.getItem('formulario') || null)
      if (form && this.nuevo) {
        this.confirm = true
        return
      }
      this.inicializado = true

    }

    this.cargarTiposFormularios()
    this.CargarTemas()
    this.CargarDepartamentos('', false)
    this.CargarMunicipios(null);
  },

  methods: {
    recargarMunicipios(campo){
      console.log("recargamos los municipios")
      let campoDepa = []
      this.formulario.secciones.forEach(seccion =>{
        seccion.campos.forEach(campo => {
          if(campo.id_tipo==4){
            campoDepa.push(campo)
          }
        })
      })
      this.CargarMunicipios(campoDepa[0],false,campo)
    },

    arraymove(arr, fromIndex, toIndex) {
      const element = arr[fromIndex]
      var temp_id = arr[toIndex].id

      let temp_reglas = []

      for (let index = 0; index < this.reglas.length; index++) {
        let rule = this.reglas[index]
        let new_rule = JSON.parse(JSON.stringify(this.reglas[index]))

        if (rule.campo_excluyente == element.id) {
          new_rule.campo_excluyente = temp_id
        }

        console.log(
          'rule.campo_excluyente',
          rule.campo_excluyente,
          ' new_rule.campo_excluyente:',
          new_rule.campo_excluyente,
        )

        if (rule.campo_excluyente == temp_id) {
          new_rule.campo_excluyente = element.id
        }

        if (rule.campo_excluido == element.id) {
          new_rule.campo_excluido = temp_id
        }
        if (rule.campo_excluido == temp_id) {
          new_rule.campo_excluido = element.id
        }
        temp_reglas.push(new_rule)
      }

      this.reglas = temp_reglas

      arr[toIndex].id = element.id
      arr[fromIndex].id = temp_id
      console.log({ temp_id })

      arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, element)
    },

    arrayMax(arr) {
      let max = 0
      arr.forEach((item) => {
        max = Math.max(item.id, max)
      })
      return max
    },

    showDatePopUp(ref) {
      this.$refs[ref][0].show() // <= accessing the dynamic ref to show the popup
    },
    hideDatePopUp(ref) {
      try {
        this.$refs[ref][0].hide() // <= accessing the dynamic ref to hide the popup
      } catch (error) {}
    },
    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },

    eliminarReglaSeleccionada() {
      this.reglas = this.reglas.filter((item) => item.id != this.selected[0].id)
      this.reglasTabla = this.reglasTabla.filter(
        (item) => item.id != this.selected[0].id,
      )

      this.selected = []
      this.limpiarCamposRegla()
    },
    guardarRegla() {
      //Si el no es excluir toda la fila validamos que haya seleccionado el campo
      if (!this.excluirFullSeccion && !this.Eidcampo) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message:
            "Debes seleccionar el campo a excluir, o marca la casilla de 'Excluir toda la sección'",
        })
        return
      }

      //si es edicion
      let curren_regla = null
      if (!this.nuevaRegla) {
        curren_regla = this.reglas.filter(
          (item) => item.id == this.selected[0].id,
        )[0]
      }
      let id_regla = this.nuevaRegla ? this.nextId : curren_regla.id

      let regla = {
        id: id_regla,
        seccion_excluyente: this.idseccion,
        campo_excluyente: this.idcampo,
        operacion: this.operacion,
        respuesta_excluyente: this.idrespuesta,
        seccion_excluida: this.Eidseccion,
        excluir_full_seccion: this.excluirFullSeccion,
        campo_excluido: this.Eidcampo,
      }
      let seccion_excluyente = this.formulario.secciones.filter(
        (s) => s.id == this.idseccion,
      )[0]
      let campo_excluyente = seccion_excluyente.campos.filter(
        (c) => c.id == this.idcampo,
      )[0]

      let respuesta_excluyente = null
      //Select fields
      if (campo_excluyente.id_tipo == 1) {
        respuesta_excluyente = this.opcionesExclusion.filter(
          (r) => r.id == this.idrespuesta,
        )[0]
      }

      //Input fields
      if (campo_excluyente.id_tipo == 2) {
        respuesta_excluyente = this.idrespuesta
      }

      let seccion_excluida = this.formulario.secciones.filter(
        (s) => s.id == this.Eidseccion,
      )[0]
      let campo_excluido = this.camposExcluir.filter(
        (c) => c.id == this.Eidcampo,
      )
      let reglaTabla = {
        id: id_regla,
        seccion_excluyente: seccion_excluyente.titulo,
        campo_excluyente: campo_excluyente.texto,
        operacion: this.operacion,
        respuesta_excluyente:
          campo_excluyente.id_tipo == 1
            ? respuesta_excluyente.nombre
            : respuesta_excluyente,
        seccion_excluida: seccion_excluida.titulo,
        excluir_full_seccion: this.excluirFullSeccion ? 'Si' : 'No',
        campo_excluido:
          campo_excluido.length > 0 ? campo_excluido[0].texto : null,
      }

      if (this.nuevaRegla) {
        this.reglas.push(regla)
        this.reglasTabla.push(reglaTabla)
      } else {
        //editamos la regla correspondiente
        // this.reglas.forEach((r, index, reglas) => {
        //   if (r.id == regla.id) {
        //     reglas[index].seccion_excluyente = this.idseccion
        //     reglas[index].campo_excluyente = this.idcampo
        //     reglas[index].operacion = this.operacion
        //     reglas[index].respuesta_excluyente = this.idrespuesta
        //     reglas[index].seccion_excluida = this.Eidseccion
        //     reglas[index].excluir_full_seccion = this.excluirFullSeccion
        //     reglas[index].campo_excluido = this.Eidcampo
        //   }

        // })

        let indice = 0
        this.reglas.forEach((r, index, reglas) => {
          if (r.id == regla.id) {
            indice = index
          }
        })

        this.reglas.splice(indice, 1, regla)
        this.reglasTabla.splice(indice, 1, reglaTabla)

        // this.reglasTabla.forEach((r, index, reglasTabla) => {
        //   if (r.id == regla.id) {
        //     reglasTabla[index].seccion_excluyente = seccion_excluyente.titulo
        //     reglasTabla[index].campo_excluyente = campo_excluyente.texto
        //     reglasTabla[index].operacion = this.operacion
        //     reglasTabla[index].respuesta_excluyente =
        //       respuesta_excluyente.nombre
        //     reglasTabla[index].seccion_excluida = seccion_excluida.titulo
        //     reglasTabla[index].excluir_full_seccion = this.excluirFullSeccion
        //       ? 'Si'
        //       : 'No'
        //     reglasTabla[index].campo_excluido =
        //       campo_excluido.length > 0 ? campo_excluido[0].texto : null
        //   }

        // })
      }

      this.limpiarCamposRegla()
    },

    limpiarCamposRegla() {
      //limpiamos los campos
      this.idseccion = null
      this.idcampo = null
      this.operacion = null
      this.idrespuesta = null
      this.Eidseccion = null
      this.excluirFullSeccion = false
      this.Eidcampo = null

      this.nuevaRegla = true
      this.selected = []
    },

    editarRegla() {
      let regla = this.reglas.filter((r) => r.id == this.selected[0].id)[0]
      console.log('regla seleccionada:', regla)

      this.idseccion = regla.seccion_excluyente
      setTimeout(() => {
        this.idcampo = regla.campo_excluyente
        this.operacion = regla.operacion
        this.idrespuesta = regla.respuesta_excluyente
        this.Eidseccion = regla.seccion_excluida
        this.excluirFullSeccion = regla.excluir_full_seccion
        this.Eidcampo = regla.campo_excluido
      }, 50)

      setTimeout(() => {
        this.idrespuesta = regla.respuesta_excluyente

        this.recompute = Math.random()
      }, 100)

      this.nuevaRegla = false
    },

    toggleOptions() {
      this.showOptions = !this.showOptions
    },

     DepartamentoSelected(campo) {
      let campoMunicipio = []
      this.formulario.secciones.forEach(seccion =>{
        seccion.campos.forEach(campo => {
          if(campo.id_tipo==5){
            campoMunicipio.push(campo)
          }
        })
      })
       this.CargarMunicipios(campo,false,campoMunicipio[0])


    },

    refreshMunicipiosDataset(){
      this.formulario.secciones.forEach(seccion => {
        seccion.campos.forEach((campo,index,arr) =>{
          //si es de tipo municipio
          if (campo.id_tipo === 5 ){
            console.log("se actualizan los municipios: ", this.municipios)
            arr[index].opciones = this.municipios
          }
        })
      })
    },

    CargarDepartamentos() {
      this.loadingDepartamentos = true
      var url = process.env.API_URL + '/catalogos/departamentos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: '',
        id_padre: 1438,
      }
      axios({
        method: 'get',
        url: url,
        params: params,

        headers: headers,
      })
        .then((response) => {
          this.departamentos = response.data.departamentos
          this.loadingDepartamentos = false
        })
        .catch((error) => {
          this.loadingDepartamentos = false

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    CargarMunicipios(departamento, todos =false, campoMunicipio=null) {
      this.loadingMunicipios = true
       var url = process.env.API_URL + '/catalogos/municipios'

       var id_padre = null
       if (departamento && departamento.respuesta_correcta ){
        id_padre=  departamento.respuesta_correcta.id
       }
      console.log("departamento:",departamento)
      if ((!departamento || todos || !id_padre) || (campoMunicipio && campoMunicipio.FiltrarXDepartamento ==false) ) {
        url = process.env.API_URL + '/catalogos/TodosMunicipios'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }


      var params = {
        id_padre: id_padre,
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.municipios = response.data.municipios
          console.log("se actualizan los municipios:", this.municipios)
          this.loadingMunicipios = false
           this.refreshMunicipiosDataset()
        })
        .catch((error) => {
          this.loadingMunicipios = false

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    updateNotaTabla(campo) {
      let nota = 0

      campo.arregloTable.forEach((fila) => {
        nota += fila.columns.reduce((acc, cur) => {
          return Math.max(Number(acc), Number(cur.nota))
        }, 0)
      })
      campo.nota = nota
      this.actualizarNotasFormulario()
    },
    actualizarArregloTabla(campo) {
      let arregloTabla = []
      if (campo.id_tipo == 3) {
        campo.opciones[0].filas.forEach((fila, index) => {
          let columns = []
          campo.opciones[1].columnas.forEach((columna, index2) => {
            columns.push({
              id: index2,
              valor: columna.nombre,
              nota: columna.nota ? columna.nota : 0,
              checked: false,
            })
          })

          arregloTabla.push({
            id: index,
            valor: fila.nombre,
            columns: columns,
            isValid: true,
          })
          campo.arregloTable = arregloTabla
        })

        this.actualizarNotasFormulario()
      }
    },

    actualizarNotasFormulario() {
      let notas = 0

      this.formulario.secciones.forEach((seccion) => {
        seccion.campos.forEach((campo) => {
          notas += Number(campo.nota)
        })
      })

      this.formulario.nota_maxima = notas
    },
    eliminarSeccion(seccion) {
      this.formulario.secciones = this.formulario.secciones.filter(
        (item) => item.id != seccion.id,
      )

      this.eliminarReglaSeccion(seccion)
      this.$forceUpdate()
    },
    eliminarReglaSeccion(seccion) {
      let r_eliminar = this.reglas.map((r) => {
        if (
          r.seccion_excluyente == seccion.id ||
          r.seccion_excluida == seccion.id
        ) {
          return r.id
        }
      })
      this.reglas = this.reglas.filter(
        (r) =>
          r.seccion_excluyente != seccion.id &&
          r.seccion_excluida != seccion.id,
      )
      this.reglasTabla = this.reglasTabla.filter(
        (r) => !r_eliminar.includes(r.id),
      )
    },
    eliminarCampoReglas(campo) {
      console.log('Campo a eliminar:', { campo })
      let r_eliminar = this.reglas.map((r) => {
        if (r.campo_excluyente == campo.id || r.campo_excluido == campo.id) {
          return r.id
        }
      })
      this.reglas = this.reglas.filter(
        (r) => r.campo_excluyente != campo.id && r.campo_excluido != campo.id,
      )
      this.reglasTabla = this.reglasTabla.filter(
        (r) => !r_eliminar.includes(r.id),
      )
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    VistaPrevia() {
      //this.$store.commit('setFormulario', this.formulario)
      localStorage.setItem(
        'formulario_vista_previa',
        JSON.stringify({
          formulario: this.formulario,
          reglas: this.reglas,
          reglasTabla: this.reglasTabla,
        }),
      )

      let route = this.$router.resolve({ name: 'vista_previa_formulario' })
      window.open(route.href, '_blank')
    },

    continuar() {
      let form = JSON.parse(localStorage.getItem('formulario') || null)
      if (form) {
        this.nuevo = form.nuevo
        this.formulario = form.formulario
        this.nombre = form.nombre
        this.confirm = false
        this.inicializado = true

        this.cargarTiposFormularios()
      }
    },
    nuevoFormulario() {
      localStorage.removeItem('formulario')
      this.confirm = false
      this.inicializado = true
      this.cargarTiposFormularios()
    },
    CargarFormulario() {
      if (this.$route.params.id) {
        this.loading = true
        var url =
          process.env.API_URL +
          `/admin/formularios/${this.$route.params.id}/edit`

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }
        axios({
          method: 'get',
          url: url,
          headers: headers,
        })
          .then((response) => {
            let formulario = response.data.formulario
            this.formulario.nombre = formulario.nombre
            this.formulario.nota_maxima = formulario.nota_maxima
            this.formulario.fecha_inicio = formulario.fecha_inicio
            this.formulario.fecha_fin = formulario.fecha_fin
            if (this.$route.name == 'editar_formulario') {
              this.formulario.url = formulario.url
            }
            this.formulario.id = Number(formulario.id)
            this.formulario.id_tipo = Number(formulario.id_tipo)
            this.formulario.id_tema = Number(formulario.id_tema)
            this.formulario.id_centro = Number(formulario.id_centro)
            this.formulario.id_curso = Number(formulario.id_curso)

            this.formulario.id_modo = Number(formulario.id_modo)
            this.formulario.duracion = Number(formulario.duracion).toFixed(0)

            this.formulario.ordenar_aleatoriamente =
              formulario.ordenar_aleatoriamente == 1

            let campos = response.data.campos
            this.formulario.secciones = response.data.secciones

            campos.forEach((campo, index, arr) => {
              arr[index].tipo_input = JSON.parse(campo.tipo_input)
              arr[index].opciones = JSON.parse(campo.opciones)
              arr[index].arregloTable = JSON.parse(campo.arregloTable)

              campo.imagen_url = campo.imagen
              campo.imagen = campo.imagen
                ? process.env.IMAGE_URL + '/formularios/' + campo.imagen
                : ''
            })

            this.formulario.secciones.forEach((seccion, index, arr) => {
              this.$set(
                seccion,
                'campos',
                campos.filter((campo) => campo.id_seccion == seccion.id),
              )
            })

            if (response.data.formulario.reglas) {
              const obj = JSON.parse(response.data.formulario.reglas)

              if (obj) {
                this.reglas = obj.reglas
                this.reglasTabla = obj.reglasTabla
              }
            }

            this.loading = false
            setTimeout(() => {
              this.scrollToTop()
            }, 0)
          })
          .catch((error) => {
            this.loading = false
            console.log({ error })

            if (error.response.status == 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },
    onCopy: function (e) {
      this.$q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'content_copy',
        message: 'Copiado al portapapeles!',
        position: 'bottom',
        timeout: 1500,
      })
    },
    onError: function (e) {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'fas fa-exclamation-triangle',
        message: 'Ha ocurrido un error al intentar copiar la url',
      })
    },

    randomString(length) {
      var result = ''
      var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        )
      }
      return result
    },
    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },
    cargarTiposFormularios() {
      if (this.$store.getters.online) {
        this.loadingTiposFormularios = true
        var method = 'get'
        var url = process.env.API_URL + '/catalogos/tipos_formularios'
        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }

        axios({
          method: method,
          url: url,
          headers: headers,
        })
          .then((response) => {
            this.loadingTiposFormularios = false
            this.tipos_formularios = response.data.tipos_formularios
          })
          .catch((error) => {
            this.loading = false

            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: error.response.data.message,
            })

            if (error.response.status == 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },

    CargarTemas(filtro = '') {
      this.loadingTemas = true
      var url = process.env.API_URL + '/catalogos/temas_formularios'

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
          this.temas = response.data.temas
          this.loadingTemas = false
        })
        .catch((error) => {
          this.loadingTemas = false
          console.log({ error })

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    onSubmit() {
      this.loading = true
      // var method = 'post'

      var url = process.env.API_URL + '/formularios/crear'
      if (!this.nuevo) {
        url = process.env.API_URL + '/formularios/editar/' + this.formulario.id
        // method = 'put'
      }

      let fd = new FormData()
      fd.append('formulario', JSON.stringify(this.formulario))
      fd.append(
        'reglas',
        JSON.stringify({ reglas: this.reglas, reglasTabla: this.reglasTabla }),
      )

      this.formulario.secciones.forEach((seccion) => {
        seccion.campos.forEach((campo, index) => {
          if (
            campo.imagen &&
            campo.id_tipo == 2 &&
            this.$refs.formularioItem[index].$refs.texto &&
            this.$refs.formularioItem[index].$refs.texto.$refs[
              'uploader' + campo.id
            ]
          ) {
            fd.append(
              'imagen' + campo.id,
              this.$refs.formularioItem[index].$refs.texto.$refs[
                'uploader' + campo.id
              ].files[0],
            )
          }

          if (
            campo.imagen &&
            campo.id_tipo == 1 &&
            this.$refs.formularioItem[index].$refs.opcion &&
            this.$refs.formularioItem[index].$refs.opcion.$refs[
              'uploader' + campo.id
            ]
          ) {
            fd.append(
              'imagen' + campo.id,
              this.$refs.formularioItem[index].$refs.opcion.$refs[
                'uploader' + campo.id
              ].files[0],
            )
          }

          if (
            campo.imagen &&
            campo.id_tipo == 3 &&
            this.$refs.formularioItem[index].$refs.tabla &&
            this.$refs.formularioItem[index].$refs.tabla.$refs[
              'uploader' + campo.id
            ]
          ) {
            console.log('entro a guardar la imagen de la tabla')
            fd.append(
              'imagen' + campo.id,
              this.$refs.formularioItem[index].$refs.tabla.$refs[
                'uploader' + campo.id
              ].files[0],
            )
          }
        })
      })

      axios
        .post(url, fd, {
          headers: {
            'Content-Type': undefined,
            Authorization: 'Bearer ' + this.$store.state.token,
          },
        })
        .then((response) => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Formulario creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.$router.push({
            name: 'formularios',
          })
        })
        .catch((error) => {
          this.loading = false

          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data.message,
          })

          if (error.response.status == 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    modoEdicionNombre() {
      this.formulario.editandoNombre = true
      this.formulario.temp = this.formulario.nombre
    },

    finalizarEdicionNombre() {
      this.formulario.nombre = this.formulario.temp
      this.formulario.temp = null
      this.formulario.editandoNombre = false
    },

    cancelarEdicionNombre() {
      this.formulario.temp = null
      this.formulario.editandoNombre = false
    },

    modoEdicionUrl() {
      this.formulario.editandoUrl = true
      this.formulario.temp = this.formulario.url
    },

    finalizarEdicionUrl() {
      this.formulario.url = this.formulario.temp
      this.formulario.temp = null
      this.formulario.editandoUrl = false
    },

    cancelarEdicionUrl() {
      this.formulario.temp = null
      this.formulario.editandoUrl = false
    },

    puedeSubir(seccion, campo) {
      let valor = false
      seccion.campos.forEach((item, index, arr) => {
        if (item.id == campo.id) {
          // si el indice es mayor a 2 puede subir
          valor = index > 0
        }
      })
      return valor
    },

    puedeBajar(seccion, campo) {
      let valor = false
      let total = seccion.campos.length
      seccion.campos.forEach((item, index, arr) => {
        if (item.id == campo.id) {
          // si el indice es menor al total de campos -2
          valor = index < total - 1
        }
      })
      return valor
    },

    moverArriba(seccion, campo) {
      let index = 0
      seccion.campos.forEach((el, i, arr) => {
        if (el.id == campo.id) {
          index = i
        }
      })

      this.arraymove(seccion.campos, index, index - 1)
      this.$forceUpdate()
    },
    moverAbajo(seccion, campo) {
      let index = 0
      seccion.campos.forEach((el, i, arr) => {
        if (el.id == campo.id) {
          index = i
        }
      })

      this.arraymove(seccion.campos, index, index + 1)
      this.$forceUpdate()
    },

    copiarElemento(seccion, campo) {
      let field = JSON.parse(JSON.stringify(campo))
      let max = this.arrayMax(seccion.campos)
      field.id = max + 1
      field.nombre = 'Pregunta' + (max + 1)
      seccion.campos.push(field)
      this.$forceUpdate()
    },

    habilitarExclusion(seccion, campo) {
      let valor = false
      seccion.campos.forEach((item, index, arr) => {
        if (item.id == campo.id) {
          // si el indice es mayor a 2 puede subir
          valor = index > 0
        }
      })
      return valor
    },

    obtenerSecciones() {
      return this.formulario
    },

    eliminarCampo(seccion, campo) {
      seccion.campos = seccion.campos.filter((item) => item.id != campo.id)
      this.eliminarCampoReglas(campo)
      this.CargarMunicipios(null,true)
      this.$forceUpdate()
    },

    hideOptions() {
      this.showOptions = false
    },

    agregarSeccion() {
      let max = this.arrayMax(this.formulario.secciones)
      let seccion = {
        id: max + 1,
        titulo: 'Titulo',
        descripcion: 'Descripcion',
        campos: [],
        editandoTitulo: false,
        tempTitulo: null,
        editandoDescripcion: false,
        tempDescripcion: null,
      }

      this.formulario.secciones.push(seccion)
    },

    agregarCampo(seccion) {
      if (this.selectedOption == 'seccion') {
        this.agregarSeccion()
        this.showOptions = false
        this.selectedOption = null
        return
      }

      let max = this.arrayMax(seccion.campos)

      let size = max + 1
      let idTipo = 0
      let item = null
      switch (this.selectedOption) {
        case 'opcion':
          idTipo = 1
          break

        case 'texto':
          idTipo = 2
          break

        case 'tabla':
          idTipo = 3
          break

        case 'departamento':
          idTipo = 4
          break

        case 'municipio':
          idTipo = 5
          break

        case 'valoracion':
          idTipo = 6
          break
      }
      item = {
        id: size,
        id_tipo: idTipo,
        texto: 'Pregunta' + size,
        imagen: null,
        imagen_url: null,
        minimo: '',
        maximo: '',
        agregarSubtitulo: false,
        subtitulo: null,
        editando: false,
        respuesta_correcta: null,
        respuestas_correctas: [],
        temp: null,
        opciones: [
          { id: 1, nombre: 'Opción1', respuesta: null, nota: 0 },
          { id: 2, nombre: 'Opción2', respuesta: null, nota: 0 },
        ],
        requerido: true,
        FiltrarXDepartamento: true,
        nota: 0,
        respuesta: null,
      }
      if (this.selectedOption == 'opcion') {
        item['tipo_input'] = { id: 1, nombre: 'Seleccion Multiple' }
      }

      if (this.selectedOption == 'texto') {
        item['tipo_input'] = { id: 1, nombre: 'Texto Corto' }
      }

      if (this.selectedOption == 'tabla') {
        item.opciones = [
          {
            filas: [
              { id: 1, nombre: 'Fila1' },
              { id: 2, nombre: 'Fila2' },
            ],
          },
          {
            columnas: [
              { id: 1, nombre: 'Columna1', valor: false, nota: 0 },
              { id: 2, nombre: 'Columna2', valor: false, nota: 0 },
            ],
          },
        ]

        item['tipo_input'] = { id: 1, nombre: 'Seleccion Multiple' }
      }

      if (this.selectedOption == 'departamento') {
        item['opciones'] = this.departamentos
        item['tipo_input'] = { id: 1, nombre: 'departamento' }
      }

      if (this.selectedOption == 'municipio') {
        item['opciones'] = this.municipios
        item['tipo_input'] = { id: 1, nombre: 'municipio' }
      }

      if (this.selectedOption == 'valoracion') {
        item['tipo_input'] = { id: 1, nombre: 'Seleccion Multiple' }
      }

      seccion.campos.push(item)
      this.showOptions = false
      this.selectedOption = null
    },
    mostrarOpciones(self) {
      this.showOptions = true
      self.focus()
    },
    modoEdicion(campo) {
      campo.editando = true
      campo.temp = campo.texto
    },
    modoEdicionTitulo(seccion) {
      seccion.editandoTitulo = true
      seccion.tempTitulo = seccion.titulo
      this.$forceUpdate()
    },
    modoEdicionDesc(seccion) {
      seccion.editandoDescripcion = true
      seccion.tempDescripcion = seccion.descripcion
    },
    finalizarEdicion(campo) {
      campo.texto = campo.temp
      campo.temp = null
      campo.editando = false
    },
    finalizarEdicionTitulo(seccion) {
      seccion.titulo = seccion.tempTitulo
      seccion.tempTitulo = null
      seccion.editandoTitulo = false
      this.$forceUpdate()
    },
    finalizarEdicionDesc(seccion) {
      seccion.descripcion = seccion.tempDescripcion
      seccion.tempDescripcion = null
      seccion.editandoDescripcion = false
    },
    cancelarEdicion(campo) {
      campo.temp = null
      campo.editando = false
    },
    cancelarEdicionTitulo(seccion) {
      seccion.tempTitulo = null
      seccion.editandoTitulo = false
    },
    cancelarEdicionDesc(seccion) {
      seccion.tempDescripcion = null
      seccion.editandoDescripcion = false
    },
    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },
    displayOptions() {},
    saveToLocalStorage(itemName, val) {
      window.clearTimeout(this.timer)

      this.timer = window.setTimeout(function () {
        localStorage.setItem(itemName, JSON.stringify(val))
        console.log('entro a guardar el localstorage', val)
      }, 1000)
    },
  },
  computed: {
    esCampoTexto() {
      if (!this.idcampo || !this.camposEvaluar) {
        return false
      }

      return (
        this.camposEvaluar.filter(
          (i) =>
            i.id == this.idcampo &&
            i.id_tipo == 2 &&
            (i.tipo_input.id == 1 || i.tipo_input.id == 2),
        ).length > 0
      )
    },
    esCampoNumerico() {
      if (!this.idcampo || !this.camposEvaluar) {
        return false
      }

      return (
        this.camposEvaluar.filter(
          (i) => i.id == this.idcampo && i.id_tipo == 2 && i.tipo_input.id == 3,
        ).length > 0
      )
    },

    esCampoFecha() {
      if (!this.idcampo || !this.camposEvaluar) {
        return false
      }

      return (
        this.camposEvaluar.filter(
          (i) => i.id == this.idcampo && i.id_tipo == 2 && i.tipo_input.id == 4,
        ).length > 0
      )
    },

    nextId() {
      let maxId = this.arrayMax(this.reglas) + 1
      console.log({ maxId })
      return maxId
    },
    ancho() {
      let screen = this.$q.screen.lt
      console.log({ screen: this.$q.screen })
      let size = '768px'

      if (screen.md) {
        size = '768px'
      }
      if (screen.sm) {
        size = window.screen.width + 'px'
      }

      return size
    },
    app_url() {
      return process.env.WEB_URL + '#' + '/responder/formulario/'
    },
    cantidad_campos() {
      const dummy = this.recompute
      this.formulario.secciones.forEach((seccion) => {
        this.cantidad += seccion.campos.length
      })
      return this.cantidad
    },

    camposEvaluar() {
      const dummy = this.recompute
      let seccion = this.formulario.secciones.filter(
        (i) => i.id == this.idseccion,
      )
      if (seccion.length > 0) {
        return seccion[0].campos.filter(
          (c) =>
            (c.id_tipo == 1 &&
              (c.tipo_input.id == 1 || c.tipo_input.id == 3)) ||
            c.id_tipo == 2,
        )
      }

      return null
    },

    opcionesExclusion() {
      const dummy = this.recompute
      let seccion = this.formulario.secciones.filter(
        (i) => i.id == this.idseccion,
      )
      let campo = null
      let opciones = null
      if (seccion.length == 0) {
        return null
      }
      campo = seccion[0].campos.filter((i) => i.id == this.idcampo)[0]

      if (campo) {
        opciones = campo.opciones
      }

      if (!opciones || campo.id_tipo == 2) {
        this.idrespuesta = null
        opciones = null
      }

      return opciones
    },

    camposExcluir() {
      const dummy = this.recompute
      let seccion = this.formulario.secciones.filter(
        (i) => i.id == this.Eidseccion,
      )

      if (seccion.length == 0) {
        return null
      }

      return seccion[0].campos
    },
    getTipoCampo() {
      const dummy = this.recompute
      if (!this.camposEvaluar) {
        return null
      }
      let campo = this.camposEvaluar.filter((c) => c.id == this.idcampo)
      if (campo.length > 0) {
        return campo[0].id_tipo
      }
      return null
    },
  },
  watch: {
    formulario: {
      handler(val) {
        if (this.inicializado && this.cantidad_campos > 0) {
          this.saveToLocalStorage('formulario', {
            formulario: val,
            nombre: this.nombre,
            nuevo: this.nuevo,
          })
        }
      },
      deep: true,
    },
    idseccion: function () {
      console.log('entró a cambiar el idseccion')
      this.idcampo = null
      this.idrespuesta = null
    },
    idcampo: function () {
      console.log('entró a cambiar el idcampo')
      this.idrespuesta = null
    },
  },
}
</script>

<style lang="scss">
#crearFormulario {
  .campo {
    border: 1px dashed black;
    padding: 10px;
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    font-size: 20px;
    margin-top: 5px;
  }

  .inputcampo {
    text-align: center;
    display: flex;
    justify-content: center;
    font-size: 20px;
    margin-top: 5px;
  }

  .inputcampo:focus {
    background-color: white;
  }

  .campo:hover {
    background-color: #e6e6e6;
  }
}

.nombreFormulario {
  border: 1px dashed;
  color: black;
  padding: 5px;
}

.seccion-titulo {
  font-size: 20px;
  font-weight: 600;
  color: #027be3;
}

.center-mobile {
  display: block;
  position: relative;
  width: 300px;
  bottom: 40px;
  left: 5px;
}
</style>
