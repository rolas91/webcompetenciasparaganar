<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md pagina">
        <q-card-actions class="row justify-between q-gutter-sm screenOnly">
          <q-btn right icon="chevron_left" @click="regresar">Regresar</q-btn>
          <q-btn color="primary" icon="print" @click="imprimir">Imprimir</q-btn>
        </q-card-actions>
        <div id="respuestas-formulario" v-if="formulario" class="printable">
          <div class="q-pa-md">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo2.png"
                    contain
                    position="center"
                    style="height: 80px;max-width: 250px;"
                  ></q-img>
                </div>

                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo-cosude.png"
                    contain
                    position="center"
                    style="height: 80px;max-width: 250px;"
                  ></q-img>
                </div>

                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo-swisscontact.png"
                    contain
                    position="center"
                    style="height: 80px;max-width: 180px;"
                  ></q-img>
                </div>
              </div>

              <div class="seccion">
                <br />
                <br />

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
                    </label> -->
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
                          {{
                            formulario.id_tipo == 5561 && Number(campo.nota) > 0
                              ? `(${campo.nota} Puntos)`
                              : ''
                          }}
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
                          contain=""
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
                          lazy-rules
                          :rules="[
                            val =>
                              (isValidDate(val) &&
                                /\d{1,2}\/\d{1,2}\/\d{4}/.test(val) &&
                                (val || !campo.requerido)) ||
                              'Ingrese un fecha válida',
                          ]"
                          :error="!campo.isValid"
                          error-message="Ingrese una fecha válida"
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
                            <table class="full-width bg-white  q-mt-md">
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

                            <label
                              style="color:#c10015;font-size:12px"
                              v-if="
                                !campo.isValid &&
                                  campo.requerido &&
                                  !campo.respuesta
                              "
                            >
                              Selecciona una opción para todas las filas
                            </label>
                          </div>
                        </div>

                        <!-- Departamento -->
                        <q-select
                          v-if="campo.id_tipo === 4"
                          bg-color="white"
                          v-model="campo.respuesta"
                          :options="departamentos"
                          lazy-rules
                          emit-value
                          map-options
                          option-value="nombre"
                          option-label="nombre"
                          @input="
                            CargarMunicipios(
                              campo,
                              campo.respuesta,
                              formulario.secciones[page].campos[index + 1],
                              true,
                            )
                          "
                        />

                        <!-- Municipio -->
                        <q-select
                          v-if="campo.id_tipo === 5"
                          bg-color="white"
                          v-model="campo.respuesta"
                          :options="municipios"
                          lazy-rules
                          emit-value
                          map-options
                          option-value="nombre"
                          option-label="nombre"
                        />

                        <!-- Calificacion -->
                        <q-rating
                          readonly
                          v-if="campo.id_tipo === 6"
                          v-model="campo.respuesta"
                          size="2.5em"
                          max="10"
                        ></q-rating>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
        </div>
        <q-card-actions class="row justify-between q-gutter-sm screenOnly">
          <q-btn right icon="chevron_left" @click="regresar">Regresar</q-btn>
        </q-card-actions>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      formulario: null,
    }
  },
  mounted() {
    this.CargarDatosFormulario()
  },
  methods: {
    regresar() {
      this.$router.go(-1)
    },

    imprimir() {
      window.print()
    },
    CargarDatosFormulario() {
      this.loading = true
      var url =
        process.env.API_URL +
        `/imprimir-formulario/${this.$route.params.id_formulario}`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then(response => {
          let formulario = response.data.formulario

          let campos = response.data.campos
          formulario.secciones = response.data.secciones

          campos.forEach((campo, index, arr) => {
            arr[index].tipo_input = JSON.parse(campo.tipo_input)
            arr[index].opciones = JSON.parse(campo.opciones)

            arr[index].opciones.forEach((opt, ind, ar) => {
              ar[ind].respuesta = false
            })

            if (campo.id_tipo === 3) {
              arr[index].arregloTable = JSON.parse(campo.arregloTable)
              let respuestas = JSON.parse(campo.respuesta)
              console.log({
                respuestas: respuestas,
                arregloTable: campo.arregloTable,
              })
            }
            campo.imagen_url = campo.imagen
            // campo.imagen = campo.imagen ? process.env.IMAGE_URL + '/formularios/' + campo.imagen : ''
          })

          formulario.secciones.forEach((seccion, index, arr) => {
            arr[index].campos = campos.filter(
              campo => campo.id_seccion === seccion.id,
            )
          })

          this.formulario = formulario

          setTimeout(() => {
            this.imprimir()
          }, 1000)
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
    app_url() {
      return process.env.WEB_URL + '/'
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
</style>
