<template>
  <q-page>
    <div class="q-pa-md">
      <br />
      <div id="div-controles" class="row q-col-gutter-md">
        <!-- <div class="col-12">
          <label class="titulo">Reportes</label>
        </div> -->

        <div class="col-12 col-md-3">
          <q-select
            clearable
            v-model="reporte"
            label="Reportes"
            :options="esquemas"
            option-value="id"
            option-label="nombre"
            @input="setEsquema"
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

        <div id="div-controles-reportes2" class="col-12 col-md-3">
          <q-select
            v-model="tipo_grafico"
            label="tipo de gráfico"
            :options="tipo_graficos"
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

        <div class="col-12 col-md-3">
          <q-select
            v-model="id_datasource"
            label="Fuente de datos"
            :options="setDatos"
            emit-value
            map-options
            @input="LoadData(true)"
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

        <div class="col-12 col-md-3" id="div-controles-reportes">
          <q-btn
            flat
            color="primary"
            icon="add_circle"
            @click="AbrirModalNuevo"
          >
            Nuevo
          </q-btn>
          <q-btn flat color="primary" icon="edit" @click="AbrirModalEditar">
            Editar
          </q-btn>
        </div>

        <div class="row q-col-gutter-md">
          <div class="">
            <q-btn
              id="btnDescargarExcel"
              v-if="this.id_datasource"
              icon="fas fa-file-excel"
              label="Descargar Excel"
              @click="descargarExcel"
              class="bg-white"
              color="green"
            ></q-btn>
          </div>

          <div class="">
            <q-btn
              id="btnImprimir"
              v-if="this.id_datasource"
              icon="print"
              label="Imprimir"
              @click="Imprimir"
              color="primary"
            ></q-btn>
          </div>
        </div>
      </div>
    </div>

    <div>
      <DxChart ref="chart">
        <DxTooltip :enabled="true" />
        <DxAdaptiveLayout :width="450" />
        <DxSize :height="200" />
        <DxCommonSeriesSettings :type="tipo_grafico" />
      </DxChart>

      <DxPivotGrid
        id="pivotgrid"
        ref="grid"
        :data-source="dataSource"
        :allow-sorting-by-summary="true"
        :allow-filtering="true"
        :show-borders="true"
        :show-column-grand-totals="true"
        :show-row-grand-totals="true"
        :show-row-totals="true"
        :show-column-totals="true"
        :on-context-menu-preparing="onContextMenuPreparing"
        row-header-layout="tree"
      >
        <DxHeaderFilter
          :allow-search="true"
          :show-relevant-values="true"
          :width="300"
          :height="400"


        />
        <DxFieldChooser :enabled="true" :height="400" />
        <DxExport :enabled="true"  style="padding:50px" />

        <DxFieldPanel
          :show-column-fields="showColumnFields"
          :show-data-fields="showDataFields"
          :show-filter-fields="showFilterFields"
          :show-row-fields="showRowFields"
          :allow-field-dragging="true"
          :visible="true"
        />
      </DxPivotGrid>

      <DxPopup
        :width="600"
        :height="400"
        :title="popupTitle"
        :visible.sync="popupVisible"
        @shown="onShown"
      >
        <!-- <DxDataGrid
          :ref="dataGridRefName"
          :width="560"
          :height="300"
          :data-source="drillDownDataSource"
        ></DxDataGrid> -->
      </DxPopup>
    </div>

    <q-dialog v-model="modalOpen" persistent>
      <q-card style="width: 1024px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white q-gutter-sm">
          <h5>{{ nuevo ? 'Nuevo Esquema' : 'Editar Esquema' }}</h5>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-form @submit="guardarEsquema" class>
            <div class="row q-col-gutter-md">
              <div v-if="!nuevo" class="col-6">
                <q-select
                  v-model="reporte_seleccionado"
                  label="Reportes"
                  :options="esquemas"
                  option-value="id"
                  option-label="nombre"
                  @input="CambiarNombreseleccionado"
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
              <div :class="nuevo ? 'col-12' : 'col-6'">
                <q-input
                  input-style="text-transform:uppercase;"
                  color="primary"
                  v-model="nombre_reporte"
                  label="Nombre"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 191) ||
                      'Ingrese un Nombre válido',
                  ]"
                ></q-input>
              </div>
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
              >
                Guardar
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style></style>

<script>
import axios from 'axios'

