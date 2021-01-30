<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header elevated>
      <q-toolbar class="bg-white text-primary">
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <q-img
            src="statics/imagenes-plantilla/logo1.png"
            contain
            position="center"
            style="height: 80px;max-width: 200px;"
          ></q-img>
        </q-toolbar-title>

        <q-img
          src="statics/imagenes-plantilla/logo-cosude.png"
          contain
          position="center"
          style="height: 80px;max-width: 250px;margin:0px 30px;"
        ></q-img>

        <q-img
          src="statics/imagenes-plantilla/logo-swisscontact.png"
          contain
          position="center"
          style="height: 80px;max-width: 160px;margin:0px 30px;"
        ></q-img>

        <q-btn flat>
          <q-tooltip>Account</q-tooltip>
          <q-menu auto-close :offset="[-2, 10]">
            <q-list style="min-width: 170px">
              <q-item clickable>
                <q-item-section @click="logOut">Salir</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <span
            >&nbsp;
            {{ $store.state.user ? $store.state.user.nombre : "" }}</span
          >
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-style="background:url('statics/imagenes-plantilla/franja-menu.png'); hover:background-color:red;margin-left: -1px;"
    >
      <q-list>
        <div class="flex flex-center">
          <q-btn
            flat
            @click="$router.go(-1)"
            class="text-white"
            icon="arrow_left"
          >
            Regresar
          </q-btn>
        </div>
        <q-item-label header class="text-white"
          >Manual de Administador</q-item-label
        >

        <q-input
          ref="inputSearch"
          dark
          dense
          standout
          v-model="search"
          input-class="text-left"
          class="q-ml-md"
          debounce="300"
          @keydown.enter="searchText"
        >
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>

          <q-tree
            v-if="$store.state.user"
            color="white"
            :nodes="accesos"
            node-key="path"
            selected-color="teal"
            :selected.sync="selected"
            :handler="selectNode(selected)"
          />


        <!-- <div v-for="acceso in accesos" :key="acceso.label">
          <q-item clickable>
            <q-item-section>

              <q-item-label
                class="nivel1"
                @click="scrollToElement(getElement(acceso.path))"
                >{{ acceso.label }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </div> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { scroll } from "quasar";
import axios from "axios";
const { getScrollTarget, setScrollPosition } = scroll;

export default {
  name: "MyLayout",
  data() {
    return {
      selected: null,
      search: null,
      accesos: [
        {
          label: "Introducción",
          path: "#introduccion",


          children: [
            { label: "Inicio de sesión", path: "#iniciodesesion" },
            { label: "Entorno de la plataforma", path: "#entornoweb" },
            { label: "Dashboard", path: "#dashboard" }
          ]
        },

        {
          label: "Reportes",
          path: "#reportes",

          children: [
            {
              label: "Tipos de gráficos",
              path: "#tiposdegraficos",

              children: [
                {
                  label: "Gráfico de Rango de Área",
                  path: "#graficorangoarea"
                },
                { label: "Gráfico de Área Basica", path: "#graficoareabasica" },
                {
                  label: "Gráfico de Barras Basica",
                  path: "#graficobarrabasica"
                },
                { label: "Gráfico de Burbujas", path: "#graficodeburbujas" },
                { label: "Gráfico de Lineas", path: "#graficodelineas" },
                { label: "Gráfico de Embudo", path: "#graficodeembudo" },
                { label: "Gráfico de Pastel", path: "#graficodepastel" }
              ]
            },
            {
              label: "Controles de tabla dinamica",
              path: "#controlestabladinamica"
            }
          ]
        },
        {
          label: "Centros",
          path: "#centros",

          children: [
            {
              label: "Editar Centros",
              path: "#editarcentros"
            },
            {
              label: "Registrar Nuevo Centro",
              path: "#registrarcentro"
            }
          ]
        },
        {
          label: "Instructores",
          path: "#instructores",

          children: [
            {
              label: "Registrar Nuevo Instructor",
              path: "#registrarinstructores"
            },
            {
              label: "Editar Intructores",
              path: "#editarinstructores"
            }
          ]
        },
        {
          label: "Test De Holland",
          path: "#testdeholland",

          children: [
            {
              label: "Registrar Nuevo test",
              path: "#registrartest"
            },
            {
              label: "Editar, Eliminar, Ver Test",
              path: "#editartest"
            }
          ]
        },
        {
          label: "Cursos",
          path: "#cursos",

          children: [
            {
              label: "Registrar Nuevo Curso",
              path: "#registrarcurso"
            },
            {
              label: "Editar Cursos",
              path: "#editarcurso"
            },
            {
              label: "Eliminar Cursos",
              path: "#eliminarcurso"
            },
          ]
        },
        {
          label: "Ejecución De Curso",
          path: "#ejecuciondecurso",

          children: [
            {
              label: "Nuevo Curso",
              path: "#registrarejecuciondecurso"
            },
            {
              label: "Editar Ejecución De Curso",
              path: "#editarejecuciondecurso"
            },
          ]
        },
        {
          label: "Participantes",
          path: "#participante",

          children: [
            {
              label: "Ver, Editar, Inactivar ",
              path: "#editarinactivar"
            },

          ]
        },
        {
          label: "Inscripciones",
          path: "#inscripciones",
        },
        {
          label: "Formularios",
          path: "#formularios",
        },
        {
          label: "Usuarios",
          path: "#usuarios",

        },
        {
          label: "Roles",
          path: "#roles",

        },
        {
          label: "Accesos",
          path: "#accesos",

        },
        {
          label: "Permisos",
          path: "#permisos",

        },
        {
          label: "Bitácora",
          path: "#bitacora",
        }
      ],
      leftDrawerOpen: this.$q.platform.is.desktop
    };
  },

  methods: {
    removeCredentials() {
      this.$store.dispatch("removeCredentials");
    },
    searchText() {
      if (window.find(this.search, false, false, true, false, true)) {
        this.$nextTick(() => this.$refs.inputSearch.focus());
      }
    },
    getElement(selector) {
      return document.querySelector(selector);
    },
    scrollToElement(el) {
      console.log("entró a selected element");
      const target = getScrollTarget(el);
      const offset = el.offsetTop;
      const duration = 500;
      setScrollPosition(target, offset, duration);
    },
    logOut() {
      let url = process.env.API_URL + "/logout";
      axios
        .post(
          url,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + this.$store.state.token
            }
          }
        )
        .then(response => {
          this.removeCredentials();
          this.$router.push({
            name: "login"
          });
        })
        .catch(() => {
          this.removeCredentials();
          this.$router.push({
            name: "login"
          });
        });
    },
    selectNode(target) {
      console.log({ target });

      if (target && target !== null) {
        this.scrollToElement(document.querySelector(target));
      }
    }
  }
};
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

.nivel1 {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.q-item__section a {
  text-decoration: none;
}

.q-ml-md,
.q-mx-md {
  margin-left: 15px;
  margin-right: 15px;
}

.q-tree__node-header-content {
  color: white;
  font-size: 16px;
  font-weight: 400;
}
</style>
