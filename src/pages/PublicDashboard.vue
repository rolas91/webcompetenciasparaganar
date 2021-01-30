<template>
  <q-layout
    style="background-image:url('statics/imagenes-login/fondo.png');background-size: cover;"
  >
    <q-page-container>
      <q-page v-cloak>
        <div class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3 offset-md-1 mobile-centered">
              <q-img
                src="statics/imagenes-plantilla/logo3.png"
                contain
                position="center"
                style="height: 80px;max-width: 200px;"
              ></q-img>
            </div>

            <div class="col-12 col-md-3 offset-md-1 mobile-centered">
              <q-img
                src="statics/imagenes-plantilla/cosude.png"
                contain
                position="center"
                style="height: 80px;max-width: 200px;0px 30px;"
              ></q-img>
            </div>
            <div class="col-12 col-md-3 offset-md-1 mobile-centered">
              <q-img
                src="statics/imagenes-plantilla/swisscontact.png"
                contain
                position="center"
                style="height: 80px;max-width: 200px;0px 30px;"
              ></q-img>

              <q-btn
                flat=""
                style="float:right;color:white;"
                label="Iniciar Sesión"
                to="/login"
              />
            </div>
          </div>
        </div>

        <!-- <div class="row">
             <div class="col-12" style="display:flex;justify-content:flex-end;">
                  <q-btn flat="" label="Iniciar Sesión" to="/login" color="primary" />
             </div>

           </div> -->

        <div class="q-pa-md">
          <div class="row">
            <div class="col-12 col-md-7">
              <Highmaps
                ref="Highcharts"
                :constructor-type="'mapChart'"
                :options="chartOptions"
              ></Highmaps>
            </div>

            <div class="col-12 col-md-4 ">
              <div class="col-12 col-md-3">
                <div class="col-12">
                  <Highcharts
                    v-if="pieChartOptions"
                    :options="pieChartOptions"
                    ref="pieChart"
                  ></Highcharts>
                </div>
              </div>

              <div class="col-12 col-md-12">
                <div class="col-12 col-md-12">
                  <div class="row justify-center">
                    <div class="col-12 text-center">
                      <label class="text-white text-h6">Centros</label>
                    </div>
                  </div>
                  <q-list dense bordered separator>
                    <div v-if="centros.length > 0">
                      <div v-for="(centro, index) in centros" :key="centro.id">
                        <q-item
                          dense
                          clickable
                          v-ripple
                          :class="
                            centro.seleccionado
                              ? 'seleccionado'
                              : index % 2
                              ? 'even'
                              : 'odd'
                          "
                          @click="CargarCursos(centro.id)"
                        >
                          <q-item-section>
                            <q-item-label>{{ centro.nombre }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator />
                      </div>
                    </div>

                    <div v-else class="flex-center">
                      <label>
                        No hay centros en el departamento seleccionado
                      </label>
                    </div>
                  </q-list>
                </div>

                <div class="col-12 col-md-12">
                  <div class="row justify-center">
                    <div class="col-12 text-center">
                      <label class="text-white text-h6">Cursos</label>
                    </div>
                  </div>
                  <q-list dense bordered separator>
                    <div v-if="cursos.length > 0">
                      <q-item
                        dense
                        v-for="(curso, index) in cursos"
                        :key="curso.id"
                        clickable
                        v-ripple
                        :class="index % 2 ? 'even' : 'even'"
                      >
                        <q-item-section>
                          <q-item-label>{{ curso.nombre }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>

                    <div v-else class="flex-center">
                      <label class="text-white">
                        No hay cursos centro seleccionado
                      </label>
                    </div>
                  </q-list>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="q-pa-lg">
          <div class="container-logo-numu">
            <img
              :src="
                $q.screen.lt.sm
                  ? 'statics/imagenes-login/logo-numu.png'
                  : 'statics/imagenes-plantilla/numu.png'
              "
              class="logo-numu"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style></style>

<script>
// import { Chart } from 'highcharts-vue'
import Vue from 'vue'
import axios from 'axios'
import VueHighcharts from 'highcharts-vue'
import Highcharts from 'highcharts'
// import exportingInit from 'highcharts/modules/exporting'
import loadMap from 'highcharts/modules/map'
import { genComponent } from 'vue-highcharts'

import mapData from '@highcharts/map-collection/countries/ni/ni-all.geo.json'

// exportingInit(Highcharts)
loadMap(Highcharts)
Vue.use(VueHighcharts, { Highcharts })
Highcharts.maps['countries/ni/ni-all'] = mapData

export default {
  name: 'panelIndex',
  components: {
    Highmaps: genComponent('Highmaps', Highcharts),
    Highcharts: genComponent('Highcharts', Highcharts),
  },
  data() {
    return {
      centros: [],
      cursos: [],
      data: null,
      loading: false,
      chartOptions: {
        chart: {
          height: '100%',
        },

        title: {
          text: 'Centros en Nicaragua',
        },

        subtitle: {
          text: '',
        },

        colorAxis: {
          min: 0,
          max: 5,
          minColor: '#E6E7E8',
          maxColor: '#61cdd6',
        },

        mapNavigation: {
          enabled: false,
          buttonOptions: {
            verticalAlign: 'bottom',
          },
        },
        plotOptions: {
          map: {
            allowPointSelect: true,
            states: {
              hover: {
                color: '#ffe576',
              },
              select: {
                color: '#0f75bc',
                enabled: true,
              },
            },
            cursor: 'pointer',
          },
        },

        series: [],
      },
      pieChartOptions: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: {
          text: 'Distribución de centros por departamento',
        },

        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        legend: {
          itemStyle: {
            color: 'white',
          },
        },
        series: [],
      },
    }
  },
  async mounted() {
    if (this.$q.platform.is.mobile) {
      this.$router.push({
        name: 'login',
      })
      return
    }
    this.DistribucionXCentros()
    await this.DistribucionCentros()
    await this.CentrosXDepartamento('ni-mn')
  },

  methods: {
    CargarCursos(idCentro) {
      this.centros.forEach((centro, index, arr) => {
        if (centro.id === idCentro) {
          arr[index].seleccionado = true
        } else {
          arr[index].seleccionado = false
        }
      })
      this.loadingCursos = true
      var url = process.env.API_URL + '/catalogos/cursos/public'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        id_centro: idCentro,
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then(response => {
          this.cursos = response.data.cursos
          this.loadingCursos = false
        })
        .catch(error => {
          this.loadingCursos = false
          console.log({ error })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    DistribucionXCentros() {
      this.loading = true
      var url = process.env.API_URL + '/reportes/DistribucionCentros'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then(response => {
          this.loading = false
          this.DistribucionCentros = response.data.reporte

          this.$refs.pieChart.chart.addSeries({
            name: 'Centros',
            colorByPoint: true,
            data: this.DistribucionCentros,
          })
        })
        .catch(error => {
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
    CentrosXDepartamento(codigo, cargarPrimerCentro = false) {
      this.loading = true
      var url = process.env.API_URL + '/reportes/CentrosXDepartamento'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      let params = {
        codigo: codigo,
      }

      axios({
        method: 'get',
        url: url,
        params,
        headers: headers,
      })
        .then(response => {
          this.loading = false
          this.centros = response.data.centros
          this.cursos = []
          if (cargarPrimerCentro) {
            this.CargarCursos(this.centros[0].id)
          }
        })
        .catch(error => {
          console.log({ error })
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: error.response.data.message,
          })
        })
    },

    DistribucionCentros() {
      this.loading = true
      var url =
        process.env.API_URL + '/reportes/DistribucionCentrosXDepartamento'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then(response => {
          this.loading = false
          this.data = response.data.reporte

          let _data = this.data

          if (!this.$refs.Highcharts.chart) {
            return
          }

          this.$refs.Highcharts.chart.addSeries({
            nullColor: 'rgba(200, 200, 200, 0.3)',
            data: Highcharts.geojson(
              Highcharts.maps['countries/ni/ni-all'],
            ).map((d, i) => {
              d.drilldown = true
              d.value = _data.filter(
                i => i['codigo'] === d.properties['hc-key'],
              )[0]['cantidad']
              return d
            }),
            states: {
              hover: {
                color: '#ffe576',
              },
              select: {
                color: '#0f75bc',
                enabled: true,
              },
            },
            name: '',
            dataLabels: {
              enabled: true,
              formatter: function() {
                if (this.point.value !== 0) {
                  return this.point.name + '(' + this.point.value + ')'
                } else {
                  return this.point.name
                }
              },
            },
            tooltip: {
              pointFormat: '{point.name}: {point.value} Centros',
            },
            point: {
              events: {
                click: ({ point }) => {
                  console.log({ depa: point.properties['hc-key'] })
                  this.CentrosXDepartamento(point.properties['hc-key'], true)
                },
              },
            },
          })
        })
        .catch(error => {
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
  },
}
</script>

<style>
.page-title {
  margin: 0px 10px;
}
.bg-blue-background {
  background-color: #027be3;
}

#container {
  min-width: 320px;
  max-width: 800px;
  margin: 0 auto;
}
.loading {
  margin-top: 10em;
  text-align: center;
  color: gray;
}

.bg-blueish {
  background-color: #003399;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.seleccionado {
  background-color: #027be3;
  color: white;
}
.even {
  background-color: #e6ebf5;
  color: black;
}
.odd {
  background-color: white;
  color: #0f75bc;
}

.highcharts-background {
  fill: none !important;
}
tspan {
  color: white !important;
  font-size: 14px !important;
}

.highcharts-title tspan {
  color: white !important;
  background-color: white !important;
  fill: white !important;
  font-size: 18px !important;
}

.highcharts-credits {
  display: none !important;
}

.imagen-logo {
  width: 50%;
  justify-content: center;
  display: flex;
  margin: auto;
}

.login-card {
  margin-top: 20px;
  border: 1px solid white;
  border-radius: 10px;
  padding: 40px;
  margin-top: 5%;
}

.container-logo-numu {
  display: flex;
  bottom: 0;
  margin-top: 60px;
  justify-content: center;
  width: 100%;
}

.logo-numu {
  width: 7%;
}

@media (max-width: 1024px) {
  .imagen-logo {
    width: 60% !important;
  }

  .logo {
    width: 50% !important;
    margin: auto;
    margin-top: 15px;
  }

  .mobile-centered {
    display: flex;
    justify-content: center;
  }
  .logo-numu {
    width: 20%;
  }
  .container-logo-numu {
    display: flex;
    bottom: 0;
    margin-top: 0px !important;
    justify-content: center;
    width: 100%;
  }
}
</style>
