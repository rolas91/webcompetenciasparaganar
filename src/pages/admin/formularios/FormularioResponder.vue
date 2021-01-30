<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-grey-2">
      <q-page id="responder-formulario" class="q-pa-md pagina">
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

        <q-card
          v-if="
            (formulario && formulario.id_modo == 5605) ||
            (!iniciado && !correoVerificado && !finalizado)
          "
        >
          <q-card-section v-if="formulario && formulario.id_modo != 5605">
            <q-form id="formularioValidacion" @submit="validarUsuario">
              <h5>
                Por favor ingresa tus datos para poder continuar con el
                formulario
              </h5>
              <div
                v-if="formulario && formulario.id_modo == 5603"
                class="row q-col-gutter-md"
              >
                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    v-model="tipo_identidad"
                    label="Modo Autenticación"
                    :options="tipos_identidad"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Éste campo es requerido',
                    ]"
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
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    type="text"
                    :label="tipo_identidad"
                    v-model="doc_identidad"
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length) || 'Éste campo es requerido',
                    ]"
                  ></q-input>
                </div>
              </div>

              <div
                v-if="formulario && formulario.id_modo == 5603"
                class="row q-col-gutter-md"
              >
                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    v-model="id_centro"
                    label="Centro de estudio"
                    :options="centros"
                    :loading="loadingCentros"
                    option-value="id"
                    option-label="nombre"
                    emit-value
                    map-options
                    @input="CargarCursos"
                    lazy-rules
                    :rules="[(val) => val || 'Éste campo es requerido']"
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

                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    v-model="id_curso"
                    label="Seleccione el curso"
                    :options="cursos"
                    :loading="loadingCursos"
                    option-value="id"
                    option-label="nombre"
                    emit-value
                    map-options
                    lazy-rules
                    :rules="[(val) => val || 'Éste campo es requerido']"
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
              <!-- Formularios Abiertos -->
              <div v-if="formulario && formulario.id_modo == 5604">
                <div class="row q-pa-sm q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      outlined=""
                      v-model="formulario.nombre_participante"
                      label="Nombre completo"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'Ingresa tu nombre completo',
                      ]"
                    ></q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      outlined=""
                      v-model="formulario.correo_participante"
                      label="correo electrónico"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && emailRegex.test(val)) ||
                          'Ingresa un correo electrónico válido',
                      ]"
                    ></q-input>
                  </div>
                </div>
              </div>
              <br />
              <div class="row" v-if="formulario && formulario.id_modo != 5605">
                <div class="col-12">
                  <q-btn type="submit" color="primary" class>Siguiente</q-btn>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        <q-card v-if="!iniciado && correoVerificado">
          <q-card-section>
            <div class="row">
              <div
                class="col-12"
                style="display: flex; justify-content: center;"
              >
                <h5>
                  Bienvenido
                  <span style="color: #027be3;">
                    {{
                      formulario.id_modo == 5603
                        ? formulario.participante.nombre
                        : formulario.id_modo == 5604
                        ? formulario.nombre_participante
                        : ''
                    }}
                    !!
                  </span>
                </h5>
              </div>
              <div
                class="col-12"
                style="display: flex; justify-content: center;"
              >
                <h5>
                  Presiona el boton iniciar para comenzar a rellenar este
                  formulario
                </h5>
              </div>
            </div>
            <div class="row">
              <div
                class="col-12"
                style="display: flex; justify-content: center;"
              >
                <q-btn
                  color="primary"
                  class="centered"
                  @click="iniciarFormulario"
                >
                  Iniciar
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div v-if="formulario != null && iniciado && !finalizado">
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

                <div
                  v-if="formulario.duracion > 0"
                  id="timer"
                  style="margin-bottom: 20px;"
                >
                  <q-icon name="far fa-clock" />
                  Tiempo restante {{ minutos }} Minutos :
                  {{ segundos }} Segundos
                </div>

                <div class="row q-col-gutter-md">
                  <label class="titulo text-primary">
                    {{ formulario.secciones[page].titulo }}
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
                    <div class="col-12">
                      <label
                        class="pregunta q-mb-md q-mt-md flex"
                        v-if="campoVisible(campo)"
                      >
                        {{ index + 1 + '.' }} {{ campo.texto }}
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
                        contain
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
                          campo.id_tipo == 2 &&
                          campo.tipo_input.id == 1 &&
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
                            !val ||
                            (val && campo.requerido) ||
                            !campo.requerido ||
                            'Este campo es requerido',
                        ]"
                      />
                      <!-- Texto largo -->
                      <q-input
                        v-if="
                          campo.id_tipo == 2 &&
                          campo.tipo_input.id == 2 &&
                          campoVisible(campo)
                        "
                        v-model="campo.respuesta"
                        type="textarea"
                        outlined
                        :error="!campo.isValid"
                        error-message="Este campo es requerido"
                        lazy-rules
                        :rules="[
                          (val) =>
                            !val ||
                            (val && campo.requerido) ||
                            !campo.requerido ||
                            'Este campo es requerido',
                        ]"
                      />

                      <!-- Numero -->
                      <q-input
                        outlined
                        v-if="
                          campo.id_tipo == 2 &&
                          campo.tipo_input.id == 3 &&
                          campoVisible(campo)
                        "
                        v-model.number="campo.respuesta"
                        type="number"
                        :error="!campo.isValid"
                        error-message="Ingrese un valor válido para el campo"
                        lazy-rules
                        :rules="[
                          (val) =>
                            !val ||
                            (val &&
                              campo.requerido &&
                              validarMinimosYMaximos(campo, val)) ||
                            !campo.requerido ||
                            'Ingrese un valor válido para el campo',
                        ]"
                      />

                      <!-- Fecha -->
                      <q-input
                        outlined
                        v-if="
                          campo.id_tipo == 2 &&
                          campo.tipo_input.id == 4 &&
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

                      <!-- Radio buttons o Seleccion multiple -->
                      <div
                        class="row q-col-gutter-md q-pa-md"
                        v-if="
                          campo.id_tipo == 1 &&
                          campo.tipo_input.id == 1 &&
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
                          campo.id_tipo == 1 &&
                          campo.tipo_input.id == 3 &&
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
                          campo.id_tipo == 1 &&
                          campo.tipo_input.id == 2 &&
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
                                  :true-value="option.nombre"
                                  :false-value="false"
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
                          campo.id_tipo == 3 &&
                          campo.arregloTable &&
                          campo.arregloTable.length > 0 &&
                          campoVisible(campo)
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
                            style="color: #c10015; font-size: 12px;"
                            v-if="!campo.isValid && campo.requerido"
                          >
                            Selecciona una opción para todas las filas
                          </label>
                        </div>
                      </div>

                      <!-- Departamento -->
                      <q-select
                        outlined=""
                        v-if="campo.id_tipo == 4 && campoVisible(campo)"
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
                        outlined=""
                        v-if="campo.id_tipo == 5"
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

                      <div v-if="campo.id_tipo == 6 && campoVisible(campo)">
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
              <div
                class="row"
                style="padding-right: 7.5px; padding-left: 7.5px;"
              >
                <q-btn class="col-4 col-md-1" v-if="page > 0" @click="prevPage">
                  Atrás
                </q-btn>
                <q-btn
                  class="col-4 offset-4 col-md-2"
                  :class="page > 0 ? 'offset-md-9' : 'offset-md-10'"
                  color="primary"
                  v-if="page < formulario.secciones.length"
                  @click="nextPage"
                >
                  {{
                    formulario.secciones.length - 1 == page
                      ? 'Finalizar'
                      : 'Siguiente'
                  }}
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div v-else-if="finalizado">
          <q-card>
            <q-card-section>
              <div class="row" style="display: flex; justify-content: center;">
                <div
                  class="col-12 col-md-2"
                  style="
                    display: flex;
                    justify-content: center;
                    margin-bottom: 100px;
                  "
                >
                  <q-img
                    src="statics/imagenes-plantilla/logo2.png"
                    cover
                    position="center"
                    style="
                      height: 80px;
                      max-width: 250px;
                      display: flex;
                      justify-content: center;
                    "
                  ></q-img>
                </div>

                <div class="row">
                  <div
                    class="col-12 col-md-10"
                    style="
                      display: flex;
                      justify-content: center;
                      margin: auto;
                      margin-bottom: 100px;
                    "
                  >
                    <label
                      style="
                        color: #00b0bd;
                        font-size: 35px;
                        text-align: center;
                      "
                    >
                      GRACIAS POR COMPLETAR ESTE FORMULARIO!!
                    </label>
                  </div>
                </div>
              </div>
              <div class="row" style="display: flex; justify-content: center;">
                <q-btn
                  icon="chevron_left"
                  @click="$router.replace('/admin/formularios')"
                >
                  Regresar
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <q-dialog v-model="modalOpen">
          <q-card style="width: 1024px; max-width: 80vw;">
            <q-card-section class="bg-primary text-white q-gutter-sm">
              <h5>Seleccionar Participante</h5>
            </q-card-section>
            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-option-group
                    :options="multiples_coincidencias"
                    label="Participantes"
                    type="radio"
                    v-model="participante"
                  />
                </div>
              </div>

              <q-card-actions class="row justify-between q-gutter-sm">
                <q-btn right icon="close" v-close-popup>Cancelar</q-btn>
                <q-btn
                  :loading="loading"
                  :disable="loading"
                  right
                  class="bg-primary text-white"
                  icon="save"
                  @click="seleccionarParticipante"
                >
                  Seleccionar
                </q-btn>
              </q-card-actions>
            </q-card-section>
            <!-- <q-separator></q-separator> -->
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
// import axios from 'axios'
import moment from 'moment'
import axios from 'axios'
import { getRepository } from 'typeorm'

