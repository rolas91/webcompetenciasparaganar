<template>
  <div class="opcionContainer">
    <!-- TITULO -->
    <label class="numeracion">{{(index+1)+ '.' }}</label>

    <div class="optionTopbar">

     <q-btn
        flat
        class="btnTopNavbar"
        color="black"
        icon="content_copy"
        @click="copiarElemento"
        :disable="readonly"
      ></q-btn>

      <q-btn
        flat
        class="btnTopNavbar"
        color="black"
        icon="arrow_upward"
        :disable="readonly ||  !puedeSubir"
        @click="moverArriba"
      ></q-btn>

      <q-btn
        flat
        class="btnTopNavbar"
        color="black"
        icon="arrow_downward"
        :disable="readonly || !puedeBajar"
        @click="moverAbajo"
      ></q-btn>

      <q-btn :disable="readonly" flat class="btnTopNavbar" color="black" icon="delete_forever" @click="eliminarCampo"></q-btn>
    </div>
    <Opcion :readonly="readonly" ref="opcion" v-if="campo.id_tipo ===1" :campo="campo" :showNota="idTipoFormulario ===5561" @actualizarNota="actualizarNota"></Opcion>
    <Texto :readonly="readonly" ref="texto" v-else-if="campo.id_tipo ===2" :campo="campo" :showNota="idTipoFormulario ===5561" @actualizarNota="actualizarNota"></Texto>
    <Tabla :readonly="readonly" ref="tabla" v-if="campo.id_tipo ===3" :campo="campo" :showNota="idTipoFormulario ===5561"
    @actualizarNota="actualizarNota"
    @actualizarArregloTabla="actualizarArregloTabla"
    @updateNotaTabla="updateNotaTabla"
    ></Tabla>

    <Departamento :readonly="readonly" ref="opcion" v-if="campo.id_tipo ===4" :campo="campo" :showNota="idTipoFormulario ===5561"
    @actualizarNota="actualizarNota"
    @DepartamentoSelected="DepartamentoSelected(campo)"
    ></Departamento>
    <Municipio :readonly="readonly" ref="opcion" v-if="campo.id_tipo ===5" :campo="campo" :showNota="idTipoFormulario ===5561" @actualizarNota="actualizarNota" @recargarMunicipios="recargarMunicipios"></Municipio>
    <Valoracion :readonly="readonly" ref="opcion" v-if="campo.id_tipo ===6" :campo="campo" :showNota="idTipoFormulario ===5561"  @actualizarNota="actualizarNota" />
  </div>
</template>
<script>
import Opcion from './Opcion'
import Texto from './Texto'
import Tabla from './Tabla'
import Departamento from './Departamento'
import Municipio from './Municipio'
import Valoracion from './Valoracion'
export default {
  name: 'FormularioItem',
  components: { Opcion, Texto, Tabla, Departamento, Municipio, Valoracion },
  props: ['index', 'puedeSubir', 'puedeBajar', 'campo', 'idTipoFormulario', 'readonly'],
  methods: {
    DepartamentoSelected (campo) {
      this.$emit('DepartamentoSelected', campo)
    },
    moverArriba () {
      this.$emit('moverArriba')
    },
    moverAbajo () {
      this.$emit('moverAbajo')
    },
    eliminarCampo () {
      this.$emit('eliminarCampo')
    },
    copiarElemento () {
      this.$emit('copiarElemento')
    },
    actualizarNota () {
      this.$emit('actualizarNota')
    },
    actualizarArregloTabla () {
      this.$emit('actualizarArregloTabla')
    },
    updateNotaTabla () {
      this.$emit('updateNotaTabla')
    },
    recargarMunicipios(){
      this.$emit('recargarMunicipios')
    }
  }
}
</script>
<style >
.opcionContainer {
  background-color: #f7f7f7;
  margin: 10px 0px 0px 0px;
  padding: 5px;
}

.opcionContainer:hover {
  background-color: #e6e6e6;
}
.numeracion {
  display: flex;
  position: relative;
  top: 90px;
  left: 5px;
  font-weight: bold;
  padding-right: 10px;
}
.optionTopbar {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 5px;
  padding-right: 15px;
}

</style>
