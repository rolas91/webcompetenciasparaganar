<template>
  <q-page class="q-pa-md">
    <q-page-sticky
      position="top-right"
      style="
        z-index: 99;
        width: 100%;
        padding: 15px 50px;
        background-color: #f5f5f5;
      "
    >
      <q-tabs
        v-model="tab"
        class="text-primary"
        align="justify"
        narrow-indicator
        style="width: 100%;"
      >
        <q-tab
          class="text-primary"
          name="preguntas"
          label="Preguntas"
          v-if="$store.getters.online"
        />
        <q-tab class="text-primary" name="respuestas" label="Respuestas" />
        <q-tab
          class="text-primary"
          name="estadisticas"
          label="Estadisticas"
          v-if="$store.getters.online"
        />
      </q-tabs>
    </q-page-sticky>

    <q-card>
      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-center">
        <q-tab-panel name="preguntas">
          <q-page
            v-if="formulario"
            id="crearFormulario"
            class="bg-white pagina"
          >
            <q-card-section class="bg-white">
              <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <q-form ref="formCentro">
                  <div class="row q-mb-xl">
                    <div>
                      <q-btn
                        v-if="!loading"
                        right
                        icon="chevron_left"
                        @click="regresar"
                      >
                        Regresar
                      </q-btn>
                    </div>
                  </div>
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
                      ></q-input>
                      <label
                        :readonly="readonly"
                        v-if="!formulario.editandoNombre"
                        class="nombreFormulario"
                      >
                        {{ formulario.nombre }}
                      </label>
                    </div>
                    <div class="col-12 col-md-4">
                      <q-input
                        dense
                        :readonly="readonly"
                        label="Fecha Inicio"
                        v-model="formulario.fecha_inicio_formulario"
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
                                v-model="formulario.fecha_inicio_formulario"
                                @input="
                                  () => $refs.qDateProxyFechaInicio.hide()
                                "
                                lazy-rules
                                :rules="[
                                  (val) =>
                                    (val && val.length > 0) ||
                                    'Ingrese un FechaInicio válido',
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
                        v-model="formulario.fecha_fin_formulario"
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
                                v-model="formulario.fecha_fin_formulario"
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
                        :rules="[
                          (val) => val || 'Selecciona un tipo de formulario',
                        ]"
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
                      ></q-input>
                      <label
                        :readonly="readonly"
                        v-if="!formulario.editandoUrl"
                        class="nombreFormulario"
                      >
                        {{ formulario.url }}
                      </label>
                    </div>
                  </div>

                  <div class="row">
                    <div
                      v-if="formulario.id_tipo === 5561"
                      class="col-12 col-md-3"
                    >
                      <q-input
                        readonly
                        v-model="formulario.nota_maxima"
                        type="number"
                        label="Puntos del formulario"
                        style="font-size: 20px; font-weight: bold;"
                      ></q-input>
                    </div>

                    <div
                      v-if="formulario.id_tipo === 5561"
                      class="col-12 col-md-5"
                    >
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
                          [
                            'quote',
                            'unordered',
                            'ordered',
                            'outdent',
                            'indent',
                          ],

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

                      <div
                        v-for="(campo, key) in seccion.campos"
                        :key="campo.id"
                      >
                        <!-- OPCION -->
                        <FormularioItem
                          :readonly="readonly"
                          ref="formularioItem"
                          :index="key"
                          :campo="campo"
                          :idTipoFormulario="formulario.id_tipo"
                        ></FormularioItem>
                      </div>
                    </div>
                  </div>
                </q-form>
              </transition>
              <q-inner-loading :showing="loading">
                <q-spinner-gears size="50px" color="primary" />
              </q-inner-loading>
            </q-card-section>
          </q-page>
        </q-tab-panel>
        <q-tab-panel name="respuestas">
          <div class="text-h6">Respuestas</div>
          <div class="q-pa-md q-gutter-md">
            <div class="row q-gutter-md">
              <div
                v-if="$q.platform.is.mobile && $store.state.internetAvailable"
              >
                <q-btn
                  v-if="selected.length > 0 && selected[0].id_respuesta < 0"
                  icon="fas fa-cloud-upload-alt"
                  dense
                  :loading="loading"
                  color="green"
                  label="Enviar"
                  @click="enviarAlServidor"
                />
                <q-btn
                  v-if="selected.length > 0 && selected[0].id_respuesta > 0"
                  class="bg-primary text-white"
                  style="margin-left: 2em;"
                  :to="`/resultados/formulario/${this.selected[0].id_formulario}/respuesta/${this.selected[0].id_respuesta}`"
                >
                  Ver
                </q-btn>
              </div>


              <div v-if="$q.platform.is.desktop">
                <q-btn
                  v-if="!loading"
                  right
                  icon="chevron_left"
                  @click="regresar"
                >
                  Regresar
                </q-btn>
                &nbsp;

                 <q-btn
                  v-if="selected.length > 0 && selected[0].id_respuesta > 0"
                  class="bg-primary text-white"
                  :to="`/resultados/formulario/${this.selected[0].id_formulario}/respuesta/${this.selected[0].id_respuesta}`"
                >
                  Ver
                </q-btn>
 &nbsp;
                <q-btn
                  v-if="
                    this.selected[0] && btnVisible('Evaluar', this.selected[0])
                  "
                  class="bg-yellow text-black"
                  :to="`/resultados/formulario/${this.selected[0].id_formulario}/respuesta/${this.selected[0].id_respuesta}/evaluar`"
                >
                  Evaluar
                </q-btn>
              </div>

              <q-btn
                icon="autorenew"
                class="bg-primary text-white"
                @click="CargarRespuestas"
              ></q-btn>
            </div>

            <br />

            <div class="row q-pa">
              <div class="col-md-4"></div>
            </div>

            <q-table
              :dense="$q.screen.lt.md"
              title="Respuestas"
              :data="respuestas"
              :columns="columns"
              row-key="id_respuesta"
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
                  :disable="loading || !$store.state.internetAvailable"
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
        </q-tab-panel>

        <q-tab-panel name="estadisticas">
          <div class="q-pa-md">
            <div class="text-h6">Estadísticas</div>

            <div
              class="row q-pa-md q-col-gutter-md"
              v-for="estadistica in estadisticas"
              :key="estadistica.name"
            >
              <div class="col-12 col-md-4">
                <div
                  class="datos text-teal"
                  v-for="(item, index) in global.filter(
                    (i) => i.id_campo === estadistica.id,
                  )"
                  :key="index"
                  v-html="items(item, estadistica)"
                ></div>
              </div>
              <div
                v-if="estadistica.tipo === 1 || (estadistica.tipo === 2 && JSON.parse(estadistica.tipo_input).id ===3) || estadistica.tipo === 6 || estadistica.tipo ===4 || estadistica.tipo ===5"
                class="col-12 col-md-8"
              >
                <Highcharts
                  :options="getStatisticsChartOption(estadistica)"
                ></Highcharts>
              </div>

              <div v-else class="col-12 col-md-8 flex flex-center">
                <div>
                  Ultimas respuestas
                  <div
                    class="text-primary"
                    v-html="UltimasRespuestas(detalle_respuestas, estadistica)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { getRepository } from 'typeorm'
