<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-grey-2">
      <q-page
        id="vistaPrevia"
        class="q-pa-md pagina"
        style="
          margin: auto;
          padding-top: 80px;
          padding-bottom: 80px;
          max-width: 210mm;
        "
      >
        <div v-if="formulario != null">
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo2.png"
                    contain
                    position="center"
                    style="height: 80px; max-width: 250px;"
                  ></q-img>
                </div>

                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo_cosude.png"
                    contain
                    position="center"
                    style="height: 80px; max-width: 300px;"
                  ></q-img>
                </div>

                <div class="col-4">
                  <q-img
                    src="statics/imagenes-plantilla/logo_swisscontact.png"
                    contain
                    position="center"
                    style="height: 80px; max-width: 180px;"
                  ></q-img>
                </div>
              </div>
              <div class="seccion">
                <br />
                <br />

                <div class="row q-col-gutter-md">
                  <label class="titulo text-primary">
                    {{ formulario.secciones[page].titulo }}
                    <!-- ({{formulario.nota_maxima}} Puntos) -->
                  </label>
                </div>

                <div class="row q-col-gutter-md">
                  <label
                    v-html="formulario.secciones[page].descripcion"
                  ></label>
                </div>
                <br />

                <label class="pregunta">
                  Los campos con
                  <span
                    style="color: #c10015; font-size: 20px; display: inline;"
                  >
                    *
                  </span>
                  son requeridos
                </label>
                <br />
                <br />
                <br />
                <div
                  v-for="(campo, index) in formulario.secciones[page].campos"
                  :key="index"
                >
                  <div class="row q-col-gutter-lg q-pa-md">
                    <!-- texto corto -->
                    <div class="col-12 col-4-md">
                      <label
                        class="pregunta q-mb-md q-mt-md flex"
                        v-if="campoVisible(campo)"
                      >
                        {{ index + 1 + '.' }} {{ campo.texto }}
                        <!-- {{formulario.id_tipo ==5561 && Number(campo.nota)>0 ? `(${campo.nota} Puntos)`:''}} -->
                        <span
                          style="
                            color: #c10015;
                            font-size: 20px;
                            display: inline;
                          "
                        >
                          {{ campo.requerido ? '*' : '' }}
                        </span>
                      </label>

                      <q-img
                        v-if="campo.imagen && campoVisible(campo)"
                        class="imagen q-mb-md"
                        :src="campo.imagen"
                        spinner-color="white"
                        contain=""
                      />

                      <label
                        class="pregunta q-mt-md"
                        v-if="campoVisible(campo)"
                      >
                        {{ campo.subtitulo }}
                      </label>

                      <q-input
                        outlined
                        v-if="
                          campo.id_tipo === 2 &&
                          campo.tipo_input.id === 1 &&
                          campoVisible(campo)
                        "
                        v-model="campo.respuesta"
                        type="text"
                        input-style="text-transform: uppercase;"
                        :error="!campo.isValid"
                        :error-message="`Este campo es requerido`"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && campo.requerido) ||
                            !campo.requerido ||
                            'Este campo es requerido',
                        ]"
                      />
                      <!-- Texto largo -->
                      <q-input
                        v-if="
                          campo.id_tipo === 2 &&
                          campo.tipo_input.id === 2 &&
                          campoVisible(campo)
                        "
                        v-model="campo.respuesta"
                        type="textarea"
                        outlined
                        :error="!campo.isValid"
                        error-message="Este campo es requerido"
                      />

                      <!-- Numero -->
                      <q-input
                        outlined
                        v-if="
                          campo.id_tipo === 2 &&
                          campo.tipo_input.id === 3 &&
                          campoVisible(campo)
                        "
                        v-model.number="campo.respuesta"
                        type="number"
                        :error="!campo.isValid"
                        error-message="Este campo es requerido"
                      />

                      <!-- Fecha -->
                      <q-input
                        outlined
                        v-if="
                          campo.id_tipo === 2 &&
                          campo.tipo_input.id === 4 &&
                          campoVisible(campo)
                        "
                        v-model="campo.respuesta"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (isValidDate(val) &&
                              /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                            !campo.requerido ||
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
                                  (val) =>
                                    (val && val.length > 0) ||
                                    'Ingrese una fecha válida',
                                ]"
                              />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>

                      <!-- Radio buttons-->
                      <div
                        class="row q-col-gutter-md q-pa-md"
                        v-if="
                          campo.id_tipo === 1 &&
                          campo.tipo_input.id === 1 &&
                          campoVisible(campo)
                        "
                      >
                        <div class="col-12 q-col-gutter-md">
                          <q-radio
                            v-for="opcion in campo.opciones"
                            :key="opcion.id"
                            v-model="campo.respuesta"
                            :val="opcion.nombre"
                            :label="opcion.nombre"
                            :error="!campo.isValid"
                            :error-message="`Este campo es requerido`"
                          />
                        </div>
                        <label
                          style="color: #c10015; font-size: 12px;"
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
                          campo.id_tipo === 1 &&
                          campo.tipo_input.id === 3 &&
                          campoVisible(campo)
                        "
                        bg-color="white"
                        v-model="campo.respuesta"
                        :options="campo.opciones"
                        lazy-rules
                        emit-value
                        map-options
                        option-value="nombre"
                        option-label="nombre"
                        :error="!campo.isValid"
                        :error-message="`Selecciona una opción`"
                        :rules="[
                          (val) =>
                            (val && campo.requerido) ||
                            !campo.requerido ||
                            'Selecciona una opción',
                        ]"
                      />

                      <!-- Casillas de verificación -->

                      <div
                        v-if="
                          campo.id_tipo === 1 &&
                          campo.tipo_input.id === 2 &&
                          campoVisible(campo)
                        "
                      >
                        <div class="row">
                          <q-list
                            dense
                            padding
                            style="background-color: white;"
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
                                  :error="!campo.isValid"
                                  :error-message="`${campo.texto} es requerido`"
                                />
                              </q-item-section>

                              <q-item-section>
                                <q-item-label>{{ option.nombre }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>

                        <label
                          style="color: #c10015; font-size: 12px;"
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
                          campo.arregloTable.length > 0 &&
                          campoVisible(campo)
                        "
                        class="row"
                      >
                        <div class="col-12">
                          <table class="full-width bg-white">
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
                              :class="!fila.isValid? 'error': ''"
                            >
                              <span class="flex q-mt-md">{{ fila.valor }}</span>
                              <td
                                v-for="(columna, index2) in fila.columns"
                                :key="columna.id"
                                class="text-center"
                              >
                                <q-radio
                                  class="text-right"
                                  @input="
                                    setFilaCheckbox(fila, fila.columns[index2])
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
                        v-if="campo.id_tipo === 4 && campoVisible(campo)"
                        bg-color="white"
                        v-model="campo.respuesta"
                        :options="departamentos"
                        lazy-rules
                        emit-value
                        map-options
                        option-value="nombre"
                        option-label="nombre"
                        :error="!campo.isValid"
                        :error-message="`Selecciona una opción`"
                        :rules="[
                          (val) =>
                            (val && campo.requerido) ||
                            !campo.requerido ||
                            'Selecciona una opción',
                        ]"
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
                        v-if="campo.id_tipo === 5 && campoVisible(campo)"
                        bg-color="white"
                        v-model="campo.respuesta"
                        :options="municipios"
                        lazy-rules
                        emit-value
                        map-options
                        option-value="nombre"
                        option-label="nombre"
                        :error="!campo.isValid"
                        :error-message="`Selecciona una opción`"
                        :rules="[
                          (val) =>
                            (val && campo.requerido) ||
                            !campo.requerido ||
                            'Selecciona una opción',
                        ]"
                      />

                      <!-- Calificacion -->

                      <div v-if="campo.id_tipo === 6 && campoVisible(campo)">
                        <div class="row">
                          <q-rating
                            v-model="campo.respuesta"
                            size="2.5em"
                            max="10"
                            color="yellow"
                            icon="star_border"
                            icon-selected="star"
                            no-dimming
                            :error="!campo.isValid"
                            :error-message="`Selecciona una valoración`"
                            :rules="[
                              (val) =>
                                (val && val.length > 0 && campo.requerido) ||
                                !campo.requerido ||
                                'Selecciona una valoración',
                            ]"
                          >
                            <template v-slot:tip-1>
                              <q-tooltip>1</q-tooltip>
                            </template>
                            <template v-slot:tip-2>
                              <q-tooltip>2</q-tooltip>
                            </template>
                            <template v-slot:tip-3>
                              <q-tooltip>3</q-tooltip>
                            </template>
                            <template v-slot:tip-4>
                              <q-tooltip>4</q-tooltip>
                            </template>
                            <template v-slot:tip-5>
                              <q-tooltip>5</q-tooltip>
                            </template>
                            <template v-slot:tip-6>
                              <q-tooltip>6</q-tooltip>
                            </template>
                            <template v-slot:tip-7>
                              <q-tooltip>7</q-tooltip>
                            </template>
                            <template v-slot:tip-8>
                              <q-tooltip>8</q-tooltip>
                            </template>
                            <template v-slot:tip-9>
                              <q-tooltip>9</q-tooltip>
                            </template>
                            <template v-slot:tip-10>
                              <q-tooltip>10</q-tooltip>
                            </template>
                          </q-rating>
                        </div>
                        <div class="row">
                          <label
                            class="q-mt-md"
                            style="color: #c10015; font-size: 12px;"
                            v-if="
                              !campo.isValid &&
                              campo.requerido &&
                              !campo.respuesta
                            "
                          >
                            Selecciona una opción
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section class>
              <div class="row">
                <div class="col-4 col-md-2">
                  <q-btn
                    v-if="page > 0"
                    @click="prevPage"
                    label="Atrás"
                  ></q-btn>
                </div>

                <div
                  class="col-2 offset-6 col-md-2"
                  :class="
                    page > 0
                      ? 'offset-md-8 offset-xl-10'
                      : 'offset-md-8 offset-xl-10'
                  "
                >
                  <q-btn
                    color="primary"
                    v-if="page < formulario.secciones.length"
                    @click="nextPage"
                  >
                    {{
                      formulario.secciones.length - 1 === page
                        ? 'Finalizar'
                        : 'Siguiente'
                    }}
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div v-else>La vista previa no ha podido ser generada</div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios'
// import Vue from 'vue'
import moment from 'moment'
export default {
  data() {
    return {
      formulario: null,
      nombre: 'Nombre del Formulario',
      titulo: 'Titulo',
      descripcion: 'Descripcion',
      page: 0,
      departamentos: [],
      municipios: [],
      loadingDepartamentos: false,
      loadingMunicipios: false,
      reglas: [],
      reglasTabla: [],
      campos_excluidos: [],
      seccionesVisibles: [],
    }
  },
  async created() {
    await this.CargarDatosFormulario()
    await this.CargarDepartamentos('', false)
    let campo_municipio = this.obtenerCampoMunicipio()
    console.log("campo_municipio:",campo_municipio)
    if(campo_municipio){
      await this.CargarMunicipios(null,null,campo_municipio,false)
    }

  },
  methods: {
    obtenerCampoMunicipio(){
      //regresamos el primer campo de municipio disponible
      return this.formulario.secciones[this.page].campos.filter(campo => campo.id_tipo === 5)[0]

    },
    campoVisible(campo) {
      let visible = true

      this.campos_excluidos.forEach((c) => {
        if (c.id === campo.id) {
          visible = false
        }
      })

      return visible
    },
    excluirSeccion(seccion_excluida) {
      this.seccionesVisibles = this.formulario.secciones.filter(
        (i) => i.id !== seccion_excluida,
      )
    },
    excluirCampo(seccion_excluida, campo_excluido) {
      for (
        let index_seccion = 0;
        index_seccion < this.formulario.secciones.length;
        index_seccion++
      ) {
        const seccion = this.formulario.secciones[index_seccion]

        let campos = seccion.campos
        for (let index = 0; index < campos.length; index++) {
          const campo = campos[index]

          if (campo.id === campo_excluido) {
            this.campos_excluidos.push(campo)
            // for (let i = 0; i < this.seccionesVisibles.length; i++) {
            //   const seccion = this.seccionesVisibles[i]
            //   this.seccionesVisibles[i].campos.pop(campo)
            // }
          }
        }
      }
    },
    validarSeccionesVisibles() {
      //resetiamos las secciones visibles con los valores originales
      this.seccionesVisibles = this.formulario.secciones
      this.campos_excluidos = []
      //si no hay reglas todo queda igual
      if (this.reglas.length === 0) {
        console.log('se salió')
        return
      }

      //evaluamos todas las secciones
      for (
        let index_section = 0;
        index_section < this.formulario.secciones.length;
        index_section++
      ) {
        let current_seccion = this.formulario.secciones[index_section]
        let campos = current_seccion.campos

        //evaluamos todos los campos de la seccion
        for (let index = 0; index < campos.length; index++) {
          const campo = campos[index]

          for (
            let index_campo = 0;
            index_campo < this.reglas.length;
            index_campo++
          ) {
            //para cada regla
            const regla = this.reglas[index_campo]
            const regla_tabla = this.reglasTabla[index_campo]

            if (campo.id === regla.campo_excluyente) {
              //evaluamos el campo excluyente

              const operacion = regla.operacion
              const respuesta_excluyente = regla_tabla.respuesta_excluyente

              switch (operacion) {
                case '=':
                  if (campo.id_tipo === 1 || campo.id_tipo === 2) {
                    if (campo.respuesta === respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion === true) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                        )
                      }
                    }

                    if (campo.id_tipo === 2 && campo.tipo_input.id === 4) {
                      if (
                        moment(campo.respuesta, 'DD/MM/YYYY', true).isSame(
                          moment(respuesta_excluyente, 'DD/MM/YYYY', true),
                        )
                      ) {
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion === true) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                          )
                        }
                      }
                    }
                  }

                  break
                case '<':
                  if (campo.id_tipo === 1 || campo.id_tipo === 2) {
                    if (campo.respuesta < respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                        )
                      }
                    }

                    if (campo.id_tipo === 2 && campo.tipo_input.id === 4) {
                      let campo_fecha = moment(
                        campo.respuesta,
                        'DD/MM/YYYY',
                        true,
                      )
                      let respuesta_fecha = moment(
                        respuesta_excluyente,
                        'DD/MM/YYYY',
                        true,
                      )
                      if (campo_fecha.isSameOrBefore(respuesta_fecha)) {
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion === true) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                          )
                        }
                      }
                    }
                  }
                  break

                case '>':
                  if (campo.id_tipo === 1 || campo.id_tipo === 2) {
                    if (campo.respuesta > respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion === true) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                        )
                      }
                    }

                    if (campo.id_tipo === 2 && campo.tipo_input.id === 4) {
                      let campo_fecha = moment(
                        campo.respuesta,
                        'DD/MM/YYYY',
                        true,
                      )
                      let respuesta_fecha = moment(
                        respuesta_excluyente,
                        'DD/MM/YYYY',
                        true,
                      )
                      if (campo_fecha.isSameOrAfter(respuesta_fecha)) {
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion === true) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                          )
                        }
                      }
                    }
                  }
                  break

                case '!==':
                  if (campo.id_tipo === 1 || campo.id_tipo === 2) {
                    if (campo.respuesta !== respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                        )
                      }
                    }

                    if (campo.id_tipo === 2 && campo.tipo_input.id === 4) {
                      if (
                        moment(campo.respuesta, 'DD/MM/YYYY', true) !==
                        moment(respuesta_excluyente, 'DD/MM/YYYY', true)
                      ) {
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                          )
                        }
                      }
                    }
                  }
                  break

                default:
                  console.log("entó al default'")
                  break
              }
            }
          }
        }
      }
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

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },
    CargarMunicipios(
      campo,
      departamento,
      campoMunicipio,
      resetearValor = false,
      filtro = '',
    ) {
      this.loadingMunicipios = true
      var url = process.env.API_URL + '/catalogos/municipios'

      if (campoMunicipio && campoMunicipio.FiltrarXDepartamento === false) {
        url = process.env.API_URL + '/catalogos/TodosMunicipios'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      if (resetearValor) {
        campoMunicipio.respuesta = null
      }

      console.log({ departamento })

      var params = {
        filtro: filtro,
        id_padre:
          departamento && departamento !== null
            ? this.departamentos.filter((i) => i.nombre === departamento)[0].id
            : '',
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          this.municipios = response.data.municipios
          this.loadingMunicipios = false
        })
        .catch((error) => {
          this.loadingMunicipios = false

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    setFilaCheckbox(fila, columna) {
      fila.columns.forEach((col, index, arr) => {
        if (col.id !== columna.id) {
          this.$set(col, 'checked', false)
        }
      })

      this.$forceUpdate()
    },

    shuffle(array) {
      var currentIndex = array.length
      var temporaryValue
      var randomIndex

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        if (temporaryValue.id_tipo === 4 || temporaryValue.id_tipo === 5)
          continue
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    },
    validateForm() {
      console.log("entró a ValidateForm")
      let actualPage = this.formulario.secciones[this.page]
      actualPage.campos.forEach((campo, index, arr) => {
        if (campo.requerido && !campo.respuesta && campo.id_tipo !==3) {
          campo.isValid = false
        } else {
          if (campo.id_tipo === 2 && campo.tipo_input.id === 4) {
            if (
              campo &&
              this.isValidDate(campo.respuesta) &&
              /\d{1,2}\/\d{1,2}\/\d{4}/.test(campo.respuesta)
            ) {
              campo.isValid = true
            } else {
              campo.isValid = false
            }
          } else if (campo.id_tipo === 3) {
            let filasValidas = 0
            campo.arregloTable.forEach((row) => {
              if (row.columns.filter((item) => item.checked).length > 0) {
                filasValidas += 1
                row.isValid = true
              }else{
                row.isValid = false

              }
            })

            if (filasValidas === campo.arregloTable.length) {
              campo.isValid = true
              this.formulario.secciones.forEach((seccion) => {
                seccion.campos.forEach((field, index, arr) => {
                  if (field.id === campo.id) {
                    field.isValid = true
                    campo.isValid = true
                  }
                })
              })
            }else{
              campo.isValid = false
            }


          } else {
            campo.isValid = true
          }
        }

        // validamos que para casillas de selecion multiple
        if (campo.id_tipo === 1 && campo.tipo_input.id === 2) {
          campo.isValid =
            (campo.requerido &&
              campo.opciones.filter((opcion) => opcion.respuesta).length > 0) ||
            !campo.requerido
        }
      })

      let campos_excluidos_ids = this.campos_excluidos.map((i) => i.id)

      return (
        actualPage.campos.filter(
          (item) => item.isValid && !campos_excluidos_ids.includes(item.id),
        ).length ===
        actualPage.campos.filter(
          (item) => !campos_excluidos_ids.includes(item.id),
        ).length
      )
    },

    getPreviousSection() {
      if (this.page === 0) {
        return 0
      } else {
        let indice = 0
        if (
          this.formulario.secciones.lenght !== this.seccionesVisibles.length
        ) {
          let id_seccion = this.formulario.secciones[this.page].id
          this.seccionesVisibles.forEach((s, index) => {
            if (s.id === id_seccion) {
              indice = index - 1
            }
          })

          console.log('prev page index', indice)

          return indice
        }

        //si llega aqui es poque son iguales (no hay exclusion se comporta normal)
        return this.page - 1
      }
    },

    getNextSection() {
      if (this.page >= this.formulario.secciones.length - 1) {
        return this.page
      } else {
        let indice = this.page
        if (
          this.formulario.secciones.lenght !== this.seccionesVisibles.length
        ) {
          let id_seccion_visible = this.seccionesVisibles[this.page + 1].id
          this.formulario.secciones.forEach((s, index) => {
            if (s.id === id_seccion_visible) {
              indice = index
            }
          })

          console.log('next page index', indice)

          return indice
        }

        //si llega aqui es poque son iguales (no hay exclusion se comporta normal)
        return this.page + 1
      }
    },

    prevPage() {
      let prev = this.getPreviousSection()
      this.page = prev
    },
    nextPage(validate_form = true) {
      if (validate_form && !this.validateForm()) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'Por favor complete todos los campos',
        })
        return
      }

      // validar si es finalizar : onsubmit
      if (this.page >= this.formulario.secciones.length - 1) {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fas fa-check-circle',
          message: `¡Llegaste al final de la vista previa!`,
          position: 'bottom',
          timeout: 2000,
        })
        return
      }

      this.page = this.getNextSection()
      this.formulario.secciones[this.page].campos.forEach(
        (campo, index, array) => {
          this.$set(campo, 'isValid', true)
        },
      )
      window.scrollTo({ left: 0, top: 80, behavior: 'smooth' })
    },
    showDatePopUp(ref) {
      this.$refs[ref][0].show() // <= accessing the dynamic ref to show the popup
    },
    hideDatePopUp(ref) {
      this.$refs[ref][0].hide() // <= accessing the dynamic ref to hide the popup
    },
    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY', true).isValid()
    },
    CargarDatosFormulario() {
      let form = JSON.parse(
        localStorage.getItem('formulario_vista_previa') || null,
      )
      let formulario =null
      if (form) {

        formulario = form.formulario
        this.nombre = form.nombre
        this.confirm = false
        this.inicializado = true
        this.reglas = form.reglas
        this.reglasTabla = form.reglasTabla
      }

      // Validaciones iniciales para los campos
      for (let keySeccion in formulario.secciones) {
        let campos = formulario.secciones[keySeccion].campos
        for (let keyCampo in campos) {
          let campo = campos[keyCampo]
          // multiple
          if (campo.id_tipo === 1 && campo.tipo_input.id === 2) {
            campo.opciones.forEach((opcion, index2, arr) => {
              opcion.respuesta = false
            })
          }
          if (campo.id_tipo === 2 && campo.tipo_input.id === 4) {
            campo.respuesta = moment().format('DD/MM/YYYY')
          }

          if (campo.id_tipo === 1 && campo.tipo_input.id === 1) {
            campo.respuesta = false
          }

          if (campo.id_tipo === 2 && campo.tipo_input.id === 3) {
            campo.respuesta = null
          }

          if (campo.id_tipo === 1 && campo.tipo_input.id === 2) {
            campo.respuesta = false
          }

          if (campo.id_tipo === 6) {
            campo.respuesta = 0
          }

          campo.isValid = true
        }
      }

      if (
        formulario.id_tipo === 5561 &&
        formulario.ordenar_aleatoriamente === true
      ) {
        formulario.secciones.forEach((seccion) => {
          seccion.campos = this.shuffle(seccion.campos)
          seccion.campos.forEach((campo) => {
            campo.opciones = this.shuffle(campo.opciones)
          })
        })
      }

      this.formulario = JSON.parse(JSON.stringify(formulario))
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
  watch: {
    formulario: {
      handler(val) {
        this.validarSeccionesVisibles()
      },
      deep: true,
    },
    page: function () {
      this.validarSeccionesVisibles()
    },
  },
}
</script>

<style>
.titulo {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.pregunta {
  font-weight: bold;
}

.q-field__label {
  font-weight: bold;
}

.error {
  color: red;
}
</style>
