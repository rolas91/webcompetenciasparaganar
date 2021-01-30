<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header elevated>
      <q-toolbar class="bg-white text-primary">
        <q-btn flat dense round aria-label="Menu" @click="toggleDrawer">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <q-img
            src="statics/imagenes-plantilla/logo1.png"
            contain
            position="center"
            style="height: 80px; max-width: 200px;"
          ></q-img>
        </q-toolbar-title>

        <q-img
          src="statics/imagenes-plantilla/logo-cosude.png"
          contain
          position="center"
          style="height: 80px; max-width: 250px; margin: 0px 30px;"
        ></q-img>

        <q-img
          src="statics/imagenes-plantilla/logo-swisscontact.png"
          contain
          position="center"
          style="height: 80px; max-width: 160px; margin: 0px 30px;"
        ></q-img>

        <q-btn flat>
          <q-tooltip>Account</q-tooltip>
          <q-menu auto-close :offset="[-2, 10]">
            <q-list style="min-width: 170px;">
              <q-item clickable>
                <q-item-section @click="logOut">Salir</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <span>
            &nbsp; {{ $store.state.user ? $store.state.user.nombre : '' }}
          </span>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      :mini="miniState"
      v-model="$store.state.leftDrawerOpen"
      bordered
      content-style="background:url('statics/imagenes-plantilla/franja-menu.png'); hover:background-color:red;margin-left: -1px;    background-repeat: round;"
    >
      <q-list>
        <q-item-label header class="text-white">Menú Principal</q-item-label>
        <div v-for="acceso in this.$store.state.accesos" :key="acceso.id">
          <div v-if="$store.state.internetAvailable">
            <q-item v-if="acceso.ver" clickable :to="acceso.path">
              <q-item-section avatar>
                <q-icon class="text-white" :name="acceso.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white" :title="acceso.descripcion">
                  {{ acceso.nombre }}

                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div v-else>
            <q-item
              v-if="acceso.nombre === 'Formularios'"
              clickable
              :to="acceso.path"
            >
              <q-item-section avatar>
                <q-icon class="text-white" :name="acceso.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white" :title="acceso.descripcion">
                  {{ acceso.nombre }}

                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-ajax-bar
        ref="bar"
        position="top"
        color="accent"
        size="10px"
        skip-hijack
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios'
import { getRepository } from 'typeorm'
export default {
  name: 'MyLayout',
  data() {
    return {
      syncInProgress: false,
      miniState: false,
    }
  },
  created() {
    if (!this.$store.getters.online && this.$q.platform.is.mobile) {
      window.addEventListener('offline', this.handleOffline)
      window.addEventListener('online', this.handleOnline)
      this.syncData()
      this.$store.commit('setLeftDrawerOpen', false)
    } else {
      this.$store.commit('setLeftDrawerOpen', true)
    }
  },
  destroyed() {
    if (!this.$store.getters.online && this.$q.platform.is.mobile) {
      window.removeEventListener('offline', this.handleOffline)
      window.removeEventListener('online', this.handleOnline)
    }
  },
  methods: {
    logOut() {
      let url = process.env.API_URL + '/logout'
      axios
        .post(
          url,
          {},
          {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.$store.state.token,
            },
          },
        )
        .then((response) => {
          this.removeCredentials()
          this.$router.push({
            name: 'login',
          })
        })
        .catch(() => {
          this.removeCredentials()
          this.$router.push({
            name: 'login',
          })
        })
    },
    async CargarFormularios() {
      var url = process.env.API_URL + '/admin/formularios'
      this.loading = true
      this.loadingTable = true
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        mobile: true,
      }

      try {
        let response = await axios.get(url, {
          params: params,
          headers: headers,
        })
        let formularios = response.data.formularios.data

        let formRepo = getRepository('Formulario')
        let formFinales = []
        for (let index = 0; index < formularios.length; index++) {
          let datosForm = await this.CargarDatosFormulario(
            formularios[index].url,
          )
          if (datosForm) {
            console.log('Datos del formulario--REVISAR CAMPOS', datosForm)
            let tmp = {
              duracion: datosForm.duracion,
              fecha_fin: datosForm.fecha_fin,
              fecha_inicio: datosForm.fecha_inicio,
              id: datosForm.id,
              id_modo: datosForm.id_modo,
              nombre: datosForm.nombre,
              nota_maxima: datosForm.nota_maxima,
              secciones: JSON.stringify(datosForm.secciones),
              url: datosForm.url,
            }
            formFinales.push(tmp)
          } else {
            console.error(
              'No se obtuvo datos para este formulario',
              formularios[index],
            )
          }
        }
        let f = await formRepo.save(formFinales)
        console.log('Formularios finales', f)
      } catch (error) {
        this.loading = false
        console.log('Error al obtener lista de formlarios', { error })
      }
    },
    async CargarDatosFormulario(slug) {
      if (slug === undefined || slug === '') return

      this.loading = true
      var url = process.env.API_URL + `/responder/formulario/${slug}`

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        mobile: true,
      }

      try {
        let response = await axios.get(url, {
          params: params,
          headers: headers,
        })

        let formulario = response.data.formulario
        let campos = response.data.campos
        console.log('CAMPOS', { campos })
        formulario.secciones = response.data.secciones
        campos.forEach((item, index, arr) => {
          arr[index].tipo_input = JSON.parse(item.tipo_input)
          arr[index].opciones = JSON.parse(item.opciones)
        })

        formulario.secciones.forEach((seccion, index, arr) => {
          arr[index].campos = campos.filter(
            (campo) => campo.id_seccion === seccion.id,
          )
        })
        return formulario
      } catch (error) {
        this.loading = false
        console.log('Error creando el formulario', { error })
        if (error.response.status === 401) {
          this.removeCredentials()
          this.$router.push({
            name: 'login',
          })
        } else {
          return null
        }
      }
    },
    async CargarCentros() {
      var url = process.env.API_URL + '/catalogos/centros_cursos'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      let params = {
        mobile: true,
      }
      try {
        var response = await axios.get(url, {
          params: params,
          headers: headers,
        })
        var centros = response.data.centros
        console.log('Centros', { centros })
        let centroRepository = getRepository('Centro')
        let cursoRepository = getRepository('Curso')
        await centroRepository.save(centros)
        let centrosGuardados = await centroRepository.find()
        let allCursos = []
        for (let index = 0; index < centrosGuardados.length; index++) {
          try {
            let respuesta = await this.CargarCursos(centrosGuardados[index].id)
            let cursos = respuesta.data.cursos
            if (cursos) {
              let finalCursos = []
              for (let index = 0; index < cursos.length; index++) {
                const element = cursos[index]
                if (element.nombre && element.id) {
                  finalCursos.push(element)
                  allCursos.push(element)
                }
              }
              centrosGuardados[index].cursos = finalCursos
            }
          } catch (error) {
            console.log('Error getting cursos', error)
          }
        }
        if (allCursos.length > 0) {
          await cursoRepository.save(allCursos)
        }
        let centrosConCursos = await centroRepository.save(centrosGuardados)
        console.log('Centros con cursos', centrosConCursos)
      } catch (error) {
        console.error('Error updating centros', { error }, this.syncInProgress)
        if (error.response.status === 401) {
          this.logOut()
        }
      }
    },

    async CargarCursos(idCentro) {
      if (!idCentro) {
        return
      }

      this.loadingCursos = true

      var url = process.env.API_URL + '/catalogos/cursos'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        id_centro: idCentro,
        mobile: true,
      }
      return axios.get(url, {
        params: params,
        headers: headers,
      })
    },
    async CargarCursosMatriculas() {
      this.loadingCursosMatriculas = true
      var url = process.env.API_URL + '/admin/cursos_matriculas'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }
      try {
        let response = await axios.get(url, {
          params: {
            mobile: true,
          },
          headers: headers,
        })
        let cursosMatriculas = response.data.cursos_matriculas.data
        let repoMatricula = getRepository('Matriculas')
        cursosMatriculas.map(function (matricula) {
          let m = {
            id: matricula.id,
            id_curso: matricula.id_curso,
            id_participante: matricula.id_participante,
            nombre:
              matricula.nombres_participante +
              ' ' +
              matricula.apellidos_participante,
            documento_identidad: matricula.documento_identidad,
            telefono: matricula.telefono,
            correo: matricula.correo,
            data: JSON.stringify(matricula),
          }
          repoMatricula.save(m).catch((error) => {
            console.error('Errors found', error)
          })
        })
      } catch (error) {
        if (error.response.status === 401) {
          this.removeCredentials()
          this.$router.push({
            name: 'login',
          })
        }
      }
    },
    async CargarTiposFormularios() {
      var method = 'get'
      var url = process.env.API_URL + '/catalogos/tipos_formularios'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        mobile: true,
      }

      axios({
        method: method,
        url: url,
        params: params,
        headers: headers,
      })
        .then((response) => {
          let tiposFormularios = response.data.tipos_formularios
          console.log('Formularios', { tiposFormularios })
          let repoTipoMatriculas = getRepository('TipoFormulario')
          let finalEls = []
          for (let index = 0; index < tiposFormularios.length; index++) {
            const element = tiposFormularios[index]
            let m = {
              id: element.id,
              nombre: element.nombre,
            }
            finalEls.push(m)
          }
          repoTipoMatriculas.save(finalEls)
        })
        .catch((error) => {
          console.error('Error saving tipo forms', { error })
          if (error.response.status === 401) {
            this.removeCredentials()
            this.$router.push({
              name: 'login',
            })
          }
        })
    },

    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },
    /**
     * Ejecutado únicamente cuando somos móvil
     */
    async syncData() {
      console.log('syncing data var: ', this.$q.platform)
      console.log('syncing data')
      if (!!this.$store.getters.online && this.$q.platform.is.mobile) {
        return
      }

      this.syncInProgress = true
      const bar = this.$refs.bar
      if (bar) {
        bar.start()
      }

      console.log('syncing data..', this.syncInProgress)
      try {
        await this.CargarDepartamentos()
      } catch (e) {
        console.error('Error loading depts', e)
      }
      try {
        await this.CargarCentros()
      } catch (e) {
        console.error('Error loading centros', e)
      }
      try {
        await this.CargarFormularios()
      } catch (e) {
        console.error('Error cargando', e)
      }
      try {
        await this.CargarCursosMatriculas()
      } catch (e) {
        console.error('Error cargando', e)
      }
      try {
        await this.CargarTiposFormularios()
      } catch (e) {
        console.error('Error cargando', e)
      }
      this.syncInProgress = false
      if (this.$refs.bar) {
        this.$refs.bar.stop()
      }
    },
    handleOffline(event) {
      console.log('App went offline!', event)
      this.$store.commit('setInternetAvailable', false)
      this.syncInProgress = false
    },
    handleOnline(event) {
      console.log('App is now online!', event)
      this.$store.commit('setInternetAvailable', true)
      if (!this.syncInProgress) this.syncData()
    },
    async CargarDepartamentos() {
      var url = process.env.API_URL + '/catalogos/departamentos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: '',
        id_padre: 1438,
        mobile: true,
      }
      try {
        let response = await axios.get(url, { params, headers })
        let departamentos = response.data.departamentos
        console.log('Departamentos cargados', { departamentos })
        const repoDepartamentos = getRepository('Departamento')
        const repoMuns = getRepository('Municipio')
        for (let i = 0; i < departamentos.length; i++) {
          const dep = departamentos[i]
          let savedDep = await repoDepartamentos.save(dep)
          console.log('Dep', { savedDep })
          let municipios = await this.CargarMunicipios(dep.id)
          municipios.forEach((item, index, array) => {
            array[index].departamento = savedDep
          })
          let savedMun = await repoMuns.save(municipios)
          savedDep.municipios = savedMun
          await repoDepartamentos.save(savedDep)
        }
      } catch (error) {
        console.error('Error loading departamentos', { error })
        if (error.response.status === 401) {
          this.removeCredentials()
          this.$router.push({
            name: 'login',
          })
        }
      }
    },
    async CargarMunicipios(idDepartamento) {
      var url = process.env.API_URL + '/catalogos/municipios'
      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        filtro: '',
        id_padre: idDepartamento,
      }
      const data = await axios.get(url, { headers, params })
      return data.data.municipios
    },
    toggleDrawer() {
      //si es mobil y esta abierto es tamanio normal
      if (!this.$store.getters.online && this.$q.platform.is.mobile) {
        //Si esta abierto y está grande entonces lo hacemos mini
        if (this.$store.state.leftDrawerOpen && !this.miniState) {
          this.miniState = true
          return
        }

        //Si está abierto y esta mini entonces lo hacemos grande
        if (this.$store.state.leftDrawerOpen && this.miniState) {
          this.miniState = false
          return
        }

        //si está cerrado abrimos
        if (!this.$store.state.leftDrawerOpen && !this.miniState) {
          this.$store.commit('setLeftDrawerOpen', true)
          this.miniState = false
        }

        return
      }

      this.$store.commit('setLeftDrawerOpen', !this.$store.state.leftDrawerOpen)
    },
  },
}
</script>

<style>
body.desktop .q-hoverable:hover > .q-focus-helper {
  background: currentColor;
  opacity: -0.25;
}

.q-router-link--active {
  background-color: #337cbb;
}
.fit {
  width: calc(100% + 1px) !important;
}

.q-field--float .q-field__label,
.q-field--labeled .q-field__native,
.q-field__label {
  margin-left: 5px;
}
</style>