import FormularioItem from './../../../components/formularios/FormularioItem.vue'

import Highcharts from 'highcharts'
import { genComponent } from 'vue-highcharts'

export default {
  components: {
    Highcharts: genComponent('Highcharts', Highcharts),
    FormularioItem,
  },
  data() {
    let columns = [
      {
        name: 'nombre_participante',
        required: true,
        label: 'Participante',
        align: 'left',
        field: (row) => row.nombre_participante,
        format: (val) => `${val || 'Anónimo'}`,
        sortable: true,
      },
    ]
    if (this.$q.platform.is.mobile) {
      columns.push({
        name: 'id_respuesta',
        required: false,
        label: 'Sincronizado',
        align: 'left',
        field: (row) => row.id_respuesta,
        format: (val) => {
          return val === undefined || val < 0
            ? 'No sincronizado'
            : 'Sincronizado'
        },
        sortable: true,
      })
    }

    columns.push(
      {
        name: 'cedula_participante',
        required: true,
        label: 'Cédula',
        align: 'left',
        field: (row) => row.cedula_participante || row.numero_de_cedula,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },
      {
        name: 'correo',
        required: true,
        label: 'correo',
        align: 'left',
        field: (row) => row.correo,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },
      {
        name: 'telefono',
        required: true,
        label: 'telefono',
        align: 'left',
        field: (row) => row.telefono || row.numero_telefonico_del_participante,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },
      {
        name: 'centro',
        required: true,
        label: 'centro',
        align: 'left',
        field: (row) => row.centro || row.nombre_del_centro,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },

      {
        name: 'curso',
        required: true,
        label: 'curso',
        align: 'left',
        field: (row) => row.curso || row.cursosseminarios_ccsn,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },

      {
        name: 'fecha_inicio_formulario',
        required: true,
        label: 'fecha_inicio_formulario',
        align: 'left',
        field: (row) => row.fecha_inicio_formulario,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },
      {
        name: 'fecha_fin_formulario',
        required: true,
        label: 'fecha_fin_formulario',
        align: 'left',
        field: (row) => row.fecha_fin_formulario,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },
      {
        name: 'nota',
        required: true,
        label: 'nota',
        align: 'right',
        field: (row) => row.nota,
        format: (val) => `${val || 'N/A'}`,
        sortable: true,
      },
    )
    return {
      estadisticas: [],
      global: [],
      detalle_respuestas: [],
      copiado: false,
      showOptions: false,
      selectedOption: null,
      loading: false,
      loadingTipos: false,
      loadingTiposFormularios: false,
      loadingTemas: false,
      tipos_formularios: [],
      temas: [],
      modos: [
        { label: 'Vinculado', value: 5603 },
        { label: 'Abierto', value: 5604 },
        { label: 'Anónimo', value: 5605 },
      ],
      readonly: true,
      tab: 'respuestas',
      confirm: false,
      id_formulario: null,
      id_respuesta: null,
      selected: [],
      formulario: null,
      curso: null,
      respuestas: [],
      loadingTable: false,
      filtro: '',
      pagination: {
        sortBy: 'id_respuesta',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20,
      },
      columns: columns,
    }
  },
  created() {
    console.log('entro al formulario respuestas')
    this.loading = true
    this.id_formulario = this.$route.params.id_formulario
    this.CargarRespuestas()
    this.CargarFormulario()
    this.CargarEstadisticas()
  },
  methods: {
    UltimasRespuestas(respuesta, estadistica) {
      let html = '<ul class="text-left q-mt-xl" style="list-style-type:none;">'

      // if tipo texto
      if (estadistica.tipo === 2) {
        respuesta
          .filter((r) => r.id_formulario_campo === estadistica.id)
          .slice(-5)
          .forEach((i) => {
            html += '<li>' + i.valor + '</li>'
          })
      }

      // Tipo Tabla
      if (estadistica.tipo === 3) {
        respuesta
          .filter((r) => r.id_formulario_campo === estadistica.id)
          .slice(-1)
          .forEach((i) => {
            let items = i.valor
              .replace(/\[/g, '')
              .replace(/]/g, '')
              .replace(/"/g, '')
              .replace(/{/g, '')
              .replace(/}/g, '')
              .split(',')
            for (let item in items) {
              console.log('item:', items[item])
              const element = items[item]
              html += '<li>' + element + '</li><br/>'
            }
          })
      }

      html += '</ul>'

      return html
    },
    items(data, estadistica) {
      let html = '<ul class="text-left q-mt-xl">'
      var key = null

        console.log({data})
      for (key in data) {
        if (key === 'id_campo') continue
        if (estadistica.id_tipo_formulario !== 5561 || estadistica.tipo === 6) {
          if (key === 'Incorrectas') continue
          if (key === 'Correctas') continue
          if (key === 'Nota promedio') continue
          if (key === 'Valor Nota') continue
          if (key === 'porcentaje correcto') continue
          if (key === 'porcentaje incorrecto') continue
        }

        // Si es direrente a tipo de campo valoracion quitamos los campos Detractores, Pasivos y Promotores
        if (
          estadistica.tipo !== 6 &&
          (key === 'Detractores' || key === 'Pasivos' || key === 'Promotores')
        )
          continue

        if (key === 'porcentaje correcto') {
          html += '<li>' + 'Correcto' + ': ' + data[key] + '%</li>'
        } else if (key === 'porcentaje incorrecto') {
          html += '<li>' + 'Incorrecto' + ': ' + data[key] + '%</li>'
        } else {
          // Si es tipo valoracion pintamos los 3 campos de colores sino normal

          if (key === 'Detractores' && estadistica.tipo === 6) {
            html += '<li class="text-red">' + key + ': ' + data[key] + '</li>'
            continue;
          } else if (key === 'Pasivos' && estadistica.tipo === 6) {
            html +=
              '<li class="text-orange">' + key + ': ' + data[key] + '</li>'
               continue;
          } else if (key === 'Promotores' && estadistica.tipo === 6) {
            html += '<li class="text-green">' + key + ': ' + data[key] + '</li>'
             continue;
           }
          else {
            // Este aplica para todos los campos excepto para los de arriba
            html += '<li>' + key + ': ' + data[key] + '</li>'
          }
        }
      }

      html += '</ul>'
      return html
    },
    getStatisticsChartOption(estadistica) {
      return {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        chartOptions: {
          chart: {
            height: '50%',
          },
        },
        title: {
          text: estadistica.name,
        },
        tooltip: {
          pointFormat: '{point.x}: <b>{point.y:.1f}%</b>',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.x}</b>: {point.y:.1f} %',
            },
          },
        },

        series: [
          {
            name: estadistica.name,
            data: estadistica.estadistica,
          },
        ],
      }
    },
    CargarEstadisticas() {
      console.log('entró al metodo')
      var url = process.env.API_URL + `/formulario/estadisticas/respuestas`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'post',
        url: url,
        data: { id_formulario: this.id_formulario },
        headers: headers,
      })
        .then((response) => {
          this.estadisticas = response.data.estadisticas
          this.global = response.data.global
          this.detalle_respuestas = response.data.respuestas
        })
        .catch((error) => {
          this.loading = false
          console.log({ error })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    CargarFormulario() {
      if (this.id_formulario) {
        this.loading = true
        var url =
          process.env.API_URL + `/admin/formularios/${this.id_formulario}/edit`

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }
        axios({
          method: 'get',
          url: url,
          params: {
            base64: true,
          },
          headers: headers,
        })
          .then((response) => {
            this.formulario = response.data.formulario
            let formulario = response.data.formulario
            this.formulario.nombre = formulario.nombre
            this.formulario.nota_maxima = formulario.nota_maxima
            this.formulario.fecha_inicio_formulario =
              formulario.fecha_inicio_formulario
            this.formulario.fecha_fin_formulario =
              formulario.fecha_fin_formulario
            this.formulario.url = formulario.url
            this.formulario.id = Number(formulario.id)
            this.formulario.id_tipo = Number(formulario.id_tipo)
            this.formulario.id_tema = Number(formulario.id_tema)
            this.formulario.id_centro = Number(formulario.id_centro)
            this.formulario.id_curso = Number(formulario.id_curso)

            this.formulario.id_modo = Number(formulario.id_modo)

            this.formulario.ordenar_aleatoriamente =
              formulario.ordenar_aleatoriamente === 1

            let campos = response.data.campos
            this.formulario.secciones = response.data.secciones

            campos.forEach((campo, index, arr) => {
              arr[index].tipo_input = JSON.parse(campo.tipo_input)
              arr[index].opciones = JSON.parse(campo.opciones)
              arr[index].arregloTable = JSON.parse(campo.arregloTable)

              campo.imagen_url = campo.imagen
              // campo.imagen = campo.imagen
              //   ? process.env.IMAGE_URL + '/formularios/' + campo.imagen
              //   : ''
            })

            this.formulario.secciones.forEach((seccion, index, arr) => {
              this.$set(
                seccion,
                'campos',
                campos.filter((campo) => campo.id_seccion === seccion.id),
              )
            })

            this.loading = false
            setTimeout(() => {
              this.scrollToTop()
            }, 0)

            this.$forceUpdate()
          })
          .catch((error) => {
            this.loading = false
            console.log({ error })

            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },
    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },
    regresar() {
      this.$router.push({
        name: 'formularios',
      })
    },
    btnVisible(btn, selectedItem) {
      let visible = false
      switch (btn) {
        case 'Evaluar':
          visible = this.formulario.id_tipo == 5561

          break
        default:
          break
      }

      return visible
    },
    enviarAlServidor() {
      this.loading = true
      let respuesta = this.selected[0]
      console.log('Enviando al servidor', respuesta)
      var method = 'post'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var url =
        process.env.API_URL +
        '/responder/formulario/' +
        respuesta.formulario.url

      axios({
        method: method,
        url: url,
        data: {
          formulario: respuesta.formulario,
          tipo_identidad: respuesta.tipo_identidad,
          doc_identidad: respuesta.doc_identidad,
          id_centro: respuesta.id_centro,
          id_curso: respuesta.id_curso,
          fecha_inicio_formulario: respuesta.fecha_inicio_formulario,
        },
        headers: headers,
      })
        .then((response) => {
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Formulario enviado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          if (this.$q.platform.is.mobile) {
            let respuestaRepo = getRepository('Respuestas')
            respuesta.enviado = 1
            let dis = this
            respuestaRepo.save(respuesta).then((respuestaGuardada) => {
              dis.selected = []
              dis.CargarRespuestas()
            })
          }

          // Forzar la recarga de la lista
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
    descargarExcel() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/respuestas/formulario/descargar'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: method,
        responseType: 'blob',
        url: url,
        data: { id_formulario: this.formulario.id },

        headers: headers,
      })
        .then((response) => {
          this.loading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          console.log(this.formulario.nombre + '.xlsx')
          link.setAttribute('download', this.formulario.nombre + '.xlsx') // or any other extension
          document.body.appendChild(link)
          link.click()
        })
        .catch((error) => {
          this.loading = false

          console.log({ error })

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
    onRequest(props) {
      this.CargarRespuestas(props)
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },

    filtrarRespuestas(val, update, abort) {
      update(() => {
        this.CargarRespuestas(val)
      })
    },

    CargarRespuestas(props) {
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

      this.loadingTable = true

      this.respuestas = []
      // Cargar desde SQLITE
      // Params:
      /**
       * filtro: this.filtro,
       * id_formulario: this.id_formulario
       */
      if (this.$q.platform.is.mobile) {
        let respuestasRepo = getRepository('Respuestas')
        respuestasRepo
          .find({
            id_formulario: this.id_formulario,
            enviado: -1,
          })
          .then((respuestas) => {
            for (let index = 0; index < respuestas.length; index++) {
              const element = respuestas[index]
              this.respuestas.push({
                id: element.id,
                nombre_participante: element.nombre_participante,
                fecha_inicio_formulario: element.fecha_inicio_formulario,
                fecha_fin_formulario: element.fecha_fin_formulario,
                id_respuesta: element.id_respuesta,
                id_formulario: element.id_formulario,
                formulario: JSON.parse(element.formulario),
                id_curso: element.id_curso,
                id_centro: element.id_centro,
                tipo_identidad: element.tipo_identidad,
                doc_identidad: element.doc_identidad,
                id_participante: element.id_participante,
              })
            }
            console.log(
              'terminó de mapear las respuestas desde sqlite:',
              respuestas,
            )
          })
          .catch((error) => {
            console.error('No se encontraron respuestas', error)
          })
      } else {
        var url =
          process.env.API_URL + '/respuestas/formulario/' + this.id_formulario

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
            table_format: true,
            id_formulario: this.id_formulario,
          },
          headers: headers,
        })
          .then((response) => {
            // if (
            //   response.data.result !== undefined &&
            //   response.data.result === false
            // ) {
            //   this.loading = false
            //   this.loadingTable = false

            //   return
            // }
            // this.formulario = response.data.formulario

            console.log(
              'entró a cargar las respuestas desde el api:',
              response.data,
            )
            this.curso = response.data.curso.curso
            this.loadingTable = false
            this.respuestas = this.respuestas.concat(
              response.data.respuestas.data,
            )
            this.loading = false
            this.loadingTable = false
            this.pagination.rowsNumber = response.data.respuestas.data.length >0 ?
              response.data.respuestas.data[0].total_rows : 0
            console.log({ pagination: this.pagination })
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = response.data.respuestas.current_page
            this.pagination.sortBy = sortBy
            this.pagination.descending = descending
          })
          .catch((error) => {
            // Luego de haber cargado todo
            this.loading = false
            this.loadingTable = false
            this.pagination.rowsNumber = this.respuestas.length
            this.pagination.rowsPerPage = rowsPerPage
            console.log({ error })
            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },
  },
  computed: {
    ancho() {
      let screen = this.$q.screen.lt
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
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      },
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

.pagina {
  margin: auto;
  padding-top: 80px;
  padding-bottom: 80px;
  max-width: 210mm;
}

.highcharts-credits {
  display: none;
}

.datos {
  font-weight: 600;
  font-size: 18px;
}

.highcharts-title {
  font-weight: 600;
  font-size: 18px;
  fill: #027be3 !important;
}
</style>
