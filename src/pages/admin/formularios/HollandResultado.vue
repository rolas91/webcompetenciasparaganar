<template>
  <q-page class="">
    <div class="q-pa-sm">
      <div class="q-gutter-y-md">
        <q-btn @click="$router.go(-1)" label="Regresar" class="q-ml-sm" />
        <q-tabs v-model="tab" class="text-primary full-width">
          <q-tab name="resumen" icon="description" label="Resumen" />
          <q-tab name="parte_a" icon="details" label="Parte A" />
          <q-tab name="parte_b" icon="details" label="Parte B" />
          <q-tab name="parte_c" icon="details" label="Parte C" />
          <q-tab name="parte_d" icon="details" label="Parte D" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
          <q-tab-panel name="resumen" class="text-blue">
            <div class="full-width">
              <div
                :class="index === 0 ? 'text-green' : 'text-primary'"
                v-for="(personalidad, index) in personalidades"
                :key="index"
                class="row q-col-gutter-md"
              >
                <div class="col-md-10">
                  <div class="text-h6 q-mb-md">
                    {{ personalidad.nombre }}
                  </div>
                </div>
                <div class="col-md-2 ">
                  <div
                    class="text-h6 q-mb-md text-black text-right"
                    :class="index === 0 ? 'text-green' : 'text-primary'"
                  >
                    {{
                      (personalidad.value === 0
                        ? 0
                        : (personalidad.value * 100) / total
                      ).toFixed(0)
                    }}
                    %
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="parte_a">
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
                    <q-checkbox
                      disable
                      v-model="a.checked"
                      :value="a.dimension"
                    >
                      {{ a.texto }}
                    </q-checkbox>
                  </li>
                </ul>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="parte_b">
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
                        disable
                        style="margin-left:50px;"
                        v-model="columna.checked"
                        :val="true"
                      />
                    </li>
                  </div>
                </div>
              </ul>
              <hr />
            </div>
          </q-tab-panel>

          <q-tab-panel name="parte_c">
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
                        disable
                        style="margin-left:50px;"
                        v-model="columna.checked"
                        :val="true"
                      />
                    </li>
                  </div>
                </div>
              </ul>
              <hr />
            </div>
          </q-tab-panel>

          <q-tab-panel name="parte_d">
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
                  disable
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
                  disable
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
                  disable
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
                  disable
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
                  disable
                  v-model="holland.parte_d5.value"
                  :options="holland.parte_d5.opciones"
                  color="primary"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>
<script>
import axios from 'axios'
export default {
  name: 'holland_resultado',
  data() {
    return {
      tab: 'resumen',
      cuadro_resumen: null,

      holland_respuesta_adjetivo: null,
      holland_respuesta: null,
      realista: 0,
      investigador: 0,
      social: 0,
      convencional: 0,
      emprendedor: 0,
      artistico: 0,
      total: 0,
      personalidades: [],
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
    for (let index = 0; index < this.holland.parte_b.length; index++) {
      this.holland.parte_b[index].columns = JSON.parse(
        JSON.stringify(this.holland.columnasParteB),
      )
    }

    for (let index = 0; index < this.holland.parte_c.length; index++) {
      this.holland.parte_c[index].columns = JSON.parse(
        JSON.stringify(this.holland.columnasParteC),
      )
    }
    await this.cargarTest()
    await this.cargarResultado()

    this.$forceUpdate()
  },
  methods: {
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
    cargarResultado() {
      this.loading = true
      var url =
        process.env.API_URL +
        `/formularios/test-holland/${this.$route.params.token}/resultado/${this.$route.params.idResultado}`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      axios({
        method: 'get',
        url: url,
        headers: headers,
        data: {
          token: this.$route.params.token,
          idResultado: this.$route.params.idResultado,
        },
      })
        .then(response => {
          console.log({ response })
          this.holland_respuesta_adjetivo =
            response.data.holland_respuesta_adjetivo
          this.holland_respuesta = response.data.holland_respuesta
          this.realista = Number(response.data.realista)
          this.investigador = Number(response.data.investigador)
          this.social = Number(response.data.social)
          this.convencional = Number(response.data.convencional)
          this.emprendedor = Number(response.data.emprendedor)
          this.artistico = Number(response.data.artistico)
          this.total =
            this.realista +
            this.investigador +
            this.social +
            this.convencional +
            this.emprendedor +
            this.artistico
          this.personalidades = response.data.personalidades

          this.cuadro_resumen = JSON.parse(response.data.cuadro_resumen)

          this.holland.parte_a.forEach((item, index, arr) => {
            var part = response.data.parte_a.filter(
              it => it.adjetivo_id === item.id,
            )[0]

            if (part) {
              this.$set(item, 'checked', true)
            }
          })

          this.holland.parte_b = response.data.parte_b
          this.holland.parte_c = response.data.parte_c

          this.holland.parte_d1.opciones.forEach((item, index, arr) => {
            if (Number(item.value) === Number(response.data.parte_d_1)) {
              this.$set(item, 'checked', true)
            }
          })

          this.holland.parte_d2.opciones.forEach((item, index, arr) => {
            if (Number(item.value) === Number(response.data.parte_d_2)) {
              this.$set(item, 'checked', true)
            }
          })

          this.holland.parte_d3.opciones.forEach((item, index, arr) => {
            if (Number(item.value) === Number(response.data.parte_d_3)) {
              this.$set(item, 'checked', true)
            }
          })

          this.holland.parte_d4.opciones.forEach((item, index, arr) => {
            if (Number(item.value) === Number(response.data.parte_d_4)) {
              this.$set(item, 'checked', true)
            }
          })

          this.holland.parte_d5.opciones.forEach((item, index, arr) => {
            if (Number(item.value) === Number(response.data.parte_d_5)) {
              this.$set(item, 'checked', true)
            }
          })

          this.holland.parte_d1.value = Number(response.data.parte_d_1)
          this.holland.parte_d2.value = Number(response.data.parte_d_2)
          this.holland.parte_d3.value = Number(response.data.parte_d_3)
          this.holland.parte_d4.value = Number(response.data.parte_d_4)
          this.holland.parte_d5.value = Number(response.data.parte_d_5)

          this.loading = false
          this.$forceUpdate()
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
