import store from '../store/index'

//Centros
export function puedeVerCentros(){
  return !!(store.getters.accesos.filter(a => (a.id == 3 && a.ver == true)).length > 0)
}

export function puedeCrearCentros () {
  return !!(store.getters.accesos.filter(a => (a.id == 3 && a.crear == true)).length > 0)
}

export function puedeEditarCentros () {
  return !!(store.getters.accesos.filter(a => (a.id == 3 && a.editar == true)).length > 0)
}

export function puedeEliminarCentros () {
  return !!(store.getters.accesos.filter(a => (a.id == 3 && a.eliminar == true)).length > 0)
}



//Registro de cursos
export function puedeVerCursos () {
  return !!(store.getters.accesos.filter(a => (a.id == 5 && a.ver == true)).length > 0)
}

export function puedeCrearCursos () {
  return !!(store.getters.accesos.filter(a => (a.id == 5 && a.crear == true)).length > 0)
}
export function puedeEditarCursos () {
  return !!(store.getters.accesos.filter(a => (a.id == 5 && a.editar == true)).length > 0)
}

export function puedeEliminarCursos () {
  return !!(store.getters.accesos.filter(a => (a.id == 5 && a.eliminar == true)).length > 0)
}


//Ejecucion de cursos
export function puedeVerCursosEjecucion () {
  return !!(store.getters.accesos.filter(a => (a.id == 18 && a.ver == true)).length > 0)
}

export function puedeCrearCursosEjecucion () {
  return !!(store.getters.accesos.filter(a => (a.id == 18 && a.crear == true)).length > 0)
}
export function puedeEditarCursosEjecucion () {
  return !!(store.getters.accesos.filter(a => (a.id == 18 && a.editar == true)).length > 0)
}

export function puedeEliminarCursosEjecucion () {
  return !!(store.getters.accesos.filter(a => (a.id == 18 && a.eliminar == true)).length > 0)
}


//Inscripciones
export function puedeVerInscripciones () {
  return !!(store.getters.accesos.filter(a => (a.id == 13 && a.ver == true)).length > 0)
}

export function puedeCrearInscripciones () {
  return !!(store.getters.accesos.filter(a => (a.id == 13 && a.crear == true)).length > 0)
}
export function puedeEditarInscripciones () {
  return !!(store.getters.accesos.filter(a => (a.id == 13 && a.editar == true)).length > 0)
}

export function puedeEliminarInscripciones () {
  return !!(store.getters.accesos.filter(a => (a.id == 13 && a.eliminar == true)).length > 0)
}



//Participantes
export function puedeVerParticipantes () {
  return !!(store.getters.accesos.filter(a => (a.id == 6 && a.ver == true)).length > 0)
}

export function puedeCrearParticipantes () {
  return !!(store.getters.accesos.filter(a => (a.id == 6 && a.crear == true)).length > 0)
}
export function puedeEditarParticipantes () {
  return !!(store.getters.accesos.filter(a => (a.id == 6 && a.editar == true)).length > 0)
}

export function puedeEliminarParticipantes () {
  return !!(store.getters.accesos.filter(a => (a.id == 6 && a.eliminar == true)).length > 0)
}


//Test De Holland
export function puedeVerTestHolland () {
  return !!(store.getters.accesos.filter(a => (a.id == 19 && a.ver == true)).length > 0)
}

export function puedeCrearTestHolland () {
  return !!(store.getters.accesos.filter(a => (a.id == 19 && a.crear == true)).length > 0)
}
export function puedeEditarTestHolland () {
  return !!(store.getters.accesos.filter(a => (a.id == 19 && a.editar == true)).length > 0)
}

export function puedeEliminarTestHolland () {
  return !!(store.getters.accesos.filter(a => (a.id == 19 && a.eliminar == true)).length > 0)
}