export default {
  data() {
    return {
      cantRespuestas: 0,
      confirm: false,
      loading: false,
      timer: 0,
      interval: null,
      segundos: 0,
      minutos: 0,
      slug_respuesta: null,
      participante: null,
      modalOpen: false,
      multiples_coincidencias: [],
      formulario: null,
      reglas: [],
      reglasTabla: [],
      campos_excluidos: [],
      nombre: 'Nombre del Formulario',
      page: 0,
      iniciado: false,
      doc_identidad: null,
      tipo_identidad: null,
      fecha_inicio: null,
      correoVerificado: false,
      nombreUsuario: null,
      finalizado: false,
      municipios: [],
      departamentos: [],
      seccionesVisibles: [],
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      loadingCentros: false,
      loadingCursos: false,
      centros: [],
      cursos: [],
      tipos_identidad: [
        { label: 'Cédula', value: 'documento_identidad' },
        { label: 'Correo', value: 'correo' },
        { label: 'Teléfono', value: 'telefono' },
      ],
      id_curso: null,
      id_centro: null,
      ratingColors: [
        'light-green-1',
        'light-green-2',
        'light-green-3',
        'light-green-4',
        'light-green-5',
        'light-green-6',
        'light-green-7',
        'light-green-8',
        'green-9',
        'green-10',
      ],
    }
  },
  created() {
    if (this.$route.params.slug) {
      this.CargarDatosFormulario()
      if (!this.$store.getters.online && this.$q.platform.is.mobile) {
        ;(async () => {
          try {
            let centroRepository = getRepository('Centro')
            let centros = await centroRepository.find()
            this.centros = centros
          } catch (error) {}
        })()
      } else {
        this.CargarCentros()
        this.CargarCursos()
      }
      this.CargarDepartamentos('', false)
    }
  },
  methods: {
    campoVisible(campo) {
      let visible = true

      this.campos_excluidos.forEach((c) => {
        if (c.id == campo.id) {
          visible = false
        }
      })

      return visible
    },
    excluirSeccion(seccion_excluida) {
      this.seccionesVisibles = this.formulario.secciones.filter(
        (i) => i.id != seccion_excluida,
      )
    },
    excluirCampo(seccion_excluida, campo_excluido, descripcion = '') {
      console.log(descripcion)
      for (
        let index_seccion = 0;
        index_seccion < this.formulario.secciones.length;
        index_seccion++
      ) {
        const seccion = this.formulario.secciones[index_seccion]

        let campos = seccion.campos
        for (let index = 0; index < campos.length; index++) {
          const campo = campos[index]

          if (campo.id == campo_excluido) {
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
      if (this.reglas.length == 0) {
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

            if (campo.id == regla.campo_excluyente) {
              //evaluamos el campo excluyente

              const operacion = regla.operacion
              const respuesta_excluyente = regla_tabla.respuesta_excluyente

              switch (operacion) {
                case '=':
                  if (campo.id_tipo == 1 || campo.id_tipo == 2) {
                    if (campo.respuesta == respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion == true) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                          'operacion = campo.id_tipo 1 o 2',
                        )
                      }
                    }

                    if (campo.id_tipo == 2 && campo.tipo_input.id == 4) {
                      if (
                        moment(campo.respuesta, 'DD/MM/YYYY', true).isSame(
                          moment(respuesta_excluyente, 'DD/MM/YYYY', true),
                        )
                      ) {
                        //son iguales las fechas
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion == true) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                            'operacion = campo tipo fecha',
                          )
                        }
                      }
                    }
                  }

                  break
                case '<':
                  if (campo.id_tipo == 1 || campo.id_tipo == 2) {
                    if (campo.respuesta < respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                          'operacion < campo.id_tipo 1 o 2',
                        )
                      }
                    }

                    if (campo.id_tipo == 2 && campo.tipo_input.id == 4) {
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
                      console.log(
                        'fecha campo.respuesta:',
                        campo_fecha,
                        ' fecha_respuesta_excluyente:',
                        respuesta_fecha,
                      )
                      if (campo_fecha.isSameOrBefore(respuesta_fecha)) {
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion == true) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                            'operacion < campo tipo fecha',
                          )
                        }
                      }
                    }
                  }
                  break

                case '>':
                  if (campo.id_tipo == 1 || campo.id_tipo == 2) {
                    if (campo.respuesta > respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion == true) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                          'operacion > campo.id_tipo 1 o 2',
                        )
                      }
                    }

                    if (campo.id_tipo == 2 && campo.tipo_input.id == 4) {
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
                      console.log(
                        'fecha campo.respuesta:',
                        campo_fecha,
                        ' fecha_respuesta_excluyente:',
                        respuesta_fecha,
                        ' cumple con la condicion >',
                        campo_fecha.isSameOrAfter(respuesta_fecha),
                      )
                      if (campo_fecha.isSameOrAfter(respuesta_fecha)) {
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion == true) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                            'operacion > campo tipo  fecha',
                          )
                        }
                      }
                    }
                  }
                  break

                case '!=':
                  if (campo.id_tipo == 1 || campo.id_tipo == 2) {
                    if (campo.respuesta != respuesta_excluyente) {
                      //se cumple la exclusión
                      if (regla.excluir_full_seccion) {
                        this.excluirSeccion(regla.seccion_excluida)
                      } else {
                        this.excluirCampo(
                          regla.seccion_excluida,
                          regla.campo_excluido,
                          'operacion != campo.id_tipo 1 o 2',
                        )
                      }
                    }

                    if (campo.id_tipo == 2 && campo.tipo_input.id == 4) {
                      if (
                        moment(campo.respuesta, 'DD/MM/YYYY', true) !=
                        moment(respuesta_excluyente, 'DD/MM/YYYY', true)
                      ) {
                        //se cumple la exclusión
                        if (regla.excluir_full_seccion) {
                          this.excluirSeccion(regla.seccion_excluida)
                        } else {
                          this.excluirCampo(
                            regla.seccion_excluida,
                            regla.campo_excluido,
                            'operacion != campo tipo fecha',
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

    stopTimer() {
      clearInterval(this.interval)
    },

    regresar() {
      this.$router.push({ name: 'formularios' })
    },

    validarMinimosYMaximos(campo, val) {
      // Si no estan seteados omitimos la validacion
      if (!campo.minimo || !campo.maximo) {
        return true
      }

      return (
        Number(val) >= Number(campo.minimo) &&
        Number(val) <= Number(campo.maximo)
      )
    },

    CargarDepartamentos() {
      this.loadingDepartamentos = true
      if (this.$store.getters.online == true) {
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
            console.log({ error })
          })
      } else {
        const repoDeps = getRepository('Departamento')
        repoDeps
          .find()
          .then((departamentos) => {
            this.departamentos = departamentos
            this.loadingDepartamentos = false
          })
          .catch((error) => {
            this.loadingDepartamentos = false
          })
      }
    },
    CargarMunicipios(
      campo,
      departamento,
      campoMunicipio,
      resetearValor = false,
      filtro = '',
    ) {
      if (departamento != null && this.$store.getters.online == false) {
        if (resetearValor) {
          campoMunicipio.respuesta = null
        }
        let dep = this.departamentos.filter((i) => i.nombre == departamento)[0]
        const munRepo = getRepository('Municipio')
        munRepo.find({ departamento: dep }).then((municipios) => {
          this.municipios = municipios
        })
        return
      }
      this.loadingMunicipios = true
      var url = process.env.API_URL + '/catalogos/municipios'

      if (campo.FiltrarXDepartamento == false) {
        url = process.env.API_URL + '/catalogos/TodosMunicipios'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      if (resetearValor) {
        campoMunicipio.respuesta = null
      }

      var params = {
        filtro: filtro,
        id_padre:
          departamento != null
            ? this.departamentos.filter((i) => i.nombre == departamento)[0].id
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
          console.log({ error })
        })
    },

    saveToLocalStorage(itemName, val) {
      window.clearTimeout(this.timer)

      this.timer = window.setTimeout(function () {
        localStorage.setItem(itemName, JSON.stringify(val))
        // if (this.finalizado == false) {
        //   localStorage.setItem(itemName, JSON.stringify(val))
        // }
      }, 500)
    },

    setFilaCheckbox(campo, fila, columna) {
      fila.columns.forEach((col, index, arr) => {
        if (col.id != columna.id) {
          this.$set(col, 'checked', false)
        }
      })

      let totalRows = campo.arregloTable.length
      let validRows = 0

      campo.arregloTable.forEach((row) => {
        if (row.columns.filter((c) => c.checked).length > 0) {
          validRows += 1
        }
      })

      let AllRowsValid = validRows == totalRows

      campo.respuesta = campo.arregloTable
      campo.isValid = AllRowsValid

      this.$forceUpdate()
    },

    validarUsuario() {
      if (this.formulario.id_modo == 5603) {
        this.validarCorreo(false)
        return
      }

      // si pasa a este punto es porque es Abierto o Anonimo
      this.correoVerificado = true
    },
    seleccionarParticipante() {
      this.modalOpen = false
      this.correoVerificado = true
      this.formulario.participante = {
        nombre: this.multiples_coincidencias.filter(
          (i) => i.value == this.participante,
        )[0].label,
        id_participante: this.participante,
      }
    },
    CargarCentros(filtro = '') {
      var url = process.env.API_URL + '/catalogos/centros_cursos'
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
          this.centros = response.data.centros
        })
        .catch((error) => {
          console.log({ error })
        })
    },

    CargarCursos(resetearIdCurso) {
      if (!this.id_centro) {
        return
      }
      this.loadingCursos = true
      if (!this.$store.getters.online && this.$q.platform.is.mobile) {
        let centroRepository = getRepository('Centro')
        centroRepository
          .findOne(this.id_centro, { relations: ['cursos'] })
          .then((centro) => {
            this.cursos = centro.cursos
            this.loadingCursos = false
            // Esta asignacion indica que cuando está offline
            // this.formulario is undefined
            this.formulario.id_curso = null
            this.id_curso = null
          })
          .catch((error) => {
            console.error('Error finding centro', error)
            this.cursos = null
            this.loadingCursos = false
            // Esta asignacion indica que cuando está offline
            // this.formulario is undefined
            this.formulario.id_curso = null
            this.id_curso = null
          })
      } else {
        var url = process.env.API_URL + '/catalogos/cursos'

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }

        var params = {
          id_centro: this.id_centro,
        }
        axios({
          method: 'get',
          url: url,
          params: params,
          headers: headers,
        })
          .then((response) => {
            this.cursos = response.data.cursos
            this.loadingCursos = false
            this.formulario.id_curso = null
          })
          .catch((error) => {
            this.loadingCursos = false
            console.log({ error })
          })
      }
    },

    iniciarFormulario() {
      this.iniciado = true
      for (let index = 0; index < this.formulario.secciones.length; index++) {
        const element = this.formulario.secciones[index]
        const campo = element.campos
      }

      this.loading = true
      var method = 'post'

      this.fecha_inicio = moment()
      this.iniciarTimer()
    },
    iniciarTimer() {
      this.interval = setInterval(() => {
        this.actualizarReloj()
      }, 1000)
    },

    actualizarReloj() {
      var delta = moment.duration(moment().diff(this.fecha_inicio))

      this.minutos = Number(
        (
          Number(this.formulario.duracion) -
          Math.floor(delta.asSeconds() / 60).toFixed(0) -
          1
        ).toFixed(0),
      )

      this.formulario.duracion = Number(this.formulario.duracion)

      this.minutos = (
        Number(this.formulario.duracion) -
        Math.floor(delta.asSeconds() / 60).toFixed(0) -
        1
      ).toFixed(0)

      if (this.minutos == 0) {
        this.stopTimer()
      }

      this.segundos =
        60 - Number(Number(delta.asSeconds() % 60).toFixed(0)) == 0
          ? 1
          : 60 - Number(delta.asSeconds() % 60).toFixed(0)

      this.$forceUpdate()

      if (this.formulario.duracion > 0 && this.minutos == 0) {
        this.stopTimer()
        this.finalizarFormulario()
        this.segundos = 0
      }
    },
    finalizarFormulario() {
      this.page = this.formulario.secciones.length - 1
      this.nextPage(false)
    },
    validarCorreo(mostrarMultiples = true) {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/verificar_identidad/formulario'
      if (this.$store.getters.online) {
        axios({
          method: method,
          url: url,

          data: {
            slug: this.$route.params.slug,
            tipo_identidad: this.tipo_identidad,
            doc_identidad: this.doc_identidad,
            id_centro: this.id_centro,
            id_curso: this.id_curso,
            id_participante: this.formulario.participante
              ? this.formulario.participante.id_participante
              : null,
            mostrar_multiples: mostrarMultiples,
            nombre_participante: this.formulario.nombre_participante,
            correo_participante: this.formulario.correo_participante,
          },
        })
          .then((response) => {
            this.loading = false
            if (response.data.result) {
              this.correoVerificado = true
              this.formulario.participante = response.data.participante
            }

            if (!response.data.result && response.data.code == 'completado') {
              this.iniciado = true
              this.finalizado = true
              setTimeout(() => {
                localStorage.removeItem(
                  `formulario_respuestas_${this.$route.params.slug}`,
                )
              }, 500)

              return
            }

            if (
              !response.data.result &&
              response.data.code == 'multiples_coincidencias' &&
              mostrarMultiples
            ) {
              this.modalOpen = true
              this.multiples_coincidencias =
                response.data.multiples_coincidencias

              return
            }

            if (!response.data.result && response.data.code == 'no_matricula') {
              this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'fas fa-exclamation-triangle',
                message: response.data.message,
              })
            }

            if (mostrarMultiples == false) {
              return
            }

            if (response.data.result) {
              return
            }

            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: response.data.message,
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
          })
      } else {
        let matriculasRepo = getRepository('Matriculas')
        //  tipo_identidad: this.tipo_identidad,
        //  doc_identidad: this.doc_identidad,
        //  id_centro: this.id_centro,
        //  id_curso: this.id_curso
        // tipos_identidad: [
        //   { label: "Cédula", value: "documento_identidad" },
        //   { label: "Correo", value: "correo" },
        //   { label: "Teléfono", value: "telefono" }
        // ];
        let query = { id_curso: this.id_curso }
        switch (this.tipo_identidad) {
          case 'documento_identidad':
            query.documento_identidad = this.doc_identidad
            break
          case 'correo':
            query.correo = this.doc_identidad
            break
          case 'telefono':
            query.telefono = this.doc_identidad
            break
          default:
            break
        }
        matriculasRepo
          .find(query)
          .then((matriculas) => {
            if (matriculas.length < 1) {
              this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'fas fa-exclamation-triangle',
                message: 'Estudiante no encontrado en el curso seleccionado',
              })
            } else {
              if (matriculas.length > 1) {
                let multiplesOpciones = []
                for (let index = 0; index < matriculas.length; index++) {
                  const element = matriculas[index]
                  multiplesOpciones.push({
                    label: element.nombre,
                    value: element.id_participante,
                  })
                }

                // Multiples coincidencias
                this.multiples_coincidencias = multiplesOpciones
                this.modalOpen = true
                this.loading = false
              } else {
                this.correoVerificado = true
                let m = matriculas[0]

                this.formulario.participante = {
                  nombre: m.nombre,
                  id_participante: m.id_participante + '',
                }
              }
            }
          })
          .catch((error) => {
            console.error('Error fetching matriculas', error)
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: 'Estudiante no encontrado en el curso seleccionado',
            })
          })
      }
    },
    validateForm() {
      let actualPage = this.formulario.secciones[this.page]
      actualPage.campos.forEach((campo, index, arr) => {
        if (campo.requerido && !campo.respuesta && campo.id_tipo !==3) {
          campo.isValid = false
        } else {
          if (campo.id_tipo == 2 && campo.tipo_input.id == 4) {
            if (
              campo &&
              this.isValidDate(campo.respuesta) &&
              /\d{1,2}\/\d{1,2}\/\d{4}/.test(campo.respuesta)
            ) {
              campo.isValid = true
            } else {
              campo.isValid = false
            }
          } else if (campo.id_tipo == 3) {
            let filasValidas = 0
            campo.arregloTable.forEach((row) => {
              if (row.columns.filter((item) => item.checked).length > 0) {
                filasValidas += 1
                row.isValid = true
              } else {
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
            } else {
              campo.isValid = false
            }
          } else {
            campo.isValid = true
          }
        }

        // validamos que para casillas de selecion multiple
        if (campo.id_tipo == 1 && campo.tipo_input.id == 2) {
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
        ).length ==
        actualPage.campos.filter(
          (item) => !campos_excluidos_ids.includes(item.id),
        ).length
      )
    },

    getPreviousSection() {
      if (this.page == 0) {
        return 0
      } else {
        let indice = 0
        if (this.formulario.secciones.lenght != this.seccionesVisibles.length) {
          let id_seccion = this.formulario.secciones[this.page].id
          this.seccionesVisibles.forEach((s, index) => {
            if (s.id == id_seccion) {
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
        if (this.formulario.secciones.lenght != this.seccionesVisibles.length) {
          let id_seccion_visible = this.seccionesVisibles[this.page + 1].id
          this.formulario.secciones.forEach((s, index) => {
            if (s.id == id_seccion_visible) {
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
        this.loading = true
        // si estamos offline y  es móvil, guardarlo en respuestas
        if (this.$q.platform.is.mobile && !this.$store.getters.online) {
          let respuestasRepo = getRepository('Respuestas')
          // Guardar en sqlite la siguiente estructura:
          /**
           *  formulario: this.formulario,
              tipo_identidad: this.tipo_identidad,
              doc_identidad: this.doc_identidad,
              id_centro: this.id_centro,
              id_curso: this.id_curso,
              fecha_inicio: this.fecha_inicio
           */
          let fechaFinal = moment().format('DD/MM/YYYY hh:mm:ss')
          this.formulario.id_curso = this.id_curso
          let formRepo = getRepository('Formulario')
          formRepo.findOne({ url: this.$route.params.slug }).then((form) => {
            this.formulario.id_formulario = form.id
            try {
              let jsonForm = JSON.stringify(this.formulario)
              let respuesta = {
                id_formulario: this.formulario.id_formulario,
                formulario: jsonForm,
                tipo_identidad: this.tipo_identidad,
                doc_identidad: this.doc_identidad,
                id_centro: this.id_centro,
                id_respuesta: new Date().getTime() * -1,
                id_curso: this.id_curso,
                fecha_inicio: this.fecha_inicio,
                fecha_fin: fechaFinal,
                id_participante: this.formulario.participante
                  ? this.formulario.participante.id_participante
                  : -1,
                nombre_participante: this.formulario.participante
                  ? this.formulario.participante.nombre
                  : null,
              }
              let dis = this
              respuestasRepo
                .save(respuesta)
                .then((savedRespuesta) => {
                  localStorage.removeItem(
                    `formulario_respuestas_${this.$route.params.slug}`,
                  )
                  // Al guardar
                  dis.$q.notify({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'fas fa-check-circle',
                    message: 'Formulario creado correctamente',
                    position: 'bottom',
                    timeout: 2000,
                  })

                  dis.finalizado = true
                })
                .catch((error) => {
                  console.error('Error guardando en sqlite', { error })
                  // Al guardar
                  dis.$q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'fas fa-exclamation-triangle',
                    message: 'Error al guardar',
                    position: 'bottom',
                    timeout: 2000,
                  })
                })
            } catch (e) {
              console.error('Error trying to store data to SQLITE ', e)
            }
          })
          return
        } else {
          var method = 'post'

          var headers = {
            Authorization: 'Bearer ' + this.$store.state.token,
          }

          var url =
            process.env.API_URL +
            '/responder/formulario/' +
            this.$route.params.slug

          axios({
            method: method,
            url: url,
            data: {
              formulario: this.formulario,
              tipo_identidad: this.tipo_identidad,
              doc_identidad: this.doc_identidad,
              id_centro: this.id_centro,
              id_curso: this.id_curso,
              fecha_inicio: this.fecha_inicio,
            },
            headers: headers,
          })
            .then((response) => {
              this.finalizado = true
              setTimeout(() => {
                localStorage.removeItem(
                  `formulario_respuestas_${this.$route.params.slug}`,
                )
              }, 500)
              this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fas fa-check-circle',
                message: 'Formulario creado correctamente',
                position: 'bottom',
                timeout: 2000,
              })
            })
            .catch((error) => {
              this.load
              this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'fas fa-exclamation-triangle',
                message: error.response.data,
              })
            })
        }
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
    shuffle(array) {
      var currentIndex = array.length
      var temporaryValue
      var randomIndex

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
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
    continuar() {
      let form = JSON.parse(
        localStorage.getItem(
          `formulario_respuestas_${this.$route.params.slug}`,
        ) || null,
      )
      if (form) {
        this.correoVerificado = true
        this.iniciado = true
        this.formulario = form.formulario
        this.iniciado = form.iniciado
        this.doc_identidad = form.doc_identidad
        this.tipo_identidad = form.tipo_identidad
        this.fecha_inicio = form.fecha_inicio
        this.correoVerificado = form.correoVerificado
        this.nombreUsuario = form.nombreUsuario
        this.finalizado = form.finalizado
        this.id_curso = form.id_curso
        this.id_centro = form.id_centro
        this.confirm = false
        this.finalizado = false
        this.reglas = form.reglas
        this.reglasTabla = form.reglasTabla
      }
    },
    inicializarValoresPorDefectoFormulario(formulario) {
      // Validaciones iniciales para los campos
      for (let keySeccion in formulario.secciones) {
        let campos = formulario.secciones[keySeccion].campos
        for (let keyCampo in campos) {
          let campo = campos[keyCampo]
          campo.isValid = true
          // multiple
          if (campo.id_tipo == 1 && campo.tipo_input.id == 2) {
            campo.opciones.forEach((opcion, index2, arr) => {
              opcion.respuesta = false
            })
          }
          if (campo.id_tipo == 2 && campo.tipo_input.id == 4) {
            campo.respuesta = moment().format('DD/MM/YYYY')
          }

          if (campo.id_tipo == 1 && campo.tipo_input.id == 1) {
            campo.respuesta = false
          }

          if (campo.id_tipo == 2 && campo.tipo_input.id == 3) {
            campo.respuesta = null
          }

          if (campo.id_tipo == 1 && campo.tipo_input.id == 2) {
            campo.respuesta = false
          }

          if (campo.id_tipo == 6) {
            campo.respuesta = 0
          }
        }
      }

      if (
        formulario.id_tipo == 5561 &&
        formulario.ordenar_aleatoriamente == true
      ) {
        formulario.secciones.forEach((seccion) => {
          seccion.campos = this.shuffle(seccion.campos)
          seccion.campos.forEach((campo) => {
            campo.opciones = this.shuffle(campo.opciones)
          })
        })
      }

      this.formulario = JSON.parse(JSON.stringify(formulario))
      this.seccionesVisibles = this.formulario.secciones
    },
    nuevoFormulario() {
      localStorage.removeItem(
        `formulario_respuestas_${this.$route.params.slug}`,
      )
      this.CargarDatosFormulario()
      this.confirm = false
    },
    CargarDatosFormulario() {
      // Si hay un borrador lo cargamos

      if (!this.finalizado) {
        console.log(
          'localstorage:',
          localStorage.getItem(
            `formulario_respuestas_${this.$route.params.slug}`,
          ),
        )
        let form = JSON.parse(
          localStorage.getItem(
            `formulario_respuestas_${this.$route.params.slug}`,
          ) || null,
        )
        if (form && form.formulario.url == this.$route.params.slug) {
          this.confirm = true
          return
        }
      }

      // Validamos que sea el mismo tipo de formulario

      if (this.$route.params.slug) {
        this.loading = true
        if (!this.$store.getters.online && this.$q.platform.is.mobile) {
          let repo = getRepository('Formulario')
          repo
            .find({ url: this.$route.params.slug })
            .then((forms) => {
              let formulario = forms[0]
              formulario.secciones = JSON.parse(formulario.secciones)

              this.inicializarValoresPorDefectoFormulario(formulario)
              if (this.formulario.id_modo == 5605) {
                this.iniciarFormulario()
              }
            })
            .catch((error) => {
              this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'fas fa-exclamation-triangle',
                message: error.response.data,
              })
            })
        } else {
          var url =
            process.env.API_URL +
            `/responder/formulario/${this.$route.params.slug}`

          var headers = {
            Authorization: 'Bearer ' + this.$store.state.token,
          }
          axios({
            method: 'get',
            url: url,
            headers: headers,
          })
            .then((response) => {
              if (response.data.result == false) {
                this.$q.notify({
                  color: 'red-5',
                  textColor: 'white',
                  icon: 'fas fa-exclamation-triangle',
                  message: response.data.message,
                })
                return
              }

              let formulario = response.data.formulario

              let campos = response.data.campos
              formulario.secciones = response.data.secciones

              campos.forEach((campo, index, arr) => {
                arr[index].tipo_input = JSON.parse(campo.tipo_input)
                arr[index].opciones = JSON.parse(campo.opciones)
                if (campo.id_tipo == 3) {
                  arr[index].arregloTable = JSON.parse(campo.arregloTable)
                }
                campo.imagen_url = campo.imagen
              })

              formulario.secciones.forEach((seccion, index, arr) => {
                arr[index].campos = campos.filter(
                  (campo) => campo.id_seccion == seccion.id,
                )
              })

              if (formulario.reglas) {
                let reglas = JSON.parse(formulario.reglas)
                if (reglas) {
                  this.reglas = reglas.reglas
                  this.reglasTabla = reglas.reglasTabla
                }
              }

              formulario.id = Number(formulario.id)
              formulario.id_tipo = Number(formulario.id_tipo)
              formulario.id_tema = Number(formulario.id_tema)
              formulario.id_centro = Number(formulario.id_centro)
              formulario.id_curso = Number(formulario.id_curso)

              formulario.id_modo = Number(formulario.id_modo)

              this.inicializarValoresPorDefectoFormulario(formulario)

              //Si es anónimo
              if (this.formulario.id_modo == 5605) {
                this.iniciarFormulario()
              }
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
            })
        }
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
    app_url() {
      return process.env.WEB_URL + '/'
    },
    cantidad_campos() {
      let cantRespuestas = 0
      let seccion = this.formulario.secciones[this.page]
      for (let index = 0; index < seccion.campos.length; index++) {
        const campo = seccion.campos[index]
        if (
          campo.respuesta == null ||
          campo.respuesta == false ||
          (campo.id_tipo == 2 && campo.tipo_input.id == 4)
        ) {
          continue
        }

        cantRespuestas += 1
      }

      return cantRespuestas
    },
  },
  watch: {
    formulario: {
      handler(val) {
        console.log(this.cantidad_campos)
        if (
          this.iniciado == true &&
          this.cantidad_campos > 0 &&
          this.finalizado == false
        ) {
          this.saveToLocalStorage(
            `formulario_respuestas_${this.$route.params.slug}`,
            {
              formulario: val,
              iniciado: this.iniciado,
              finalizado: this.finalizado,
              doc_identidad: this.doc_identidad,
              tipo_identidad: this.tipo_identidad,
              fecha_inicio: this.fecha_inicio,
              correoVerificado: this.correoVerificado,
              nombreUsuario: this.nombreUsuario,
              id_curso: this.id_curso,
              id_centro: this.id_centro,
              reglas: this.reglas,
              reglasTabla: this.reglasTabla,
              timer: this.timer,
              interval: this.interval,
              segundos: this.segundos,
              minutos: this.minutos,
              municipios: this.municipios,
              departamentos: this.municipios,
              seccionesVisibles: this.seccionesVisibles,
            },
          )
        }

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
}

.pregunta {
  font-weight: bold;
}

.q-field__label {
  font-weight: bold;
}

.pagina {
  margin: auto;
  padding-top: 80px;
  padding-bottom: 80px;
  max-width: 210mm;
}

.error {
  color: red;
}
</style>
