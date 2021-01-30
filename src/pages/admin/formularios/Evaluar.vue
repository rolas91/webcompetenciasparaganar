<template>
  <q-page class="q-pa-md q-mt-md">
    <q-btn v-if="!loading" right icon="chevron_left" @click="regresar"
      >Regresar</q-btn
    >
    <q-card class="q-mt-md">
      <div v-if="formulario" class="row q-pa-md">
        <div class="col-12 col-md-8">
          <label class="titulo"
            >{{ formulario.nombre }} ({{
              Number(formulario.nota_maxima)
            }}
            puntos)</label
          >
        </div>
        <div class="col-12 col-md-4">
          <label class="nota"
            ><span class="textonota">Calificación:</span>
            <span class="numeronota"
              >{{ formulario_respuesta.nota }} Puntos</span
            ></label
          >
        </div>
      </div>

      <div v-if="formulario_respuesta" class="row q-pa-md">
        <div class="col-12">
          <label class="nombreParticipante">
            Participante:
            {{
              formulario.id_modo === 5605
                ? "Anónimo"
                : formulario_respuesta.nombre_participante
            }}</label
          >
        </div>
      </div>
      <div class="row  flex bg-grey-4">
        <div class="col-12 col-md-8 q-pa-md">
          <span class="ValorNota"> Preguntas</span>
        </div>
        <div class="col-12 col-md-2 q-pa-md">
          <span class="ValorNota"> Valor | Nota</span>
        </div>
      </div>
      <div
        class="row border-bottom "
        v-for="campo in campos"
        :key="campo.texto"
      >
        <div class="col-12 col-md-8 q-pa-md">
          <label class="pregunta"
            >{{ campo.texto }}
            <span
              :class="
                respuesta_campos.filter(
                  i => i.id_formulario_campo === campo.id_formulario_campo
                )[0].nota !== campo.nota
                  ? 'respuestaIncorrecta'
                  : 'respuestaCorrecta'
              "
            >
              <br />
              R:
              <ul style="lista">
                <span v-html="mostrarRespuesta(campo, respuesta_campos)" />
              </ul>
            </span>
          </label>
        </div>

        <div class="col-12 col-md-2 q-pa-md flex">
          <span class="bg-primary text-white textocentrado">
            {{ campo.nota }}
          </span>
          <span
            :class="
              respuesta_campos.filter(
                i => i.id_formulario_campo === campo.id_formulario_campo
              )[0].nota !== campo.nota
                ? 'bg-red-8 text-white'
                : 'bg-green-8 text-white'
            "
            class="textocentrado"
          >
            {{
              respuesta_campos.filter(
                i => i.id_formulario_campo === campo.id_formulario_campo
              )[0].nota
            }}
          </span>
        </div>

        <div class="col-12 col-md-2 q-pa-md text-right">
          <q-btn
            v-if="campo.id_tipo === 2 && campo.nota > 0"
            size="sm"
            :class="colorNota(campo, respuesta_campos)"
            :label="
              respuesta_campos.filter(
                i => i.id_formulario_campo === campo.id_formulario_campo
              )[0].nota !== campo.nota
                ? 'Marcar Correcta'
                : 'Marcar Incorrecta'
            "
            @click="
              CambiarResultadoRespuesta(
                campo,
                respuesta_campos.filter(
                  i => i.id_formulario_campo === campo.id_formulario_campo
                )[0]
              )
            "
          >
          </q-btn>
        </div>
      </div>
    </q-card>
  </q-page>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      formulario: null,
      campos: null,
      secciones: null,
      formulario_respuesta: null,
      respuesta_campos: null
    };
  },
  created() {
    this.cargarDatosFormulario();
  },
  methods: {
    colorNota(campo, respuestaCampos) {
      if (!respuestaCampos) return;
      let notaRespuesta = respuestaCampos.filter(
        i => i.id_formulario_campo === campo.id_formulario_campo
      )[0].nota;
      let notaCampo = campo.nota;
      let respuesta = "";
      if (notaRespuesta > 0 && notaRespuesta < notaCampo) {
        respuesta = "bg-orange text-white";
      }

      if (notaRespuesta === 0) {
        respuesta = "bg-red text-white";
      }

      if (notaRespuesta === notaCampo) {
        respuesta = "bg-green text-white";
      }

      return respuesta;
    },

    mostrarRespuesta(campo, respuestaCampos) {
      let respuesta = "";

      // Tipo checkbox multiple
      if (campo.id_tipo === 1 && campo.tipo_input.id === 2) {
        let valor = respuestaCampos.filter(
          i => i.id_formulario_campo === campo.id_formulario_campo
        )[0].valor;
        console.log({ valor });
        let items = valor.split(",");

        for (let item in items) {
          console.log("item:", item);
          const element = items[item];
          respuesta += "<li>" + element + "</li><br/>";
        }
        return respuesta;
      }

      // Tipo Tabla
      if (campo.id_tipo === 3) {
        let valor = respuestaCampos.filter(
          i => i.id_formulario_campo === campo.id_formulario_campo
        )[0].valor;
        console.log({ valor });
        let items = valor
          .replace(/\[/g, "")
          .replace(/]/g, "")
          .replace(/"/g, "")
          .replace(/{/g, "")
          .replace(/}/g, "")
          .split(",");

        for (let item in items) {
          console.log("item:", items[item]);
          const element = items[item];
          respuesta += "<li>" + element + "</li><br/>";
        }
        return respuesta;
      }
      return respuestaCampos.filter(
        i => i.id_formulario_campo === campo.id_formulario_campo
      )[0].valor;
    },

    CambiarResultadoRespuesta(campo, respuesta) {
      let correcta = false;

      if (campo.nota === 0) return;
      // Marcamos la respuesta como correcta o incorrecta segun sea el caso
      correcta = respuesta.nota === 0;

      var url = process.env.API_URL + `/formulario/cambiar_resultado_respuesta`;

      var headers = {
        Authorization: "Bearer " + this.$store.state.token
      };

      axios({
        method: "post",
        url: url,
        data: {
          id_campo: respuesta.id,
          correcta: correcta,
          id_formulario_respuesta: respuesta.id_formulario_respuesta
        },
        headers: headers
      })
        .then(response => {
          this.cargarDatosFormulario();
        })
        .catch(error => {
          this.loading = false;
          console.log({ error });

          if (error.response.status === 401) {
            this.removeCredentials();
            this.$router.push({
              name: "login"
            });
          }
        });
    },
    regresar() {
      this.$router.push({
        name: "respuestas_formulario",
        params: { id_formulario: this.$route.params.id_formulario }
      });
    },
    cargarDatosFormulario() {
      this.loading = true;
      var url =
        process.env.API_URL +
        `/formularios/${this.$route.params.id_formulario}/respuesta/${this.$route.params.id_respuesta}/evaluar`;

      var headers = {
        Authorization: "Bearer " + this.$store.state.token
      };
      axios({
        method: "get",
        url: url,
        headers: headers
      })
        .then(response => {
          this.loading = false;
          let formulario = response.data.formulario;

          let campos = response.data.campos;
          formulario.secciones = response.data.secciones;

          campos.forEach((campo, index, arr) => {
            arr[index].tipo_input = JSON.parse(campo.tipo_input);
            arr[index].opciones = JSON.parse(campo.opciones);

            if (campo.id_tipo === 1 && campo.tipo_input.id === 2) {
              campo.opciones.forEach((opcion, index2, arr2) => {
                if (campo.respuesta.split(",").includes(opcion.nombre)) {
                  arr[index].opciones[index2].respuesta = opcion.nombre;
                } else {
                  arr[index].opciones[index2].respuesta = false;
                }
              });
            }

            if (campo.id_tipo === 3) {
              arr[index].arregloTable = JSON.parse(campo.arregloTable);
              let respuestas = JSON.parse(campo.respuesta);
              console.log({
                respuestas: respuestas,
                arregloTable: campo.arregloTable
              });

              arr[index].arregloTable.forEach(fila => {
                respuestas.forEach(r => {
                  fila.columns.forEach((c, idx, arr3) => {
                    let valorCol = r[fila.valor];
                    if (c.valor === valorCol) {
                      this.$set(c, "checked", true);
                    }
                  });
                });
              });
            }
            campo.imagen_url = campo.imagen;
            // campo.imagen = campo.imagen
            //   ? process.env.IMAGE_URL + '/formularios/' + campo.imagen
            //   : ''

            this.formulario = formulario;
            this.campos = campos;

            this.formulario_respuesta = response.data.formulario_respuesta;
            this.respuesta_campos = response.data.respuesta_campos;
          });
        })

        .catch(error => {
          this.loading = false;
          console.log({ error });

          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "fas fa-exclamation-triangle",
            message: error.response.data
          });

          if (error.response.status === 401) {
            this.removeCredentials();
            this.$router.push({
              name: "login"
            });
          }
        });
    }
  }
};
</script>
<style scoped>
.titulo {
  color: #027be3;
  font-weight: 600;
  text-align: center;
}

.border-bottom {
  border-bottom: 1px solid lightgray;
}

.nota {
  font-weight: 600;
  color: #027be3;
  text-align: right;
  justify-content: flex-end;
  display: flex;
  padding: 10px;
}
.nombreParticipante {
  font-weight: 600;
}
.ValorNota {
  font-weight: 500;
  color: #027be3;
}

.pregunta {
  color: black;
  font-weight: 400;
}

.numeronota {
  background-color: #027be3;
  padding: 10px;
  color: white;
  text-align: center;
}
.textonota {
  color: #027be3;
  padding: 10px;
}

.respuestaCorrecta {
  color: #1b5e20;
  padding: 10px;
}

.respuestaIncorrecta {
  color: #c10015;
  padding: 10px;
}
.textocentrado {
  text-align: center;
  width: 50px !important;
  padding: 10px;
  float: left;
  margin-right: 10px;
  height: fit-content;
}

ul {
  list-style: none;
}

ul li:before {
  content: "✓";
}
</style>
