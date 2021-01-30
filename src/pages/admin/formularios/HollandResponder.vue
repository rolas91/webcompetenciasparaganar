<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md ">
      <div v-if="!loading && testValid" class="col-12  col-md-8 offset-md-2">
        <q-stepper
          v-if="!finalizado"
          v-model="step"
          ref="stepper"
          color="primary"
          animated
        >
          <q-step :name="0" title="Bienvenida" icon="settings" :done="step > 0">
            <h3 style="font-weight: bolder;" class="text-primary">
              <b>Bienvenido al test de orientación vocacional</b>
            </h3>

            <h5>
              Antes de comenzar el test, Por favor ingresa tus datos personales
            </h5>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  mask="###-######-####A"
                  type="text"
                  label="Cédula"
                  v-model="participante.cedula"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && cedulaRegex.test(val)) ||
                      !val ||
                      'Ingresa una cédula válida con el formato: ###-######-####X',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="text"
                  label="Nombres"
                  v-model="participante.nombres"
                  lazy-rules
                  :rules="[
                    val => (val && val.length) || 'Éste campo es requerido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="text"
                  label="Apellidos"
                  v-model="participante.apellidos"
                  lazy-rules
                  :rules="[
                    val => (val && val.length) || 'Éste campo es requerido',
                  ]"
                ></q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="text"
                  label="Correo eléctronico"
                  v-model="participante.correo"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && emailRegex.test(val)) ||
                      !val ||
                      'Ingresa un correo electrónico válido',
                  ]"
                ></q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  type="text"
                  label="Celular"
                  v-model="participante.telefono"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingresa un número de celular válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined=""
                  :readonly="readonly"
                  label="Fecha Nacimiento"
                  v-model="participante.fecha_nacimiento"
                  lazy-rules
                  :rules="[
                    val =>
                      (val &&
                        isValidDate(val) &&
                        /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) ||
                      !val ||
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
                          v-model="participante.fecha_nacimiento"
                          @input="() => $refs.qDateProxyFechaFin.hide()"
                          lazy-rules
                          :rules="[
                            val =>
                              (val && val.length > 0) ||
                              'Ingrese un FechaFin válido',
                          ]"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-select
                  outlined
                  v-model="participante.id_centro"
                  label="Centro de estudio"
                  :options="centros"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="CargarCursos"
                  lazy-rules
                  :rules="[val => val || 'Éste campo es requerido']"
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
              <div class="col-12 col-md-4">
                <q-select
                  outlined
                  v-model="participante.id_curso"
                  label="Seleccione el curso"
                  :options="cursos"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[val => val || 'Éste campo es requerido']"
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
          </q-step>

          <q-step :name="1" title="A" icon="assignment" :done="step > 1">
            <h3 style="font-weight: bolder;" class="text-primary">
              <b>INSTRUCCIONES GENERALES</b>
            </h3>
            <p style="margin: 1.5rem 0;font-size:16px;">
              Para la realización de este test, debe ir leyendo atentamente las
              siguientes instrucciones y responder según su interés o proyección
              personal y profesional.
            </p>

            <p class="alert-text">
              <b>
                Seleccione todos los adjetivos que describan su personalidad,
                señale tantos como desee y trate de definirse tal como es, no
                como le gustaría ser.
              </b>
            </p>

            <!-- Parte A -->
            <div class="row">
              <div
                v-for="a in holland.parte_a"
                :key="a.id"
                class="col-md-3 col-sm-3 col-xs-6"
              >
                <ul>
                  <li>
                    <q-checkbox v-model="a.checked" :value="a.dimension">
                      {{ a.texto }}
                    </q-checkbox>
                  </li>
                </ul>
              </div>
            </div>
          </q-step>

          <q-step :name="2" title="B" icon="assignment" :done="step > 2">
            <p class="alert-text">
              <b>
                Califíquese de acuerdo con las siguientes características tal
                como considera ser en comparación con otras personas de su edad.
                Encierre en un círculo la respuesta que más se ajuste a sí
                mismo.
              </b>
            </p>

            <!-- Parte B -->

            <div class="row q-col-gutter-md q-mb-xl">
              <div class="col text-bold">Características</div>
              <div class="col text-bold">Más que los demás</div>
              <div class="col text-bold">Igual que los demás</div>
              <div class="col text-bold">Menos que los demás</div>
            </div>

            <div v-for="fila in holland.parte_b" :key="fila.id">
              <ul>
                <div class="row" :class="!fila.valid ? 'error' : ''">
                  <div class="col">
                    <li>
                      {{ fila.nombre }}
                    </li>
                  </div>

                  <div
                    class="col"
                    v-for="columna in fila.columns"
                    :key="columna.value"
                  >
                    <li>
                      <q-radio
                        style="margin-left:50px;"
                        v-model="columna.checked"
                        :val="true"
                        @input="seleccionarRadioParteB(fila, columna)"
                      />
                    </li>
                  </div>
                </div>
              </ul>
              <hr />
            </div>
          </q-step>

          <q-step :name="3" title="C" icon="assignment">
            <p class="alert-text">
              <b>
                Indique qué importancia da a las siguientes clases de logros,
                aspiraciones y metas.
              </b>
            </p>

            <!-- Parte C -->

            <div class="row q-col-gutter-md q-mb-xl">
              <div class="col text-bold">Características</div>
              <div class="col text-bold">Muy Importante</div>
              <div class="col text-bold">Más o menos importante</div>
              <div class="col text-bold">Poco importante</div>
            </div>

            <div v-for="fila in holland.parte_c" :key="fila.id">
              <ul>
                <div class="row" :class="!fila.valid ? 'error' : ''">
                  <div class="col">
                    <li>
                      {{ fila.nombre }}
                    </li>
                  </div>

                  <div
                    class="col"
                    v-for="columna in fila.columns"
                    :key="columna.value"
                  >
                    <li>
                      <q-radio
                        style="margin-left:50px;"
                        v-model="columna.checked"
                        :val="true"
                        @input="seleccionarRadioParteC(fila, columna)"
                      />
                    </li>
                  </div>
                </div>
              </ul>
              <hr />
            </div>
          </q-step>

          <q-step :name="4" title="D" icon="assignment">
            <p class="alert-text">
              <b>
                Para las siguientes preguntas seleccione una sola alternativa,
                según lo que más se ajuste a Usted.
              </b>
            </p>

            <!-- Parte D -->
            <!-- PARTE D1 -->
            <div class="row">
              <div class="q-pa-lg">
                <label
                  class="q-mb-md"
                  :class="!holland.parte_d1.valid ? 'text-red' : ''"
                >
                  <strong>{{ holland.parte_d1.nombre }}</strong>
                </label>

                <q-option-group
                  v-model="holland.parte_d1.value"
                  :options="holland.parte_d1.opciones"
                  color="primary"
                />
              </div>
            </div>
            <!-- PARTE D2-->
            <div class="row">
              <div class="q-pa-lg">
                <label
                  class="q-mb-md"
                  :class="!holland.parte_d2.valid ? 'text-red' : ''"
                >
                  <strong>{{ holland.parte_d2.nombre }}</strong>
                </label>

                <q-option-group
                  v-model="holland.parte_d2.value"
                  :options="holland.parte_d2.opciones"
                  color="primary"
                />
              </div>
            </div>

            <!-- PARTE D3-->
            <div class="row">
              <div class="q-pa-lg">
                <label
                  class="q-mb-md"
                  :class="!holland.parte_d3.valid ? 'text-red' : ''"
                >
                  <strong>{{ holland.parte_d3.nombre }}</strong>
                </label>

                <q-option-group
                  v-model="holland.parte_d3.value"
                  :options="holland.parte_d3.opciones"
                  color="primary"
                />
              </div>
            </div>

            <!-- PARTE D4-->
            <div class="row">
              <div class="q-pa-lg">
                <label
                  class="q-mb-md"
                  :class="!holland.parte_d4.valid ? 'text-red' : ''"
                >
                  <strong>{{ holland.parte_d4.nombre }}</strong>
                </label>

                <q-option-group
                  v-model="holland.parte_d4.value"
                  :options="holland.parte_d4.opciones"
                  color="primary"
                />
              </div>
            </div>

            <!-- PARTE D5-->
            <div class="row">
              <div class="q-pa-lg">
                <label
                  class="q-mb-md"
                  :class="!holland.parte_d5.valid ? 'text-red' : ''"
                >
                  <strong>{{ holland.parte_d5.nombre }}</strong>
                </label>

                <q-option-group
                  v-model="holland.parte_d5.value"
                  :options="holland.parte_d5.opciones"
                  color="primary"
                />
              </div>
            </div>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                @click="nextPage"
                color="primary"
                :label="step === 4 ? 'Finalizar' : 'Continuar'"
              />
              <q-btn
                v-if="step > 0"
                flat
                color="primary"
                @click="previusPage"
                label="Regresar"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
        <div v-else-if="finalizado">
          <q-card>
            <q-card-section>
              <div class="row" style="display:flex;justify-content:center">
                <div
                  class="col-12 col-md-2"
                  style="display: flex;justify-content: center;margin-bottom: 100px;"
                >
                  <q-img
                    src="statics/imagenes-plantilla/logo2.png"
                    cover
                    position="center"
                    style="height: 80px;max-width: 250px;display:flex;justify-content:center;"
                  ></q-img>
                </div>

                <div class="row">
                  <div
                    class="col-12 col-md-10"
                    style="display:flex;justify-content:center;margin:auto;margin-bottom:100px"
                  >
                    <label
                      style="color:#00B0BD;font-size:35px;text-align: center;"
                    >
                      GRACIAS POR COMPLETAR ESTE TEST!!
                    </label>
                  </div>
                </div>
              </div>
              <div class="row" style="display:flex;justify-content:center">
                <q-btn icon="chevron_left" @click="$router.go(-1)">
                  Regresar
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-if="!loading && !testValid" class="col-12  col-md-8 offset-md-2">
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
                      LO SENTIMOS, ESTE TEST YA NO SE ENCUENTRA DISPONIBLE!!
                    </label>
                  </div>
                </div>
              </div>
              <div class="row" style="display: flex; justify-content: center;">
                <q-btn
                  icon="chevron_left"
                  @click="$router.replace('/formularios/test-holland')"
                >
                  Regresar
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { getRepository } from 'typeorm'
export default {
  data() {
    return {
      testValid : true,
      readonly: false,
      cedulaRegex: new RegExp(/^\d{3}-\d{6}-\d{4}[a-zA-Z]{1}$/),
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      phoneRegex: new RegExp(/^[\s.-]?\(?\d{4}\)?[\s.-]?\d{4}$/),
      finalizado: false,
      loading: false,
      step: 0,
      centros: [],
      cursos: [],
      doc_identidad: null,
      tipo_identidad: null,
      tipos_identidad: [
        { label: 'Cédula', value: 'documento_identidad' },
        { label: 'Correo', value: 'correo' },
        { label: 'Teléfono', value: 'telefono' },
      ],

      participante: {
        nombres: null,
        apellidos: null,
        cedula: null,
        fecha_nacimiento: null,
        telefono: null,
        correo: null,
        id_centro: null,
        id_curso: null,
      },
      holland: {
        token: null,
        id_curso: null,
        id_centro: null,
        parte_a: [],
        columnasParteB: [
          { value: 1, nombre: 'Más que los demás', checked: false },
          { value: 2, nombre: 'Igual que los demás', checked: false },
          { value: 3, nombre: 'Menos que los demás', checked: false },
        ],
        columnasParteC: [
          { value: 1, nombre: 'Muy importante', checked: false },
          { value: 2, nombre: 'Más o menos importante', checked: false },
          { value: 3, nombre: 'Poco importante', checked: false },
        ],
        parte_b: [
          {
            id: 1,
            nombre: 'Distraído',
            valid: true,
            columns: null,
          },
          {
            id: 2,
            nombre: 'Capacidad artística',
            valid: true,
            columns: null,
          },
          {
            id: 3,
            nombre: 'Capacidad Burocrática',
            valid: true,
            columns: null,
          },
          {
            id: 4,
            nombre: 'Conservador',
            valid: true,
            columns: null,
          },
          {
            id: 5,
            nombre: 'Cooperación',
            valid: true,
            columns: null,
          },
          {
            id: 6,
            nombre: 'Expresividad',
            valid: true,
            columns: null,
          },
          {
            id: 7,
            nombre: 'Liderazgo',
            valid: true,
            columns: null,
          },
          {
            id: 8,
            nombre: 'Gusto en ayudar a los demás',
            valid: true,
            columns: null,
          },
          {
            id: 9,
            nombre: 'Capacidad matemática',
            valid: true,
            columns: null,
          },
          {
            id: 10,
            nombre: 'Capacidad mecánica',
            valid: true,
            columns: null,
          },
          {
            id: 11,
            nombre: 'Originalidad',
            valid: true,
            columns: null,
          },
          {
            id: 12,
            nombre: 'Popularidad con el sexo opuesto',
            valid: true,
            columns: null,
          },
          {
            id: 13,
            nombre: 'Capacidad para investigar',
            valid: true,
            columns: null,
          },
          {
            id: 14,
            nombre: 'Capacidad científica',
            valid: true,
            columns: null,
          },
          {
            id: 15,
            nombre: 'Seguridad en sí mismo',
            valid: true,
            columns: null,
          },
          {
            id: 16,
            nombre: 'Comprensión de sí mismo',
            valid: true,
            columns: null,
          },
          {
            id: 17,
            nombre: 'Comprensión de los demás',
            valid: true,
            columns: null,
          },
          {
            id: 18,
            nombre: 'Pulcritud',
            valid: true,
            columns: null,
          },
        ],
        parte_c: [
          {
            id: 1,
            nombre: 'Estar feliz y satisfecho',
            columns: null,
            valid: true,
          },
          {
            id: 2,
            nombre: 'Descubrir o elaborar un producto útil',
            columns: null,
            valid: true,
          },
          {
            id: 3,
            nombre: 'Ayudar a quiénes están en apuros',
            columns: null,
            valid: true,
          },
          {
            id: 4,
            nombre: 'Llegar a ser una autoridad en algún tema',
            columns: null,
            valid: true,
          },
          {
            id: 5,
            nombre: 'Llegar a ser un deportista destacado',
            columns: null,
            valid: true,
          },
          {
            id: 6,
            nombre: 'Llegar a ser un líder en la comunidad',
            columns: null,
            valid: true,
          },
          {
            id: 7,
            nombre: 'Ser influyente en asuntos públicos',
            columns: null,
            valid: true,
          },
          {
            id: 8,
            nombre: 'Observar una conducta religiosa formal',
            columns: null,
            valid: true,
          },
          {
            id: 9,
            nombre: 'Contribuir a la ciencia en forma teórica',
            columns: null,
            valid: true,
          },
          {
            id: 10,
            nombre: 'Contribuir a la ciencia en forma técnica',
            columns: null,
            valid: true,
          },
          {
            id: 11,
            nombre: 'Escribir bien (novelas, poemas)',
            columns: null,
            valid: true,
          },
          { id: 12, nombre: 'Haber leído mucho', columns: null, valid: true },
          { id: 13, nombre: 'Trabajar mucho', columns: null, valid: true },
          {
            id: 14,
            nombre: 'Contribuir al bienestar humano.',
            columns: null,
            valid: true,
          },
          {
            id: 15,
            nombre: 'Crear buenas obras artísticas (teatro, pintura)',
            columns: null,
            valid: true,
          },
          {
            id: 16,
            nombre: 'Llegar a ser un buen músico',
            columns: null,
            valid: true,
          },
          {
            id: 17,
            nombre: 'Llegar a ser un experto en finanzas y  negocios',
            columns: null,
            valid: true,
          },
          {
            id: 18,
            nombre: 'Hallar un propósito real en la vida',
            columns: null,
            valid: true,
          },
        ],
        parte_d1: {
          nombre: 'Me gusta....',
          value: null,
          valid: true,
          opciones: [
            {
              value: 2,
              label: 'Leer y meditar sobre los problemas',
              checked: false,
            },
            {
              value: 4,
              label: 'Anotar datos y hacer cómputos',
              checked: false,
            },
            { value: 5, label: 'Tener una posición poderosa', checked: false },
            { value: 3, label: 'Enseñar o ayudar a los demás', checked: false },
            {
              value: 1,
              label: 'Trabajar manualmente, usar equipos, herramientas',
              checked: false,
            },
            { value: 6, label: 'Usar mi talento artístico', checked: false },
          ],
        },
        parte_d2: {
          nombre: 'Mi mayor habilidad se manifiesta en…',
          value: null,
          valid: true,
          opciones: [
            { value: 4, label: 'Negocios', checked: false },
            { value: 6, label: 'Artes', checked: false },
            { value: 2, label: 'Ciencias', checked: false },
            { value: 5, label: 'Liderazgo', checked: false },
            { value: 3, label: 'Relaciones Humanas', checked: false },
            { value: 1, label: 'Mecánica', checked: false },
          ],
        },
        parte_d3: {
          nombre: 'Soy muy incompetente en…',
          value: null,
          valid: true,
          opciones: [
            { value: 3, label: 'Mecánica', checked: false },
            { value: 5, label: 'Ciencia', checked: false },
            { value: 1, label: 'Relaciones Humanas', checked: false },
            { value: 6, label: 'Negocios', checked: false },
            { value: 2, label: 'Liderazgo', checked: false },
            { value: 4, label: 'Artes', checked: false },
          ],
        },
        parte_d4: {
          nombre:
            'Si tuviera que realizar alguna de estas actividades, la que menos me agradaría es…',
          value: null,
          valid: true,
          opciones: [
            {
              value: 5,
              label: 'Participar en actividades sociales muy formales',
              checked: false,
            },
            {
              value: 1,
              label: 'Tener una posición de responsabilidad',
              checked: false,
            },
            {
              value: 6,
              label: 'Llevar pacientes mentales a actividades recreativas',
              checked: false,
            },
            {
              value: 4,
              label: 'Llevar registros exactos y complejos',
              checked: false,
            },
            { value: 3, label: 'Escribir un poema', checked: false },
            {
              value: 2,
              label: 'Hacer algo que exija paciencia y precisión',
              checked: false,
            },
          ],
        },
        parte_d5: {
          nombre: 'Las materias que más me gustan son…',
          value: null,
          valid: true,
          opciones: [
            { value: 6, label: 'Arte', checked: false },
            { value: 4, label: 'Administración, contabilidad', checked: false },
            { value: 2, label: 'Química, Física', checked: false },
            {
              value: 1,
              label: 'Educación tecnológica, Mecánica',
              checked: false,
            },
            { value: 5, label: 'Historia', checked: false },
            { value: 3, label: 'Ciencias sociales, Filosofía', checked: false },
          ],
        },
      },
    }
  },
  async created() {

    this.token = this.$route.params.token

    this.testValid = await this.isTestValid()

    //aqui se arman las columnas parte_b
    for (let index = 0; index < this.holland.parte_b.length; index++) {
      this.holland.parte_b[index].columns = JSON.parse(
        JSON.stringify(this.holland.columnasParteB),
      )
    }

    //aqui se arman las columnas parte_c
    for (let index = 0; index < this.holland.parte_c.length; index++) {
      this.holland.parte_c[index].columns = JSON.parse(
        JSON.stringify(this.holland.columnasParteC),
      )
    }
    this.cargarTest()
    this.CargarCentros()
    this.CargarCursos()
    this.loading =false
  },
  methods: {
    isTestValid(){
       var url = process.env.API_URL + '/fornularios/test-holland/test-activo/'+ this.token
      this.loading =true
      axios({
        method: 'get',
        url: url,


      })
        .then(response => {
          this.testValid = response.data.result
          this.loading = false
        })
        .catch(error => {
          this.testValid =false
          this.loading =false
          console.log({ error })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
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
        .then(response => {
          this.centros = response.data.centros
        })
        .catch(error => {
          console.log({ error })

          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    CargarCursos(resetearIdCurso) {
      if (!this.participante.id_centro) {
        return
      }
      console.log(
        'Finding courses for center with id',
        this.participante.id_centro,
      )

      if (!this.$store.getters.online && this.$q.platform.is.mobile) {
        let centroRepository = getRepository('Centro')
        centroRepository
          .findOne(this.participante.id_centro, { relations: ['cursos'] })
          .then(centro => {
            this.cursos = centro.cursos

            // Esta asignacion indica que cuando está offline
            // this.formulario is undefined
            this.participante.id_curso = null
          })
          .catch(error => {
            console.error('Error finding centro', error)
            this.cursos = null
            // Esta asignacion indica que cuando está offline
            // this.formulario is undefined
            this.participante.id_curso = null
          })
      } else {
        var url = process.env.API_URL + '/catalogos/cursos'

        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }

        var params = {
          id_centro: this.participante.id_centro,
        }
        axios({
          method: 'get',
          url: url,
          params: params,
          headers: headers,
        })
          .then(response => {
            this.cursos = response.data.cursos
            this.participante.id_curso = null
          })
          .catch(error => {
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

    seleccionarRadioParteB(fila, columna) {
      for (let index = 0; index < this.holland.parte_b.length; index++) {
        for (
          let index2 = 0;
          index2 < this.holland.parte_b[index].columns.length;
          index2++
        ) {
          const element = this.holland.parte_b[index].columns[index2]

          if (
            this.holland.parte_b[index].id === fila.id &&
            element.value !== columna.value
          ) {
            this.$set(
              this.holland.parte_b[index].columns[index2],
              'checked',
              false,
            )
          }
        }
      }
      this.$forceUpdate()
    },

    seleccionarRadioParteC(fila, columna) {
      for (let index = 0; index < this.holland.parte_c.length; index++) {
        for (
          let index2 = 0;
          index2 < this.holland.parte_c[index].columns.length;
          index2++
        ) {
          const element = this.holland.parte_c[index].columns[index2]

          if (
            this.holland.parte_c[index].id === fila.id &&
            element.value !== columna.value
          ) {
            this.$set(
              this.holland.parte_c[index].columns[index2],
              'checked',
              false,
            )
          }
        }
      }
      this.$forceUpdate()
    },

    nextPage() {
      let participanteOk = true
      let mensajeError = ''

      if (this.step === 0) {
        let respuesta = this.esParticipanteValido()
        participanteOk = respuesta.participanteOk
        mensajeError = respuesta.mensajeError
      }

      if (this.step === 1) {
        if (!this.esValidaParteA()) {
          participanteOk = false
          mensajeError += 'Es necesario seleccionar al menos una personalidad'
        }
      }

      if (this.step === 2) {
        if (!this.esValidaParteB()) {
          participanteOk = false
          mensajeError +=
            'Es necesario calificar cada una de las características'
        }
      }

      if (this.step === 3) {
        if (!this.esValidaParteC()) {
          participanteOk = false
          mensajeError +=
            'Es necesario seleccionar la importancia que tiene para usted cada uno de los logros'
        }
      }

      if (this.step === 4) {
        if (!this.esValidaParteD()) {
          participanteOk = false
          mensajeError +=
            'Es necesario seleccionar una alternativa para cada opción'
        }
      }

      if (participanteOk === true && this.step < 4) {
        this.$refs.stepper.next()
      } else if (participanteOk === true && this.step === 4) {
        // Si es finalizar procedemos a guardar
        var method = 'post'
        var headers = {
          Authorization: 'Bearer ' + this.$store.state.token,
        }

        var url = process.env.API_URL + '/formularios/test-holland/responder'

        axios({
          method: method,
          url: url,
          data: {
            parte_a: this.holland.parte_a,
            parte_b: this.holland.parte_b,
            parte_c: this.holland.parte_c,
            parte_d1: this.holland.parte_d1,
            parte_d2: this.holland.parte_d2,
            parte_d3: this.holland.parte_d3,
            parte_d4: this.holland.parte_d4,
            parte_d5: this.holland.parte_d5,
            participante: this.participante,
            token: this.$route.params.token,
          },
          headers: headers,
        })
          .then(response => {
            if (response.data.result === true) {
              this.finalizado = true
              this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'fas fa-check-circle',
                message: 'Test completado correctamente',
                position: 'bottom',
                timeout: 2000,
              })
            } else {
              this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'fas fa-exclamation-triangle',
                message:
                  'Ha ocurrido un error al guardar los datos: ' +
                  response.data.message,
              })
            }
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
      } else {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: mensajeError,
          html: true,
        })
      }
    },

    esValidaParteA() {
      let counter = 0
      this.holland.parte_a.forEach(p => {
        if (p.checked === true) {
          counter++
        }
      })

      return counter > 0
    },

    esParticipanteValido() {
      let participanteOk = true
      let mensajeError = ''

      if (
        !this.cedulaRegex.test(this.participante.cedula) &&
        this.participante.cedula
      ) {
        participanteOk = false
        mensajeError += 'La cédula no es válida. Ej: ###-######-####X <br/>'
      }

      if (
        !this.phoneRegex.test(this.participante.telefono) &&
        this.participante.telefono
      ) {
        console.log('entró al fail del telefono')
        participanteOk = false
        mensajeError += 'Ingresa un número de celular válido <br/>'
      }

      if (
        !this.emailRegex.test(this.participante.correo) &&
        this.participante.correo
      ) {
        participanteOk = false
        mensajeError += 'Ingresa un correo electrónico válido <br/>'
      }

      if (!this.participante.nombres) {
        participanteOk = false
        mensajeError += 'Ingresa tus numbres<br/>'
      }

      if (!this.participante.apellidos) {
        participanteOk = false
        mensajeError += 'Ingresa tus apellidos<br/>'
      }

      if (
        !this.isValidDate(this.participante.fecha_nacimiento) &&
        this.participante.fecha_nacimiento
      ) {
        participanteOk = false
        mensajeError += 'Ingresa tu fecha de nacimiento<br/>'
      }

      // if (!this.participante.id_centro) {
      //   participanteOk = false
      //   mensajeError += 'Selecciona un centro de estudio<br/>'
      // }

      // if (!this.participante.id_curso) {
      //   participanteOk = false
      //   mensajeError += 'Selecciona un curso<br/>'
      // }

      console.log({
        mensajeError: mensajeError,
        participanteOk: participanteOk,
        step: this.step,
      })

      return { mensajeError, participanteOk }
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
            tipo_identidad: this.tipo_identidad,
            doc_identidad: this.doc_identidad,
            id_centro: this.id_centro,
            id_curso: this.id_curso,
          },
        })
          .then(response => {
            this.loading = false
            if (response.data.result) {
              this.correoVerificado = true
              this.participante = response.data.participante
            }

            if (!response.data.result && response.data.code === 'completado') {
              this.iniciado = true
              this.finalizado = true
              return
            }

            if (
              !response.data.result &&
              response.data.code === 'multiples_coincidencias' &&
              mostrarMultiples
            ) {
              this.modalOpen = true
              this.multiples_coincidencias =
                response.data.multiples_coincidencias

              return
            }

            if (
              !response.data.result &&
              response.data.code === 'no_matricula'
            ) {
              this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'fas fa-exclamation-triangle',
                message: response.data.message,
              })
            }

            if (mostrarMultiples === false) {
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
          .catch(error => {
            this.loading = false

            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'fas fa-exclamation-triangle',
              message: error.response.data.message,
            })

            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      } else {
        let matriculasRepo = getRepository('Matriculas')
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
          .then(matriculas => {
            console.log('Matriculas', { matriculas })
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
                console.log('Participante from sql', m)
                console.log('Valor de formulario.participante', {
                  nombre: m.nombre,
                  id_participante: m.id_participante + '',
                })
                this.formulario.participante = {
                  nombre: m.nombre,
                  id_participante: m.id_participante + '',
                }
              }
            }
          })
          .catch(error => {
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

    esValidaParteB() {
      let ok = true
      for (let index = 0; index < this.holland.parte_b.length; index++) {
        if (
          this.holland.parte_b[index].columns.filter(c => c.checked === false)
            .length === 3
        ) {
          this.$set(this.holland.parte_b[index], 'valid', false)
          ok = false
        } else {
          this.$set(this.holland.parte_b[index], 'valid', true)
        }
      }
      this.$forceUpdate()
      return ok
    },

    esValidaParteC() {
      let ok = true
      for (let index = 0; index < this.holland.parte_c.length; index++) {
        if (
          this.holland.parte_c[index].columns.filter(c => c.checked === false)
            .length === 3
        ) {
          this.$set(this.holland.parte_c[index], 'valid', false)
          ok = false
        } else {
          this.$set(this.holland.parte_c[index], 'valid', true)
        }
      }
      this.$forceUpdate()
      return ok
    },

    esValidaParteD() {
      this.holland.parte_d1.valid = this.holland.parte_d1.value
      this.holland.parte_d2.valid = this.holland.parte_d2.value
      this.holland.parte_d3.valid = this.holland.parte_d3.value
      this.holland.parte_d4.valid = this.holland.parte_d4.value
      this.holland.parte_d5.valid = this.holland.parte_d5.value

      this.$forceUpdate()
      return (
        this.holland.parte_d1.value &&
        this.holland.parte_d2.value &&
        this.holland.parte_d3.value &&
        this.holland.parte_d4.value &&
        this.holland.parte_d5.value
      )
    },

    previusPage() {
      this.$refs.stepper.previous()
    },

    isValidDate(val) {
      return moment(val, 'DD/MM/YYYY',true).isValid()
    },

    cargarTest() {
      this.loading = true
      var url = process.env.API_URL + `/formularios/test-holland`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      axios({
        method: 'get',
        url: url,
        headers: headers,
      })
        .then(response => {
          console.log({ response })
          this.holland.parte_a = response.data.parte_a
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
  },
}
</script>

<style>
li {
  list-style-type: none;
}

ul {
  margin: 0;
  padding: 0;
}

.error {
  color: red;
}
</style>
