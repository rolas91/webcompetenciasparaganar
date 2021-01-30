<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md pagina">
        <q-card-actions class="row justify-between q-gutter-sm screenOnly">
          <q-btn v-if="!loading" right icon="chevron_left" @click="regresar">
            Regresar
          </q-btn>
          <q-btn
            v-if="!loading && $route.name === 'imprimir_respuesta_formulario'"
            color="primary"
            icon="print"
            @click="imprimir"
          >
            Imprimir
          </q-btn>
          <q-btn
            v-if="$route.name === 'respuesta_formulario'"
            color="primary"
            icon="print"
            @click="abrir_imprimir"
          >
            Imprimir
          </q-btn>
        </q-card-actions>
        <div id="respuestas-formulario" v-if="formulario" class="printable">
          <div class="q-pa-md bg-white">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo2.png"
                    contain
                    position="center"
                    class="imagen-logo"
                  ></q-img>
                </div>

                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo_cosude.png"
                    contain
                    position="center"
                    class="imagen-logo"
                  ></q-img>
                </div>

                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo_swisscontact.png"
                    contain
                    position="center"
                    class="imagen-logo"
                  ></q-img>
                </div>
              </div>

              <div class="seccion">
                <br />
                <br />

                <!-- <span class="titulo text-primary q-mb-xl"> {{formulario.nombre}} ({{formulario.nota_maxima}} Puntos) </span> -->

                <div
                  v-for="(seccion, page) in formulario.secciones"
                  :key="seccion.id"
                  :class="page > 0 ? 'pagebreak' : ''"
                >
                  <div class="row q-col-gutter-md">
                    <label class="titulo text-primary">
                      {{ seccion.titulo }}
                    </label>
                  </div>

                  <div class="row q-col-gutter-md">
                    <label v-html="seccion.descripcion"></label>
                  </div>
                  <br />

                  <div v-if="page === 0">
                    <!-- <label class="pregunta">
                      Los campos con
                      <span class="requerido">*</span> son requeridos
                    </label>-->
                    <br />
                    <br />
                    <br />
                  </div>

                  <div
                    v-for="(campo, index) in formulario.secciones[page].campos"
                    :key="index"
                    class="nobreak"
                  >
                    <div class="row q-col-gutter-lg q-pa-md">
                      <!-- texto corto -->
                      <div class="col-12">
                        <label class="pregunta q-mb-md q-mt-md flex">
                          {{ index + 1 + '.' }} {{ campo.texto }}
                          <!-- {{formulario.id_tipo ==5561 && Number(campo.nota)>0 ? `(${campo.nota} Puntos)`:''}} -->
                          <span
                            style="color:#c10015;font-size:20px;display:inline;"
                          >
                            {{ campo.requerido ? '*' : '' }}
                          </span>
                        </label>

                        <q-img
                          v-if="campo.imagen"
                          class="imagen q-mb-md"
                          :src="campo.imagen"
                          spinner-color="white"
                          contain
                        />

                        <label class="pregunta q-mt-md">
                          {{ campo.subtitulo }}
                        </label>

                        <q-input
                          disable
                          outlined
                          v-if="
                            campo.id_tipo === 2 && campo.tipo_input.id === 1
                          "
                          v-model="campo.respuesta"
                          type="text"
                          input-style="text-transform: uppercase;"
                        />
                        <!-- Texto largo -->
                        <q-input
                          disable
                          v-if="
                            campo.id_tipo === 2 && campo.tipo_input.id === 2
                          "
                          v-model="campo.respuesta"
                          type="textarea"
                          outlined
                        />

                        <!-- Numero -->
                        <q-input
                          disable
                          outlined
                          v-if="
                            campo.id_tipo === 2 && campo.tipo_input.id === 3
                          "
                          v-model.number="campo.respuesta"
                          type="number"
                        />

                        <!-- Fecha -->
                        <q-input
                          disable
                          outlined
                          v-if="
                            campo.id_tipo === 2 && campo.tipo_input.id === 4
                          "
                          v-model="campo.respuesta"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy
                                :ref="'qDateProxy' + campo.id"
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date
                                  mask="DD/MM/YYYY"
                                  v-model="campo.respuesta"
                                  @input="
                                    () => hideDatePopUp('qDateProxy' + campo.id)
                                  "
                                  lazy-rules
                                  :rules="[
                                    val =>
                                      (val && val.length > 0) ||
                                      'Ingrese una fecha válida',
                                  ]"
                                />
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>

                        <!-- Radio buttons o Seleccion multiple -->
                        <div
                          class="row q-col-gutter-md q-pa-md"
                          v-if="
                            campo.id_tipo === 1 && campo.tipo_input.id === 1
                          "
                        >
                          <div class="col-12 q-col-gutter-md">
                            <q-radio
                              disable
                              v-for="opcion in campo.opciones"
                              :key="opcion.id"
                              v-model="campo.respuesta"
                              :val="opcion.nombre"
                              :label="opcion.nombre"
                            />
                          </div>
                          <label
                            style="color:#c10015;font-size:12px;"
                            v-if="
                              !campo.isValid &&
                                campo.requerido &&
                                !campo.respuesta
                            "
                          >
                            Selecciona una opción
                          </label>
                        </div>

                        <!-- Select -->
                        <q-select
                          disable
                          v-if="
                            campo.id_tipo === 1 && campo.tipo_input.id === 3
                          "
                          bg-color="white"
                          v-model="campo.respuesta"
                          :options="campo.opciones"
                          lazy-rules
                          emit-value
                          map-options
                          option-value="nombre"
                          option-label="nombre"
                        />

                        <!-- Casillas de verificación -->

                        <div
                          v-if="
                            campo.id_tipo === 1 && campo.tipo_input.id === 2
                          "
                        >
                          <div class="row">
                            <q-list
                              dense
                              padding
                              style="background-color:white"
                            >
                              <q-item
                                v-ripple
                                tag="label"
                                v-for="option in campo.opciones"
                                :key="option.id"
                              >
                                <q-item-section side top>
                                  <q-checkbox
                                    disable
                                    v-model="option.respuesta"
                                    :true-value="option.nombre"
                                    :false-value="false"
                                  />
                                </q-item-section>

                                <q-item-section>
                                  <q-item-label>
                                    {{ option.nombre }}
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </div>

                          <label
                            style="color:#c10015;font-size:12px"
                            v-if="
                              !campo.isValid &&
                                campo.requerido &&
                                !campo.respuesta
                            "
                          >
                            Selecciona una opción
                          </label>
                        </div>

                        <!-- TABLA -->

                        <div
                          v-if="
                            campo.id_tipo === 3 &&
                              campo.arregloTable &&
                              campo.arregloTable.length > 0
                          "
                          class="row"
                        >
                          <div class="col-12">
                            <table class="full-width bg-white q-mt-md">
                              <thead class="full-width text-center">
                                <td></td>
                                <td
                                  v-for="col in campo.arregloTable[0].columns"
                                  :key="col.id"
                                >
                                  {{ col.valor }}
                                </td>
                              </thead>
                              <tr
                                v-for="fila in campo.arregloTable"
                                :key="fila.id"
                              >
                                <span class="flex q-mt-md">
                                  {{ fila.valor }}
                                </span>
                                <td
                                  v-for="(columna, index2) in fila.columns"
                                  :key="columna.id"
                                  class="text-center"
                                >
                                  <q-radio
                                    disable
                                    class="text-right"
                                    @input="
                                      setFilaCheckbox(
                                        campo,
                                        fila,
                                        fila.columns[index2],
                                      )
                                    "
                                    v-model="fila.columns[index2].checked"
                                    :val="true"
                                  ></q-radio>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>

                        <!-- Departamento -->
                        <q-select
                          disable
                          v-if="campo.id_tipo === 4"
                          bg-color="white"
                          v-model="campo.respuesta"
                          :options="departamentos"
                          lazy-rules
                          emit-value
                          map-options
                          option-value="nombre"
                          option-label="nombre"
                        />

                        <!-- Municipio -->
                        <q-select
                          disable
                          v-if="campo.id_tipo === 5"
                          bg-color="white"
                          v-model="campo.respuesta"
                          :options="municipios"
                          emit-value
                          map-options
                          option-value="nombre"
                          option-label="nombre"
                        />

                        <!-- Calificacion -->
                        <q-rating
                          readonly=""
                          v-if="campo.id_tipo === 6"
                          v-model="campo.respuesta"
                          size="2.5em"
                          max="10"
                          color="yellow"
                            icon="star_border"
                            icon-selected="star"
                        ></q-rating>

                          <span  v-if="campo.id_tipo === 6"> ( {{campo.respuesta ? campo.respuesta : 0}} ) </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
        </div>
        <q-card-actions class="row justify-between q-gutter-sm screenOnly">
          <q-btn v-if="!loading" right icon="chevron_left" @click="regresar">
            Regresar
          </q-btn>
        </q-card-actions>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios'
