const routes = [
  {
    path: '/admin/panel',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'indexPanel',
        path: '',
        component: () => import('pages/admin/Dashboard.vue'),
      },
    ],
  },
  {
    path: '/admin/centros/',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'centros',
        path: '',
        component: () => import('pages/admin/centros/Centros.vue'),
      },
    ],
  },
  {
    path: '/admin/centros/nuevo',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'nuevo_centro',
        path: '',
        component: () => import('pages/admin/centros/Centro.vue'),
      },
    ],
  },

  {
    path: '/admin/centros/:id/editar',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'editar_centro',
        path: '',
        component: () => import('pages/admin/centros/Centro.vue'),
      },
    ],
  },
  {
    path: '/catalogos/cursos',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'catalogo_cursos',
        path: '',
        component: () => import('pages/admin/cursos/CatalogoCursos.vue'),
      },
    ],
  },

  {
    path: '/admin/cursos',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'cursos',
        path: '',
        component: () => import('pages/admin/cursos/Cursos.vue'),
      },
    ],
  },

  {
    path: '/catalogos/cursos/nuevo',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'nuevo_catalogo_curso',
        path: '',
        component: () => import('pages/admin/cursos/CatalogoCurso.vue'),
      },
    ],
  },

  {
    path: '/admin/cursos/nuevo',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'nuevo_curso',
        path: '',
        component: () => import('pages/admin/cursos/Curso.vue'),
      },
    ],
  },
  {
    path: '/catalogos/cursos/:id/editar',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'editar_catalogo_curso',
        path: '',
        component: () => import('pages/admin/cursos/CatalogoCurso.vue'),
      },
    ],
  },

  {
    path: '/admin/cursos/:id/editar',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'editar_curso',
        path: '',
        component: () => import('pages/admin/cursos/Curso.vue'),
      },
    ],
  },
  {
    path: '/catalogos/cursos/:id/ver',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'ver_catalogo_curso',
        path: '',
        component: () => import('pages/admin/cursos/CatalogoCurso.vue'),
      },
    ],
  },

  {
    path: '/admin/cursos/:id/ver',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'ver_curso',
        path: '',
        component: () => import('pages/admin/cursos/Curso.vue'),
      },
    ],
  },
  {
    path: '/admin/instructores',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'Instructores',
        path: '',
        component: () => import('pages/admin/instructores/Instructores.vue'),
      },
    ],
  },
  {
    path: '/admin/instructores/nuevo',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'nuevo_instructor',
        path: '',
        component: () => import('pages/admin/instructores/Instructor.vue'),
      },
    ],
  },
  {
    path: '/admin/instructores/:id/editar',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'editar_instructor',
        path: '',
        component: () => import('pages/admin/instructores/Instructor.vue'),
      },
    ],
  },
  {
    path: '/admin/configuraciones',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'configuraciones',
        path: '',
        component: () => import('pages/admin/Configuraciones.vue'),
      },
    ],
  },
  {
    path: '/admin/formularios',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'formularios',
        path: '',
        component: () => import('pages/admin/formularios/Formularios.vue'),
      },
    ],
  },
  {
    path: '/admin/formularios/nuevo',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'nuevo_formulario',
        path: '',
        component: () => import('pages/admin/formularios/CrearFormulario.vue'),
      },
    ],
  },

  {
    path: '/imprimir-formulario/:id_formulario',
    name: 'imprimir_formulario',
    component: () => import('pages/admin/formularios/FormularioImprimir.vue'),
  },

  {
    meta: {
      requiresAuth: true,
    },
    path: '/resultados/formulario/:id_formulario/respuesta/:id_respuesta',
    component: () => import('layouts/DashboardLayout.vue'),

    children: [
      {
        name: 'respuesta_formulario',
        path: '',
        component: () => import('pages/admin/formularios/Respuesta.vue'),
      },
    ],
  },

  {
    meta: {
      requiresAuth: true,
    },
    path:
      '/resultados-imprimir/formulario/:id_formulario/respuesta/:id_respuesta',
    component: () => import('pages/admin/formularios/Respuesta.vue'),
    name: 'imprimir_respuesta_formulario',
  },

  {
    meta: {
      requiresAuth: true,
    },
    path:
      '/resultados/formulario/:id_formulario/respuesta/:id_respuesta/evaluar',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/admin/formularios/Evaluar.vue'),
        name: 'evaluar_respuesta',
      },
    ],
  },

  {
    path: '/admin/formularios/:id/ver',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'ver_formulario',
        path: '',
        component: () => import('pages/admin/formularios/CrearFormulario.vue'),
      },
    ],
  },

  {
    path: '/admin/formularios/:id/editar',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'editar_formulario',
        path: '',
        component: () => import('pages/admin/formularios/CrearFormulario.vue'),
      },
    ],
  },

  {
    path: '/admin/formularios/:id/duplicar',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'duplicar_formulario',
        path: '',
        component: () => import('pages/admin/formularios/CrearFormulario.vue'),
      },
    ],
  },

  {
    meta: {
      requiresAuth: 'none',
    },
    path: '/responder/formulario/:slug/',
    name: 'responder_formulario',
    component: () => import('pages/admin/formularios/FormularioResponder.vue'),
  },
  {
    meta: {
      requiresAuth: 'none',
    },
    path: '/responder/formulario/:slug/respuesta/:slug_respuesta',
    name: 'cargar_responder_formulario',
    component: () => import('pages/admin/formularios/FormularioResponder.vue'),
  },

  {
    meta: {
      requiresAuth: 'none',
    },
    path: '/admin/formularios/preview',
    name: 'vista_previa_formulario',
    component: () => import('pages/admin/formularios/VistaPrevia.vue'),
  },

  {
    meta: {
      requiresAuth: true,
    },
    path: '/respuestas/formulario/:id_formulario',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'respuestas_formulario',
        component: () => import('pages/admin/formularios/Respuestas.vue'),
      },
    ],
  },

  {
    path: '/usuario/verificar_correo/:email/:token',
    name: 'verificar_correo',
    component: () => import('pages/admin/usuarios/VerificarCorreo.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/usuario/cambiar_contrasenia/:email/:token',
    name: 'cambiar_contrasenia',
    component: () => import('pages/admin/usuarios/CambiarContrasenia.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/admin/participantes',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'Participantes',
        path: '',
        component: () => import('pages/admin/participantes/Participantes.vue'),
      },
    ],
  },
  {
    path: '/admin/participantes/nuevo',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'nuevo_participante',
        path: '',
        component: () => import('pages/admin/participantes/Participante.vue'),
      },
    ],
  },
  {
    path: '/admin/participantes/:id/editar',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'editar_participante',
        path: '',
        component: () => import('pages/admin/participantes/Participante.vue'),
      },
    ],
  },
  {
    path: '/admin/participantes/:id/ver',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'ver_participante',
        path: '',
        component: () => import('pages/admin/participantes/Participante.vue'),
      },
    ],
  },
  {
    path: '/admin/inscripciones/cursos/:id',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'curso_inscripciones',
        path: '',
        component: () => import('pages/admin/cursos/Inscripciones.vue'),
      },
    ],
  },
  {
    path: '/admin/inscripciones',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'todas_inscripciones',
        path: '',
        component: () => import('pages/admin/cursos/Inscripciones.vue'),
      },
    ],
  },
  {
    path: '/admin/inscripciones/curso/:idCurso/inscripcion/:idMatricula/editar',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'inscripcion_editar',
        path: '',
        component: () => import('pages/admin/cursos/Matricular.vue'),
      },
    ],
  },
  {
    path: '/admin/cursos/:idCurso/inscribir',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'matricular_curso',
        path: '',
        component: () => import('pages/admin/cursos/Matricular.vue'),
      },
    ],
  },
  // ROOT
  { path: '/', redirect: { name: 'inicio' } },

  {
    path: '/inicio',
    meta: {
      guest: true,
    },
    name: 'inicio',
    component: () => import('pages/PublicDashboard.vue'),
  },

  {
    path: '/admin/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'dashboard',
        path: '',
        component: () => import('pages/admin/Dashboard.vue'),
      },
    ],
  },

  {
    path: '/admin/reportes',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'reportes',
        path: '',
        component: () => import('pages/admin/reportes/Reportes.vue'),
      },
    ],
  },
  {
    path: '/admin/accesos',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'accesos',
        path: '',
        component: () => import('pages/admin/usuarios/Accesos.vue'),
      },
    ],
  },
  {
    path: '/admin/roles',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'roles',
        path: '',
        component: () => import('pages/admin/usuarios/Roles.vue'),
      },
    ],
  },

  {
    path: '/admin/bitacora',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'bitacora',
        path: '',
        component: () => import('pages/admin/usuarios/Bitacora.vue'),
      },
    ],
  },
  {
    path: '/admin/rolesAccesos',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'rolesAccesos',
        path: '',
        component: () => import('pages/admin/usuarios/RolesAccesos.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/admin/usuarios',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'usuarios',
        path: '',
        component: () => import('pages/admin/usuarios/Usuarios.vue'),
      },
    ],
  },
  {
    path: '/ayuda',

    component: () => import('layouts/ManualSidebar.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'ayuda',
        path: '',
        component: () => import('pages/Ayuda.vue'),
      },
    ],
  },
  {
    path: '/manual-administrador',
    component: () => import('pages/Ayuda.vue'),
  },
  {
    path: '/resetear-contrasenia',
    name: 'resetear-contrasenia',
    component: () => import('pages/admin/usuarios/ResetearContrasenia.vue'),
    meta: {
      guest: true,
    },
  },
  {
    path: '/formularios/test-holland',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'holland-listado',
        component: () => import('pages/admin/formularios/HollandListado.vue'),
        path: '',
      },
    ],
  },
  {
    path: '/formularios/test-holland/nuevo',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'holland-nuevo',
        component: () => import('pages/admin/formularios/HollandTest.vue'),
        path: '',
      },
    ],
  },

  {
    path: '/formularios/test-holland/:idTest/editar',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'holland-editar',
        component: () => import('pages/admin/formularios/HollandTest.vue'),
        path: '',
      },
    ],
  },
  {
    path: '/formularios/test-holland/:token/respuestas',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'holland-respuestas',
        component: () =>
          import('pages/admin/formularios/HollandRespuestas.vue'),
        path: '',
      },
    ],
  },
  {
    path: '/formularios/test-holland/:token/resultado/:idResultado',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'holland-resultado',
        component: () => import('pages/admin/formularios/HollandResultado.vue'),
        path: '',
      },
    ],
  },
  {
    path: '/formularios/test-holland/:token/responder',
    component: () => import('pages/admin/formularios/HollandResponder.vue'),
    meta: {
      name: 'responder-holland',
      requiresAuth: 'none',
    },
  },
  {
    path: '/correo_prueba',

    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'corre_prueba',
        path: '',
        component: () => import('pages/admin/CorreoPrueba.vue'),
      },
    ],
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  })
}

export default routes