import {
  DxChart,
  DxAdaptiveLayout,
  DxCommonSeriesSettings,
  DxSize,
  DxTooltip,
} from 'devextreme-vue/chart'

import {
  DxPivotGrid,
  DxExport,
  DxFieldChooser,
  DxFieldPanel,
  DxHeaderFilter,
  DxDataGrid,
  DxColumn,
} from 'devextreme-vue/pivot-grid'

import { DxCheckBox } from 'devextreme-vue/check-box'
import sales from './../../../../data.js'
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source'
import { DxPopup } from 'devextreme-vue/popup'

import esMessages from "devextreme/localization/messages/es.json";
import { locale, loadMessages } from "devextreme/localization";

export default {
  components: {
    DxChart,
    DxAdaptiveLayout,
    DxCommonSeriesSettings,
    DxSize,
    DxTooltip,
    DxPivotGrid,
    DxFieldChooser,
    DxFieldPanel,
    DxCheckBox,
    DxHeaderFilter,
    DxPopup,
    DxExport,
    DxDataGrid,
  },
  data() {
    return {
      fields: [],
      nombre_reporte: '',
      reporte_seleccionado: null,
      nuevo: true,
      data: [],
      reporte: {
        id: null,
        id_datasource: null,
        nombre: null,
        esquema: null,
      },
      modalOpen: false,
      loading: false,
      id_datasource: null,
      respuestas: [],
      esquemas: [],
      setDatos: [],
      DistribucionCentros: [],
      pivotData: [],
      tipo_grafico: null,
      tipo_graficos: [
        { label: 'Gráfico de Área', value: 'area' },
        { label: 'Gráfico de Barra', value: 'bar' },
        { label: 'Gráfico de Candela ', value: 'candlestick ' },
        { label: 'Gráfico de Área apilada completa', value: 'fullstackedarea' },
        { label: 'Gráfico de burbujas', value: 'bubble' },
        { label: 'Gráfico de barra apilada completa', value: 'fullstackedbar' },
        { label: 'Gráfico de líneas', value: 'line' },
        {
          label: 'Gráfico de línea apilada',
          value: 'stackedline',
        },
        {
          label: 'Gráfico de línea apilada completa',
          value: 'fullstackedline',
        },
        {
          label: 'Gráfico de Área de spline de pila completa',
          value: 'fullstackedsplinearea',
        },
        { label: 'Gráfico de rango de área', value: 'rangearea' },
        { label: 'Gráfico de rango de barra', value: 'rangebar' },
        { label: 'Gráfico de disperción', value: 'scatter' },
        { label: 'Gráfico de área de spline', value: 'splinearea' },
        { label: 'Gráfico de barra apilada', value: 'stackedbar' },
        { label: 'Gráfico de acciones', value: 'stock' },
      ],
      dataGridRefName: 'dataGrid',
      drillDownDataSource: null,
      popupTitle: '',
      popupVisible: false,
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true,
      allowCrossGroupCalculation: true,
      dataSource: new PivotGridDataSource({
        fields: this.fields,
        store: this.data,
      }),

    }
  },
  mounted() {
    this.CargarSetDatos()

    const pivotGrid = this.$refs.grid.instance
    const chart = this.$refs.chart.instance
    pivotGrid.bindChart(chart, {
      dataFieldsDisplayMode: this.tipo_grafico,
      alternateDataFields: false,
    })
    const dataSource = pivotGrid.getDataSource()


  },
  created(){
 loadMessages(esMessages);
        locale('es-ES');
  },
  methods: {
    CambiarNombreseleccionado() {
      console.log('reporte_seleccionado:', this.reporte_seleccionado)
      this.nombre_reporte = this.esquemas.filter(
        item => item.id === this.reporte_seleccionado.id,
      )[0].nombre
    },
    Imprimir() {
      this.$store.commit('setLeftDrawerOpen', false)
      setTimeout(() => {
        window.print()
      }, 1000)
    },
    descargarExcel() {
      this.loading = true
        var method = 'post'
        var url = process.env.API_URL + '/reportes/descargar'
        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }

        var data = {
          id_formulario : this.id_datasource
        }

        axios({
          method: method,
          responseType: 'blob',
          url: url,
          headers: headers,
          data:data
        })
          .then((response) => {
            this.loading = false
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'reporte.xlsx') // or any other extension
            document.body.appendChild(link)
            link.click()
          })
          .catch((error) => {
            this.loading = false

            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: "Lo sentimos, este reporte no contiene datos",
            })

            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
    },

 OnShowColumnFieldsChanged(e) {
      this.showColumnFields = e.value;
    },
    OnShowDataFieldsChanged(e) {
      this.showDataFields = e.value;
    },
    OnShowFilterFieldsChanged(e) {
      this.showFilterFields = e.value;
    },
    OnShowRowFieldsChanged(e) {
      this.showRowFields = e.value;
    },
    onContextMenuPreparing(e) {
      var dataSource = e.component.getDataSource(),
        sourceField = e.field;

      if (sourceField) {
        if(!sourceField.groupName || sourceField.groupIndex === 0) {
          e.items.push({
            text: 'Ocultar Campo',
            onItemClick: function() {
              var fieldIndex;
              if(sourceField.groupName) {
                fieldIndex = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex].index;
              } else {
                fieldIndex = sourceField.index;
              }

              dataSource.field(fieldIndex, {
                area: null
              });
              dataSource.load();
            }
          });
        }

        if (sourceField.dataType === 'number') {
          var setSummaryType = function(args) {
              dataSource.field(sourceField.index, {
                summaryType: args.itemData.value
              });

              dataSource.load();
            },
            menuItems = [];

          e.items.push({ text: 'Tipo de operación', items: menuItems });

          [{ text:'Suma',value: 'Sum' }, { text: 'Promedio', value: 'Avg'}, {text: 'Mínimo', value:'Min'}, { text:'Máximo', value: 'Max'}, {text: 'Contar', value: 'Count'}].forEach(summaryType => {
            var summaryTypeValue = summaryType.value.toLowerCase();

            menuItems.push({
              text: summaryType.text,
              value: summaryTypeValue,
              onItemClick: setSummaryType,
              selected: e.field.summaryType === summaryTypeValue
            });
          });
        }
      }
    },

    cambiarGrafico() {
      const pivotGrid = this.$refs.grid.instance
      const chart = this.$refs.chart.instance
      pivotGrid.bindChart(chart, {
        dataFieldsDisplayMode: this.tipo_grafico,
        alternateDataFields: false,
      })

      console.log('entró a cambiar el gráfico:', this.tipo_grafico)
    },

    exportData() {
      window.print()
    },

    setEsquema() {
      this.LoadData()
    },

    AbrirModalNuevo() {
      if (!this.id_datasource) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'Primero debes seleccionar una fuente de datos',
        })
        return
      }

      this.modalOpen = true
      this.nuevo = true
      this.nombre_reporte = null
      this.reporte_seleccionado = null
    },
    AbrirModalEditar() {
      if (!this.id_datasource) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'Primero debes seleccionar una fuente de datos',
        })
        return
      }

      this.modalOpen = true
      this.nuevo = false
      this.nombre_reporte = this.reporte.nombre
      this.reporte_seleccionado = this.reporte
    },

    guardarEsquema() {
      this.loading = true
      var method = 'post'
      var url = process.env.API_URL + '/admin/reportes'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/reportes/' + this.reporte.id
        method = 'put'
      }
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      const pivotGrid = this.$refs.grid.instance
      if (this.nuevo) {
        this.reporte = {
          id_datasource: this.id_datasource,
          nombre: this.nombre_reporte,
          esquema: pivotGrid.getDataSource()._fields,
        }
      } else {
        this.reporte = this.reporte_seleccionado
        this.reporte.nombre = this.nombre_reporte
        this.reporte.esquema = pivotGrid.getDataSource()._fields
      }
      axios({
        method: method,
        url: url,
        data: {
          id_datasource: this.id_datasource,
          reporte: this.reporte,
        },
        headers: headers,
      })
        .then(response => {
          this.loading = false
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Reporte creado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.CargarEsquemas()
          this.modalOpen = false
        })
        .catch(error => {
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

    CargarSetDatos() {
      this.loading = true
      var url = process.env.API_URL + '/reportes/SetDatos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        params: {},
        headers: headers,
      })
        .then(response => {
          this.setDatos = response.data.datos
          this.loading = false
          this.CargarEsquemas()
        })
        .catch(error => {
          this.loading = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    OnlyLoadData() {
      this.loading = true
      let url = `${process.env.API_URL}/respuestas/formulario/${this.id_datasource}`
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'get',
        url: url,
        params: { id_datasource: this.id_datasource },
        headers: headers,
      })
        .then(response => {
          console.log('Entro a onlyLoadData')
          this.loading = false
          this.data = sales // response.data
        })
        .catch(error => {
          console.log({ error })
          this.loading = false
          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
      this.loading = false
    },

    LoadData(removeReport = false) {
      console.log('entró a LoadData')
      this.loading = true
      this.$q.loading.show({
        delay: 400, // ms
      })

      if (removeReport) {
        this.reporte = {
          id: null,
          id_datasource: null,
          nombre: null,
          esquema: null,
        }
      }

      if (!removeReport && this.reporte && this.reporte.id_datasource) {
        this.id_datasource = this.reporte.id_datasource
      }

      let url = `${process.env.API_URL}/respuestas/formulario/${this.id_datasource}`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'get',
        url: url,
        params: { id_datasource: this.id_datasource },
        headers: headers,
      })
        .then(response => {
          this.loading = false
          this.$q.loading.hide()
          if (this.id_datasource === 500000) {
            this.data = response.data.data
          } else {
            this.data = response.data
          }
          console.log('data', this.data)
          let newDataSource = null
          const pivotGrid = this.$refs.grid.instance
          try {
            this.dataSource.store = response.data

            //Validamos si removemos el reporte del datasource
            if (!removeReport && this.reporte && this.reporte.id) {
              console.log('fields:', this.reporte.esquema)
              this.dataSource = new PivotGridDataSource({
                fields: this.reporte.esquema,
                store: this.data,
                retrieveFields: false,
              })
            } else {
              //Entró a cambiar el datasource
              console.log('entró a cambiar el datasource')
              this.dataSource = new PivotGridDataSource({
                store: this.data,
                retrieveFields: true,
              })
            }
          } catch (error) {
            this.$q.loading.hide()
          }
        })
        .catch(error => {
          this.loading = false
          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
      this.loading = false
    },
    CargarEsquemas() {
      this.loading = true
      var url = process.env.API_URL + '/admin/reportes'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        params: { id_datasource: this.id_datasource },
        headers: headers,
      })
        .then(response => {
          let esquemas = response.data.esquemas

          esquemas.forEach((item, index, arr) => {
            arr[index].esquema = JSON.parse(item.esquema)
          })

          this.esquemas = esquemas
          this.loading = false
        })
        .catch(error => {
          this.loading = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    onCellClick(e) {
      if (e.area == 'data') {
        var pivotGridDataSource = e.component.getDataSource(),
          rowPathLength = e.cell.rowPath.length,
          rowPathName = e.cell.rowPath[rowPathLength - 1]
        this.drillDownDataSource = pivotGridDataSource.createDrillDownDataSource(
          e.cell,
        )
        this.popupTitle = `${
          rowPathName ? rowPathName : 'Total'
        } Drill Down Data`
        this.popupVisible = !this.popupVisible
      }
    },
    onShown() {
      this.dataGrid.updateDimensions()
    },
  },
  computed: {
    dataGrid: function() {
      return this.$refs[this.dataGridRefName].instance
    },
  },
  watch: {
    '$store.state.leftDrawerOpen': function() {
      console.log(this.$store.state.leftDrawerOpen)
      setTimeout(() => {
        const pivotGrid = this.$refs.grid.instance
        pivotGrid.updateDimensions()
      }, 300)
    },
  },
}
</script>

<style>
table.pvtTable {
  font-size: 11pt;
}

table.pvtTable tbody tr th,
table.pvtTable thead tr th {
  font-size: 11pt;
}

.pvtAxisContainer li span.pvtAttr {
  font-size: 11pt;
}

.titulo {
  color: #027be3;
}

tspan {
  color: black !important;
  font-size: 14px !important;
}

Highcharts .highcharts-title tspan {
  color: black !important;
  background-color: white !important;
  fill: white !important;
  font-size: 18px !important;
}

.highcharts-credits {
  display: none !important;
}

.highcharts-background {
  fill: none !important;
}

@media print {
  header,
  aside,
  #div-controles-reportes,
  #div-controles-reportes2,
  #wdr-toolbar-wrapper,
  #btnImprimir,
  #btnDescargarExcel {
    display: none;
  }

  #highchartsContainer {
    display: flex !important;
  }
}

#sales {
  max-height: 570px;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  width: 24%;
  display: inline-block;
  margin-top: 10px;
}
.dx-icon-xlsxfile{
  color:#2b9851!important;
}
.dx-button-content{
  padding:10px;
}
</style>