import { getRepository } from 'typeorm'
export default {
  data() {
    return {
      loading: false,
      formulario: null,
      campos: null,
      secciones: null,
      respuesta: null,
      respuesta_campos: null,
    }
  },
  mounted() {
    this.loading = true
    if (this.$route.params.id_formulario && this.$route.params.id_respuesta) {
      this.CargarDatosFormulario()

      if (this.$route.name === 'imprimir_respuesta_formulario') {
        setTimeout(() => {
          this.imprimir()
        }, 1000)
      }
    }
  },
  methods: {
    regresar() {
      this.$router.push({
        name: 'respuestas_formulario',
        params: { id_formulario: this.$route.params.id_formulario },
      })
    },

    abrir_imprimir() {
      let routeData = this.$router.resolve({
        name: 'imprimir_respuesta_formulario',
        query: {
          id_formulario: this.$route.params.id_formulario,
          id_respuesta: this.$route.params.id_respuesta,
        },
      })
      window.open(routeData.href, '_blank')
    },

    imprimir() {
      window.print()
    },
    CargarDatosFormulario() {
      if (this.$store.getters.online === false) {
        const repoRespuestas = getRepository('Respuestas')
        repoRespuestas
          .find({ where: { id_respuesta: this.$route.params.id_respuesta } })
          .then(respuesta => {
            this.formulario = respuesta.formulario
          })
      } else {
        this.loading = true
        var url =
          process.env.API_URL +
          `/formularios/${this.$route.params.id_formulario}/respuesta/${this.$route.params.id_respuesta}`

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
            let formulario = response.data.formulario

            let campos = response.data.campos
            formulario.secciones = response.data.secciones

            campos.forEach((campo, index, arr) => {
              arr[index].tipo_input = JSON.parse(campo.tipo_input)
              arr[index].opciones = JSON.parse(campo.opciones)

              if (campo.id_tipo === 1 && campo.tipo_input.id === 2) {
                campo.opciones.forEach((opcion, index2, arr2) => {
                  if (campo.respuesta.split(',').includes(opcion.nombre)) {
                    arr[index].opciones[index2].respuesta = opcion.nombre
                  } else {
                    arr[index].opciones[index2].respuesta = false
                  }
                })
              }

              if (campo.id_tipo === 3) {
                arr[index].arregloTable = JSON.parse(campo.respuesta)

              }
              campo.imagen_url = campo.imagen
              // campo.imagen = campo.imagen
              //   ? process.env.IMAGE_URL + '/formularios/' + campo.imagen
              //   : ''
            })

            formulario.secciones.forEach((seccion, index, arr) => {
              arr[index].campos = campos.filter(
                campo => campo.id_seccion === seccion.id,
              )
            })

            this.formulario = JSON.parse(JSON.stringify(formulario))
            this.campos = response.data.campos
            this.secciones = response.data.secciones
            this.respuesta = response.data.respuesta
            this.respuesta_campos = response.data.respuesta_campos
          })
          .catch(error => {
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
      }
    },
  },
  computed: {
    ancho() {
      let screen = this.$q.screen.lt
      let size = 500

      if (screen.xs) {
        size = 0
        return window.screen.width - size + 'px'
      }

      if (screen.sm) {
        size = 0
        return window.screen.width - size + 'px'
      }

      if (screen.md) {
        size = 150
        return window.screen.width - size + 'px'
      }

      if (screen.lg) {
        size = 250
        return window.screen.width - size + 'px'
      }

      if (screen.xl) {
        size = 500
        return window.screen.width - size + 'px'
      }

      return window.screen.width - size + 'px'
    },
  },
}
</script>

<style>
.titulo {
  font-size: 20px;
  font-weight: bold;
}

.pregunta {
  font-weight: bold;
}

.q-field__label {
  font-weight: bold;
}

@media print {
  .screenOnly {
    display: none;
  }
  .printable {
    display: block;
  }
  .pagebreak {
    page-break-before: always;
  } /* page-break-after works, as well */

  .nobreak {
    page-break-inside: avoid;
  }
}

.pagina {
  margin: auto;
  padding-top: 80px;
  padding-bottom: 80px;
  max-width: 210mm;
}

.requerido {
  color: #c10015;
  font-size: 20px;
  display: inline;
}

.imagen-logo {
  height: 80px;
  max-width: 250px;
}

.nowrap {
  white-space: nowrap;
}

.error-label {
  white-space: nowrap;
  color: #c10015;
  font-size: 12px;
}

.numeracion {
  display: flex;
  position: relative;
  top: 90px;
  left: 5px;
  font-weight: bold;
  padding-right: 10px;
}
</style>
