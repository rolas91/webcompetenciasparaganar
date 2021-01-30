<template>
  <q-page>
    <div class="flex flex-center" style="width:100%;margin:auto;">
      <q-img style="" src="statics/imagenes-manuales/portada-min.jpeg"></q-img>
    </div>

    <div id="introduccion">
      <div class="bloque">
        <p class="titulo1">INTRODUCCIÓN</p>
        <p class="parrafo">
          El programa Competencias Para Ganar de Swisscontact, como parte de su
          compromiso para la modernización de los procesos de formación. Realiza
          la presentación de la plataforma www.competenciasparaganar.com, una
          herramienta eﬁcaz para el uso de los Responsables de Centros de
          Formación Profesional, Tutores y Estudiante, con el ﬁn de digitalizar
          los procesos de informe.
        </p>
        <p class="parrafo">
          Esta Plataforma permite remitir los reportes tradicionales, de manera
          virtualizada, generando los reportes de manera más funcional,
          visualmente más atractivo, en menor tiempo y con la posibilidad que
          generar los datos estadísticos.
        </p>
        <p class="parrafo">
          A continuación, te presentamos un paso a paso de cada una de las
          funcionalidades de esta plataforma.
        </p>
      </div>
    </div>

    <div id="iniciodesesion">
      <div class="bloque">
        <p class="titulo1">INICIO DE SESIÓN</p>

        <p class="parrafo">
          Ingresar a la dirección web www.competenciasparaganar.com,
          visualizamos un mapa de Nicaragua donde se puede ver la presencia del
          programa Competencia Para Ganar, en la parte superior izquierda de la
          página, dar clic en INICIO DE SESIÓN, esto nos redirigirá a una página
          donde tendremos que introducir las credenciales, las cuales son el
          correo electrónico y contraseña y presionar el botón “ENTRAR”.
        </p>

        <q-img
          src="statics/imagenes-manuales/mapa-incio3-min.png"
          style="margin-top:50px;"
        ></q-img>
      </div>
    </div>

    <div id="entornoweb">
      <div class="bloque">
        <div class="titulo1">ENTORNO DE LA PLATAFORMA WEB</div>

        <p class="parrafo">
          Una vez hemos ingresado, podremos visualizar la parte interna de la
          página.
        </p>
        <p class="parrafo">
          En la parte izquierda de la plataforma podemos visualizar Menú
          Principal, el cual destaca por ser una columna color azul en la cual
          podremos ver los siguientes ítems: Dashboard, Reportes, Centros,
          Instructores, Cursos, Participantes, Formularios, Usuarios, Roles,
          Permisos, y Tests de Holland.
        </p>
        <p class="parrafo">
          A la par del logo de Competencias Para Ganar está un ícono de tres
          líneas donde puede aparecer y desaparecer la columna de Menú
          Principal. Ahora procederemos a ver las funcionalidades y
          procedimientos de uso para cada uno de los Ítems:
        </p>
      </div>
    </div>

    <div id="dashboard">
      <div class="bloque">
        <div class="titulo1">Dashboard</div>

        <p class="parrafo">
          Esta opción nos permite ver la información general de los centros y
          los cursos ofertados por los Centros de formación profesional.
        </p>
        <q-img
          src="statics/imagenes-manuales/dashboard-interno.png"
          style="margin-top:50px;"
        ></q-img>
      </div>
    </div>

    <div id="reportes">
      <div class="bloque">
        <div class="titulo1">
          Reportes
        </div>

        <p class="parrafo">
          Permite recopilar toda la información vertida a través de las bases de
          datos, con el objetivo de poder visualizar de manera interactiva cada
          uno de los datos, como son la información por curso y todos lo
          respectivo a los datos de los participantes, sus edades, sexo,
          ubicación, grado académico, centro de formación profesional, puntos de
          cursos que se imparten, participantes.
        </p>

        <p class="parrafo">
          Se puede crear un Reporte y guardarlo para tener esos datos ya
          predeﬁnidos. Por ejemplo: Crear un Reporte que nos segmente
          participantes mujeres entre 18 y 24 años de edad.
        </p>

        <p class="parrafo">
          A continuación, se muestra las partes de la pantalla de reportes y los
          controles que permiten la generación de los mismos:
        </p>

        <q-img
          src="statics/imagenes-manuales/partes-reportes-min.png"
          style="margin-top:50px;"
        ></q-img>

        <div class="row">
          <div class="col-12 col-md-6">
            <p class="parrafo">
              El Selector de reportes (Esquemas y Base de datos): Este campo nos
              permite seleccionar los reportes que vayamos guardando, este mismo
              posee información del esquema utilizado en la tabla dinámica, así
              como la fuente de datos y el gráﬁco.
            </p>
            <p class="parrafo">
              Fuente de datos: Este campo nos permite cambiar la base de datos
              que deseamos visualizar manteniendo el esquema actual conﬁgurado
              en la tabla dinámica.
            </p>
            <p class="parrafo">
              Botón crear: Este botón nos permite guardar un nuevo reporte, esto
              incluye el esquema y formatos en la tabla dinámica, el gráﬁco y la
              fuente de datos.
            </p>
          </div>

          <div class="col-12 col-md-6">
            <p class="parrafo">
              Botón editar: A diferencia del botón de “crear” este nos permite
              editar/actualizar un reporte que hayamos conﬁgurado previamente.
            </p>
            <p class="parrafo">
              Tipos de gráﬁcos: Este control nos permite seleccionar el tipo de
              gráﬁco vinculado a la tabla dinámica, por lo que el tipo de gráﬁco
              disponible va dependiendo del tipo de reporte que tengamos
              conﬁgurado en nuestra tabla dinámica.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div id="tiposdegraficos">
      <div class="bloque">
        <div class="titulo1">Tipo de gráfico</div>

        <p class="parrafo">
          Los gráﬁcos disponibles son los siguientes:
        </p>

        <p id="graficorangoarea" class="parrafo text-centered">Rango de área</p>

        <q-img
          src="statics/imagenes-manuales/Rango de area.png"
          style="margin-top:50px;"
        ></q-img>

        <p id="graficoareabasica" class="parrafo text-centered">Área básica</p>

        <q-img
          src="statics/imagenes-manuales/Grafico area basica.png"
          style="margin-top:50px;"
        ></q-img>

        <p id="graficobarrabasica" class="parrafo text-centered">
          Barra básica
        </p>

        <q-img
          src="statics/imagenes-manuales/grafico barra basica.png"
          style="margin-top:50px;"
        ></q-img>

        <p id="graficocolumnabasica" class="parrafo text-centered">
          Columna básica
        </p>

        <q-img
          src="statics/imagenes-manuales/grafico columna basica.png"
          style="margin-top:50px;"
        ></q-img>

        <p id="graficodeburbujas" class="parrafo text-centered">
          Gráfico de Burbujas
        </p>

        <q-img
          src="statics/imagenes-manuales/grafico de burbujas.png"
          style="margin-top:50px;"
        ></q-img>

        <p id="graficodelineas" class="parrafo text-centered">
          Gráfico de Líneas
        </p>

        <q-img
          src="statics/imagenes-manuales/grafico de lineas.png"
          style="margin-top:50px;"
        ></q-img>

        <div class="row">
          <div class="col-12 col-md-4">
            <p id="graficodeembudo" class="parrafo text-centered">
              Gráfico de Embudo
            </p>

            <q-img
              src="statics/imagenes-manuales/grafico de embudo.png"
              style="margin-top:50px;"
            ></q-img>
          </div>

          <div class="col-12 col-md-4">
            <p id="graficodepastel" class="parrafo text-centered">
              Gráfico de Pastel
            </p>

            <q-img
              src="statics/imagenes-manuales/grafico de pastel copia..png"
              style="margin-top:50px;"
            ></q-img>
          </div>

          <div class="col-12 col-md-4">
            <p class="parrafo text-centered">Gráfico de pirámide</p>

            <q-img
              src="statics/imagenes-manuales/Grafico de piramide.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>

        <div class="row"></div>

        <p class="parrafo text-centered">Diagrama de dispersión</p>

        <q-img
          src="statics/imagenes-manuales/grafico de dispersion.png"
          style="margin-top:50px;"
        ></q-img>
      </div>
    </div>

    <div id="controlestabladinamica">
      <div class="bloque">
        <div class="titulo1">CONTROLES DE TABLA DINÁMICA</div>

        <div class="row">
          <div class="col-12 col-md-6">
            <p class="parrafo">
              Exportar: Esta opción nos permite exportar la información
              visualizada en la tabla dinámica, es decir si cambiamos el formato
              también cambia la información a exportar.
            </p>
          </div>
          <div class="col-12 col-md-6">
            <p class="parrafo">
              Formato de celdas: En la imagen de abajo se ilustra un ejemplo en
              el que se requiere formatear los datos ya que se quiere presentar
              los porcentajes sin decimales.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-img
              src="statics/imagenes-manuales/menu exportar.png"
              style="margin-top:50px;width:250px"
            ></q-img>
          </div>
          <div class="col-12 col-md-6">
            <q-img
              src="statics/imagenes-manuales/reporte no-formato.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>

        <p class="parrafo " style="">
          Para dar formato a la tabla le damos click al boton “Formato“ y luego
          “Formato de celdas”
        </p>

        <q-img
          src="statics/imagenes-manuales/menu-formato.png"
          style="margin-top:50px;width:60%"
        ></q-img>

        <p class="parrafo">
          Seleccionamos el campo al que le aplicaremos el formato, en este caso
          el campo se llama “Porcentaje de formulario” y seleccionamos en la
          opcion lugares decimales 0.
        </p>

        <p class="parrafo">
          Adicionalmente podemos conﬁgurar los siguientes valores:
        </p>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-img
              src="statics/imagenes-manuales/formato-celdas.png"
              style="margin-top:50px;width:70%"
            ></q-img>
          </div>

          <div class="col-12 col-md-6">
            <p class="parrafo">
              Texto alineado: podemos elegir entre las opciones
            </p>

            <p class="parrafo">
              Izquierdo y Derecho.
            </p>

            <p class="parrafo">
              Mil separadores: , . Espacio y Ninguna.
            </p>
            <p class="parrafo">
              Separador decimal: podemos elegir . o , dependiendo del formato
              deseado.
            </p>
            <p class="parrafo">
              Lugares decimales: Ninguna y de 0 a 9.
            </p>
            <p class="parrafo">
              Símbolo de moneda: escribimos el simbolo de la moneda que queramos
              utilizar.
            </p>
            <p class="parrafo">
              La moneda se alinea: Izquierda y derecho.
            </p>

            <p class="parrafo">
              Valor nulo: podemos deﬁnir un valor por defecto cuando el valor
              sea nulo (vacío).
            </p>

            <p></p>
            <p class="parrafo">
              Formato como porcentaje: podemos seleccionar si deseamos formatear
              el valor como decimal o no. (Cierto y Falso).
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-img
              src="statics/imagenes-manuales/ejemplo-formato-celda.png"
              style="margin-top:50px;width:70%"
            ></q-img>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6">
            <p class="parrafo">
              Formato condicional:
            </p>

            <p class="parrafo">
              Si queremos aplicar formato condicional en base a los valores de
              la tabla dinámica, realizaremos un ejemplo en el cual queremos
              resaltar los municipios donde las mujeres sean igual a 0.
            </p>

            <p class="parrafo">
              Abrimos el menú formato y seleccionamos la opción de formato
              condicional.
            </p>

            <q-img
              src="statics/imagenes-manuales/menu-formato.png"
              style="margin-top:50px;width:70%"
            ></q-img>

            <p class="parrafo">
              Luego le damos al boton de +
            </p>

            <q-img
              src="statics/imagenes-manuales/agregar formato condicional.png"
              style="margin-top:50px;width:70%"
            ></q-img>

            <p class="parrafo">
              Luego seleccionamos la columna que deseamos aplicar el formato y
              deﬁnimos las condiciones, en este caso en especíﬁco, seleccionamos
              la opción “Menos que o igual a 5” aplicamos un formato con tipo de
              fuente Arial 12px, fondo rojo y color de letra blanco.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-img
              src="statics/imagenes-manuales/ejemplo-formato-condicional.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
          <div class="col-12 col-md-6">
            <q-img
              src="statics/imagenes-manuales/formato-condicional-ejemplo.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
          <div class="col-12 col-md-6">
            <q-img
              src="statics/imagenes-manuales/opciones menu.png"
              style="margin-top:50px;width:70%"
            ></q-img>
          </div>

          <div class="col-12 col-md-6">
            <p class="parrafo">
              En esta opción podemos realizar la conﬁguración de la presentación
              de la tabla dinámica, podemos quitar o mostrar los totales y los
              subtotales , tanto como ﬁlas como para columnas y podemos escoger
              entre 3 distintos formatos de diseño de la tabla.
            </p>

            <p class="parrafo">
              Forma compacta: Este formato permite agrupar las columnas y las
              ﬁlas de modo que se muestre la información colapsada en la misma
              ﬁla o columna.
            </p>
          </div>
        </div>

        <div class="row"></div>
      </div>
    </div>
    <div v-if="PuedeVerCentros" id="centros">
      <div class="bloque">
        <div class="titulo1">CENTROS</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              En este ítem, se podrá observar todos los centros asociados
              swisscontact, se podrá obtener Nombre del Centro,Fotografía
              Representante, Departamento de ubicación, Municipio, Estado (Si el
              Centro está funcionando o no), Dirección, Contacto Nombre (Persona
              encargada del centro), Telefónico del Contacto, Correo, Teléfono
              del Centro, Teléfono del Centro, Correo del Centro y Web. En
              pantalla se podrán ver los botones de Nuevo, Actualizar tabla,
              Búsqueda, y si se desea, la opción para descargar los datos en una
              hoja de excel.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-04(Centro).png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div v-if="$store.state.user.rol==1 || $store.state.user.rol==4" id="editarcentros">
      <div class="bloque">
        <div class="titulo1">EDITAR CENTROS</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              Cuando se selecciona un Centro creado, aparecen los botones de
              Editar e Inactivar. El botón Editar, le redirigirá a los datos del
              Centro seleccionado y se podrá cambiar los datos de los campos de
              información.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-05 (selección centro creado).png"
              style="margin-top:50px;"
            ></q-img>
            <div class="parrafo">
              Cuando se dé clic en el botón inactivar este será para dar de baja
              al centro, de su función y no se eliminan los datos.
            </div>
            <q-img
              src="statics/imagenes-manuales/manual-06 (Inactivar centro).png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div v-if="$store.state.user.rol==1 || $store.state.user.rol==4" id="registrarcentro">
      <div class="bloque">
        <div class="titulo1">REGISTRAR CENTROS</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              En el botón de nuevo, se podrá agregar un nuevo centro, una vez
              dentro de nuevo se podrán encontrar los campos de información
              tales como:
              <ul>
                  <li>Seleccionar (Para adjuntar una foto del Centro) Nombre</li>
                  <li>Nombre<li>
                  <li>Tipo de Centro (Centro de Formación Técnica o Centro de Capacitaciones a emprendedores)</li>
                  <li>País (Predeterminado para Nicaragua)</li>
                  <li>Departamento </li>
                  <li>Municipio </li>
                  <li>escripción (Detalles de alineamiento de cursos que dan, sector en el que trabajan y datosrelevantes que la institución crea importante reflejar en ese cuadro) </li>
                  <li>Lema </li>
                  <li>¿Quiénes somos? </li>
                  <li>Misión</li>
                  <li>Visión</li>
                  <li>Valores</li>
                  <li>Seleccionar(Para adjuntar una foto de un Contacto para comunicación Organización - Swisscontact)</li>
                  <li>Contacto de nombre</li>
                  <li>Contacto teléfono</li>
                  <li>Contacto Correo</li>
                  <li>Dirección</li>
                  <li>Computadoras (Que el centro cuenta para las cursos)</li>
                  <li>Tablets (Que el centro cuenta para las cursos)</li>
                  <li>Celulares (Que el centro cuenta para las cursos)</li>
                  <li>Latitud (Posición Geográfica) Longitud (Posición Geográfica)</li>
                  <li>Youtube (Si cuenta con canal en la plataforma)</li>
                  <li>Seleccionar (Imagen del Logo)</li>
                  <li>Teléfono(Del centro)</li>
                  <li>Correo(Del centro)</li>
                  <li>Web Url (Del centro)</li>
                  <li>Facebook(Del centro)</li>
                  <li>Instagram (Del centro)</li>
                  <li>Twitter (Del centro)</li>
                  <li>Guardar(Formulario)</li>
                  <li>Cancelar</li>
              </ul>
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-07.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="instructores">
      <div class="bloque">
        <div class="titulo1">INSTRUCTORES</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
             En esta opción, se podrá observar todos los Instructores de los centros asociados con swisscontact, recopilando Nombre, Apellido, Centro Asignado, Teléfono (Claro - Tigo), Otro Teléfono, País, Departamento, Municipio, Sexo, Edad, Años de Experiencia, Especialidad, Calificación, Nivel Acádemico y Estado.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-08.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              En pantalla se podrán ver los botones de Nuevo, Actualizar tabla, Búsqueda, y si se desea, la opción para descargar los datos en una hoja de excel.
            </p>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="registrarinstructores">
      <div class="bloque">
        <div class="titulo1">REGISTRAR NUEVO INSTRUCTOR</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
             En el botón de nuevo, se podrá agregar un nuevo instructor, una vez dentro de nuevo se podrán encontrar los campos de información tales como:
            </p>
            <p class="parrafo">
              <ul>
                <li>Interruptor (este es para gregar para nueva información sobre un usuario (Instructor) nuevo o editar información sobre un usuario (Instructor) existente)</li>

                <li>En caso que se quiera editar Información de un perfil existente, sólo aparecerá una barra para escribir el nombre del nombre de la persona y la base de datos lo buscará de forma automática, tendrá los mismos campos de información, que cuando se crea un perfil nuevo, a excepción de que cuando se cree un perfil nuevo se le pedirá el correo electrónico.</li>

                <li>Datos personales: Documento de identidad, Nombres, Apellidos, País, Departamento, Municipio, Sexo, Nivel Academico (Primaria, Secundaria, Bachillerato Técnico, Universidad, Postgrado, Master, Doctor), Ocupación, Teléfono Claro, Teléfono Tigo, Otro Teléfono, Dirección, Fecha de Nacimiento y Años de experiencia Especialidad.</li>

                <li>Centros (En esta categoría se podrá especificar el lugar donde estará ubicado el instructor):
                  <ul>
                    <li>Academia Korisa</li>
                    <li>Cámara de Comercio y Servicios de Nicaragua</li>
                    <li>Centro de capacitación NIMAC</li>
                    <li>Centro de Capacitaciones Emprende</li>
                    <li>Centro Juvenil Don Bosco</li>
                    <li>Centro Técnico La Bastilla</li>
                    <li>CET Vocacional</li>
                    <li>Colegio Roberto Clemente Fe y Alegría</li>
                    <li>Fundación Victoria</li>
                    <li>HABITAR</li>
                    <li>Hogar Zacarías Guerra</li>
                    <li>Impact Hub Managua</li>
                    <li>Instituto Politécnico la Salle</li>
                    <li>JA Nicaragua</li>
                    <li>La Cuculmeca</li>
                    <li>Sin Etiquetas Nicaragua</li>
                    <li>Social Entrepreneurs Group</li>
                    <li>Swisscontact</li>
                  </ul>
                </li>
                <li>Guardar (Formulario)</li>
                <li>Cancelar</li>
              </ul>
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-09.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="editarinstructores">
      <div class="bloque">
        <div class="titulo1">EDITAR INSTRUCTOR</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
             Cuando se selecciona un usuario creado, aparecen los botones de Editar e Inactivar:
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-10.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
               Cuando el perfil seleccionado esté en estado activo le aparecerá el botón Editar, este le redirigirá a los datos del perfil seleccionado y se pueden cambiar los datos de los campos de información.
            </p>
            <q-img
              src="statics/imagenes-manuales/manual-11.png"
              style="margin-top:50px;">
            </q-img>
            <p class="parrafo">
              Cuando se dé clic en el botón inactivar este será para dar de baja al usuario, de su función, no se elimina los datos.
            </p>
            <q-img
              src="statics/imagenes-manuales/manual-12.png"
              style="margin-top:50px;">
            </q-img>
            <p class="parrafo">
              Cuando el perfil seleccionado esté en estado inactivo, le aparecerá el botón Activar, y de forma automática, le aparecerán las opciones de un perfil activo.
            </p>
            <q-img
              src="statics/imagenes-manuales/manual-13.png"
              style="margin-top:50px;">
            </q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="testdeholland">
      <div class="bloque">
        <div class="titulo1">TEST DE HOLLAND</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
                A continuación en este ítem, se pueden encontrar los botones de Nuevo, Actualizar y una tabla con perfiles de personas que han realizado el test, con información personal de cada usuario, Nombre, Centro, Respuesta, Fecha de Inicio, Fecha Fin, Responder, Botón para copiar el link para hacer el test y Usuario Creación (Para saber quien creó la convocatoria del test). Se le ha integrado el botón de Descargar Excel, para poder descargar la información en una hoja de excel.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-14 (Test de Holland).png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="registrartest">
      <div class="bloque">
        <div class="titulo1">REGISTRAR NUEVO TEST HOLLAND</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
               El de Nuevo es para la creación de una nueva convocatoria donde los campos a rellenar son:
            </p>
            <p class="parrafo">
                <ul>
                  <li>Selección de curso</li>
                  <li>Fecha de inicio</li>
                  <li>Fecha final</li>
                </ul>
                Y se encuentran los botones de Cancelar y Guardar.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-15.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="editartest">
      <div class="bloque">
        <div class="titulo1">EDITAR, ELIMINAR VER TEST HOLLAND</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
               Cuando se selecciona un perfil, aparecerán los botones Editar, Eliminar, Ver Respuestas
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-16 (ver respuesta).png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Al presionar el botón Ver Respuestas, se redirigirá a una nueva pestaña, donde se puede encontrar de forma resumida los resultados del usuario, destacando los datos Correo, Teléfono, Cédula, Personalidad. Aparte de eso los botones Regresar y Actualizar Página.
            </p>
            <q-img
            src="statics/imagenes-manuales/manual-17 (al presionar ver respuesta).png"
            style="margin-top:50px;"></q-img>
            <p class="parrafo">
              Si se selecciona el perfil este se le aparecerá un nuevo botón Ver Detalle.
            </p>
            <q-img
            src="statics/imagenes-manuales/manual-18 (botón ver detalle).png"
            style="margin-top:50px;"></q-img>
            <p class="parrafo">
              En "Ver Detalle" se podrá apreciar los botones ‘‘Regresar’’, Resumen (Resultados específicos del test), Parte A, Parte B, Parte C y Parte D. La información correspondiente a cada botón, son las respuestas realizadas por los usuarios, las cuales no son modificables.
            </p>
            <p class="parrafo">Resumen, son los resultados ordenados por los tipos de perfiles que existen.</p>
            <q-img
             style="margin-top:50px;"
            src="statics/imagenes-manuales/manual-19 (en ver detalle).png"></q-img>

            <p class="parrafo">Parte A.</p>
            <q-img
             style="margin-top:50px;"
            src="statics/imagenes-manuales/manual-20.png"></q-img>

            <p class="parrafo">Parte B.</p>
            <q-img
             style="margin-top:50px;"
            src="statics/imagenes-manuales/manual-21.png"></q-img>

            <p class="parrafo">Parte C.</p>
            <q-img
             style="margin-top:50px;"
            src="statics/imagenes-manuales/manual-22.png"></q-img>

            <p class="parrafo">Parte D.</p>
            <q-img
             style="margin-top:50px;"
            src="statics/imagenes-manuales/manual-23.png"></q-img>

            <p class="parrafo">ELIMINAR: Al presionar el botón de eliminar, le saldrá una alerta sobre si desea continuar con con el proceso de eliminar.</p>
            <q-img
             style="margin-top:50px;"
            src="statics/imagenes-manuales/manual-24.png"></q-img>

          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="cursos">
      <div class="bloque">
        <div class="titulo1">CURSOS</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
                En ‘‘Cursos’’, se podrán ver todos los cursos que se encuentran activos correspondientes a los Centros Afiliados, estarán los botones de Nuevo (Para agregar un curso), Actualizar página,  Centro (Se selecciona el Centro para saber qué cursos están ofreciendo), botón de Descargar Excel, para poder descargar la información en una hoja de excel. La tabla que se visualizará, tendrá la información de los cursos: Nombre del curso, Centro (El que lo imparte), Tipo, Sector, Descripción, Duración, Unidad de Duración.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-25.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
     <div id="registrarcurso">
      <div class="bloque">
        <div class="titulo1">REGISTRAR CURSO</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-26.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
                Se podrá observar, campos de información del curso para rellenarlos: Nombre, Centro, Tipo, Sector, Descripción, Competencias Adquiridas, Duración, Unidad duración.
            </p>

          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="editarcurso">
      <div class="bloque">
        <div class="titulo1">EDITAR CURSO</div>
        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
                Al Seleccionar un curso se habilitarán los botones de Ver, Editar y Eliminar
            </p>

          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-27.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-28.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
     <div id="eliminarcurso">
      <div class="bloque">
        <div class="titulo1">ELIMINAR CURSO</div>
        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
                Al presionar el botón de eliminar, le saldrá una alerta sobre si desea continuar con con el proceso de eliminar
            </p>

          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-29.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>

     <div id="ejecuciondecurso">
      <div class="bloque">
        <div class="titulo1">EJECUCIÓN DE CURSO</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
                Ejecución es la opción donde se podrá observar los cursos que se imparten en los centros afiliados.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-30.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Los botones que se podrán encontrar son: Iniciar nuevo curso, actualizar tabla y descargar la tabla en formato excel.
            </p>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="registrarejecuciondecurso">
      <div class="bloque">
        <div class="titulo1">NUEVO CURSO</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
               Una vez que se le ha dado clic en Nuevo curso, se abrirá un formulario para llenar casillas de información:
                <ul>
                  <li>Centro</li>
                  <li>Código</li>
                  <li>Curso</li>
                  <li>Modalidad</li>
                  <li>Modo</li>
                  <li>País</li>
                  <li>Departamento</li>
                  <li>Municipio</li>
                  <li>Dirección</li>
                  <li>Fecha de inicio</li>
                  <li>Fecha fin</li>
                  <li>Costo por participante</li>
                  <li>Cupos disponibles</li>
                  <li>Fecha fin matrícula</li>
                  <li>interruptor de si incluye certificado o no</li>
                  <li>Instructores</li>
                  <li>Guardar</li>
                  <li>Cancelar</li>
                </ul>

            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-31.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Los botones que se podrán encontrar son: Iniciar nuevo curso, actualizar tabla y descargar la tabla en formato excel.
            </p>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>

    <div id="editarejecuciondecurso">
      <div class="bloque">
        <div class="titulo1">EDITAR CURSO</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
               Una vez que se seleccione un curso ya creado, aparecen nuevos botones: Ver, Editar e Inscripciones.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-32.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Ver: Se podrá observar la información del curso de los campos de información..
            </p>
            <q-img
              src="statics/imagenes-manuales/manual-33.png"
              style="margin-top:50px;"
            ></q-img>
             <p class="parrafo">
              Editar: Aparecerán los campos de información para poder editarlos.
            </p>
            <q-img
              src="statics/imagenes-manuales/manual-34.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Inscripciones: Se redirigirá al ítem de Inscripciones con el código correspondiente del curso
            </p>
            <q-img
              src="statics/imagenes-manuales/manual-35.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>

    <div id="participante">
      <div class="bloque">
        <div class="titulo1">PARTICIPANTES</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
                En Participantes, se podrá visualizar los perfiles de personas, que están recibiendo cursos en los centros afiliados. Con los botones de Actualizar y Descargar la tabla en excel.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-37.jpg"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>

    <div id="editarinactivar">
      <div class="bloque">
        <div class="titulo1">VER, EDITAR E INACTIVAR PARTICIPANTES</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
               Al seleccionar un perfil, se habilitan nuevos botones de forma automática: Editar e Inactivar.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/manual-38.jpg"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              -El botón  ver permitirá poder visualizar los perfiles de los usuarios registrados.
            </p>
            <q-img src="statics/imagenes-manuales/manual-39.jpg"
              style="margin-top:50px;">
            </q-img>
             <p class="parrafo">
            La opción Editar permite poder cambiar la información de los campos de información. Agregando las funciones de Guardar y Cancelar.
            </p>
            <q-img src="statics/imagenes-manuales/manual-40.jpg"
              style="margin-top:50px;">
            </q-img>
            <p class="parrafo">
            El botón de Inactivar permite dar de baja, a la persona seleccionada, aparecerá una notificación, si desea inactivar el perfil de los cursos
            </p>
            <q-img src="statics/imagenes-manuales/manual-41.jpg"
              style="margin-top:50px;">
            </q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>

    <div id="inscripciones">
      <div class="bloque">
        <div class="titulo1">INSCRIPCIONES</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              En la opción Inscripciones la pantalla principal se encuentran los botones de Nueva inscripción, Actualizar tabla de datos, Búsqueda de Centro, Búsqueda de Curso y Descargar tabla de Excel.
            </p>

            <p>
              <ul>
                <li>
                  Las casillas de información están organizadas por:
                </li>
                <li>
                  Participante
                </li>
                <li>
                  Cédula
                </li>
                <li>
                  Centro
                </li>
                <li>
                   Egresado
                </li>
                <li>
                  Código
                </li>
                <li>
                   Curso
                </li>
                <li>
                  Clasificación
                </li>
                <li>
                  Comentarios
                </li>
                <li>
                  Edad
                </li>
                <li>
                  Estado Civil
                </li>
                <li>
                  Sexo
                </li>
                <li>
                  País
                </li>
                <li>
                  Departamento
                </li>
                <li>
                  Municipio
                </li>
                <li>
                  Dirección
                </li>
                <li>
                  Nivel Académico
                </li>
                <li>
                  Trabajando
                </li>
                <li>
                  Lugar Trabajo
                </li>
                <li>
                  Salario
                </li>
              </ul>
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/Inscripciones@3x.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Al seleccionar un perfil, aparecerán los botones de Editar, Marcar como Egresado, Eliminar.
            </p>
             <q-img
              src="statics/imagenes-manuales/Al seleccionar...@3x.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              El botón editar, abrirá los campos de información correspondiente, a datos personales de la inscripción y estado del curso del que el usuario ha formado parte, y permite poder modificar los datos de este:

              Datos personales: Interruptor para establecer si es mayor de edad, Cédula, Nombres, Apellidos, Correo, Teléfono, Femenino, Sexo, Soltero(a), Estado civil, Fecha Nacimiento, Departamento, Municipio, Dirección.

              Datos Académicos: Nivel Académico, Interruptor actualmente estudiando.

              Datos referencia (Persona Adicional): Parentesco, Nombre Completo, Cédula, Teléfono.

              Botones de regresar y Guardar.
            </p>
             <q-img
              src="statics/imagenes-manuales/Nueva inscripción@3x.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>

    <div id="formularios">
      <div class="bloque">
        <div class="titulo1">FORMULARIOS</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              En el Home de Formulario se podrá encontrar el botón de Nuevo y Actualizar, a su vez se visualizará un formulario, en el cual se encuentran encuestas para recopilación de datos y exámenes, para evaluaciones dentro de los cursos.
            </p>

          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/formularios1.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Cuando se da clic en el botón nuevo se redirige a un formulario de información, para la creación de un formulario nuevo de  Examen o Encuesta. Los campos de información serán:
            </p>
            <q-img
              src="statics/imagenes-manuales/formulario2.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              <ul>
                <li>
                  Guardar
                </li>
                <li>
                  Vista previa
                </li>
                <li>
                  Nombre (Se podrá agregar un título al formulario)
                </li>
                <li>
                  Fecha Inicio
                </li>
                <li>
                  Fecha Fin
                </li>
                <li>
                  Tipo de formulario (Examen o Encuesta)
                </li>
                <li>
                  Link del formulario
                </li>
                <li>
                  Botón de copiar link
                </li>
                <li>
                  Participantes
                </li>
                <li>
                  Abierto
                </li>
                <li>
                  Anónimo
                </li>
                <li>
                  Duración en minutos (ingresa una duración mayor a 0 minutos y segundos, para aplicar un temporizador al formulario)
                </li>
                <li>
                  Reglas de exclusión (Herramienta para establecer preguntas que dependen de otras)
                </li>
              </ul>
            </p>
            <p class="parrafo">
              Se selecciona la Sección, el Campo, Operador, Valor, Sección a Excluir, Campo a Excluir, (Especificación)  Excluir Sección, Botón Agregar Regla, Botón Editar, Tabla de Visualización y
            </p>
             <q-img
              src="statics/imagenes-manuales/formulario3.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              botones para Cancelar y Guardar.

              A continuación se podrá ver los bloques que conformarán el formulario, determinados como ‘‘Sección’’, donde se podrá Agregar ‘‘Título’’ a la sección, en ‘‘Descripción’’ se le podrá agregar detalles, sobre lo que se realizará  o pasos a seguir para responder los incisos y Botón ‘‘Agregar’’ sirve para la integración de las preguntas abiertas, cerradas, selección múltiple y valoración.

              En las secciones se presentará una tabla de edición de texto tipo Word, con botones funcionales de margen de texto ‘‘Alinear’’, Negrita, Cursiva, Tachado, Subrayado, Subíndice, Superíndice, Insertar línea horizontal, Hipervínculo, Pantalla completa, Tipos de encabezados, Tipografía, Tamaño de fuente, Eliminar formato, Citar, Lista ordenada (Común y Númerica), Disminuir indentación,  Aumentar indentación, Deshacer y Rehacer.
            </p>
            <p class="parrafo">
              Las secciones serán pantallas independientes a la hora de realizar el examen o encuesta
            </p>
            <q-img
              src="statics/imagenes-manuales/formulario4.png"
              style="margin-top:50px;"
            ></q-img>
             <q-img
              src="statics/imagenes-manuales/formulario5.png"
              style="margin-top:50px;"
            ></q-img>
              <q-img
              src="statics/imagenes-manuales/formulario6.png"
              style="margin-top:50px;"
            ></q-img>
            <q-img
              src="statics/imagenes-manuales/formulario7.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              En el botón agregar se desplegarán las opciones: Texto, Opción, Sección, Tabla, Departamento, Municipio, Valoración.
            </p>
             <q-img
              src="statics/imagenes-manuales/formulario8.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Texto: Permite agregar una pregunta, poder responder de forma textual y poder adjuntar una imagen. En tipo de respuesta se le ha agregado una barra desplegable, para determinar si el texto que se pondrá en respuestas es corto, largo, numérico o fecha. A su vez puede establecerse como pregunta obligatoria o no. Las flechas sirven para poder cambiar el orden de las preguntas, en caso que hubiesen más de dos preguntas por sección, Botón para copiar las preguntas y un Botón para eliminar preguntas.
            </p>
            <q-img
              src="statics/imagenes-manuales/formulario9.png"
              style="margin-top:50px;"
            ></q-img>
            <q-img
              src="statics/imagenes-manuales/formulario10.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Opción: Permite crear una pregunta con respuesta de selección, agregar más opciones de respuestas y poder adjuntar una imagen. En las opciones permite poder agregar texto, poderlas mover para cambiar el orden, Botón eliminar opción, Botón agregar una  nueva opción. Se puede definir como será la presentación de las opciones, para el usuario a la hora de responder un formulario. Se puede establecer como pregunta obligatoria o no. Las flechas son para cambiar el orden de las preguntas, en caso que hubiesen más de dos preguntas por sección, Botón para copiar las preguntas y un Botón para eliminar preguntas.
            </p>
             <q-img
              src="statics/imagenes-manuales/formulario11.png"
              style="margin-top:50px;"
            ></q-img>
              <q-img
              src="statics/imagenes-manuales/formulario12.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Departamento: La sección sirve para saber ubicaciones, los botones de flechas son para cambiar el orden de las preguntas, en caso que hubiesen más de dos preguntas por sección, Botón para copiar las preguntas y un Botón para eliminar preguntas, se establece si la pregunta es de requerimiento, para que el usuario pueda avanzar a la siguiente pregunta. Se escribe una pregunta específica sobre
            </p>
            <div class="parrafo">
              ubicación, porque a la hora de que el usuario responda esta, de forma automática, le aparecerá una  barra desplegable con los departamentos de Nicaragua. Esta pregunta da un requerimiento para poder contestar al Municipio, en caso de que se necesite saber Departamento y Municipio.
            </div>
            <q-img
              src="statics/imagenes-manuales/formulario13.png"
              style="margin-top:50px;"
            ></q-img>

            <p class="parrafo">
              Municipio: La sección sirve para saber ubicaciones, se establece una pregunta específica sobre ubicación, se establece si la pregunta es requerida para poder avanzar, se puede filtrar los municipios por departamento, o se ponen todos en lista, esto es para saber, cómo será la visualización para responder, Para que el usuario pueda responder esta pregunta se necesitará que anteriormente se le haga la pregunta de Departamento.
            </p>
             <q-img
              src="statics/imagenes-manuales/formulario14.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Valoración: Esta opción permite poner preguntas de satisfacción y que los usuarios puedan evaluar en un rango de 1 a 10, permite agregar imagen, se encuentran los botones de flechas son para cambiar el orden de las preguntas, en caso que hubiesen más de dos preguntas por sección, Botón para copiar las preguntas y un Botón para eliminar preguntas, se puede establecer si es una pregunta de requerimiento, el interruptor de agregar subtítulo, sirve para poder agregar comentarios para la resolución de la pregunta.
            </p>
            <q-img
              src="statics/imagenes-manuales/formulario15.png"
              style="margin-top:50px;"
            ></q-img>

            <p class="parrafo">
              Al seleccionar un formulario ya creado, se habilitarán nuevas opciones:
              <ul>
                <li>
                  Editar
                </li>
                <li>
                  Duplicar
                </li>
                <li>
                   Ver Respuestas
                </li>
                <li>
                  Eliminar
                </li>
                <li>
                  Imprimir
                </li>
                <li>
                   Compartir enlace vía correo
                </li>
                <li>
                  Actualiza
                </li>
              </ul>
            </p>
             <q-img
              src="statics/imagenes-manuales/formulario16.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Editar: Permite poder cambiar los valores del formulario, preguntas y otras especificaciones, de una encuesta y examen creado.
            </p>
             <q-img
              src="statics/imagenes-manuales/formulario17.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Duplicar: Permite crear una copia exacta del formulario seleccionado, para no tener que hacer el proceso de creación de uno nuevo.

Ver Respuestas: Esta opción está permitida, nada más para formularios que ya finalizaron.
            </p>
            <q-img
              src="statics/imagenes-manuales/formulario18.png"

              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
<div id="usuarios">
      <div class="bloque">
        <div class="titulo1">USUARIOS</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              A continuación, podremos tener acceso a la base de datos de todos los usuarios registrados, en la plataforma Competencias para ganar, estos usuarios tendrán visibilidad a todos los accesos de la plataforma, y tendrán la oportunidad de recopilar los datos de los centros. Esta casilla tendrá los botones de Nuevo (Para crear un nuevo usuario) y Actualizar página.

La tabla presentada tiene los datos de: Id, Nombre, Email, Centros Asignados, Fecha de verificación, Estado, Verificado, Rol.

            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/usuario19.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Cuando se selecciona un usuario y este se encuentra en estado inactivo, se le habilita un botón para activarlo, pero si el usuario seleccionado, está activo dentro de la plataforma, se habilitan los botones de Editar e Inactivar, cuando los usuarios son perfiles de administrador.
            </p>
            <q-img
              src="statics/imagenes-manuales/usuario20.png"
              style="margin-top:50px;"
            ></q-img>
             <q-img
              src="statics/imagenes-manuales/usuario21.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Cuando es un usuario con el rol de asesor y está activo, sus botones habilitados son Editar e Inactivar, pero cuando es asesor y está inactivo, se activan los botones de Activar y Verificar.
            </p>
            <q-img
              src="statics/imagenes-manuales/usuario22.png"
              style="margin-top:50px;"
            ></q-img>
             <q-img
              src="statics/imagenes-manuales/usuario23.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Cuando un perfil ya está creado, y se desea editar el acceso que puede tener este usuario, se da clic en el botón editar, se abrirá un pestaña con los datos que esta persona tiene acceso, saldrá Nombre, Correo, Rol (Se desplegará una barra con diferentes perfiles, Administrador, Asesor, Centro, Invitado), habrá una lista de todos los centros, que esa persona tiene acceso a su información, se podrá seleccionar uno por uno o la opción todos.
            </p>
             <q-img
              src="statics/imagenes-manuales/usuario25.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Si se desea Inactivar un perfil activo, este le aparecerá una notificación de aviso, para poder efectuar la acción.
            </p>
             <q-img
              src="statics/imagenes-manuales/usuario26.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="roles">
      <div class="bloque">
        <div class="titulo1">ROLES</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              En esta opción se podrán apreciar los roles designados para los usuarios, se pueden agregar más roles de administración, aparecerá una tabla con información de Id, Nombre, Created_at, Última Actualización.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/roles27.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Al seleccionar un rol se activarán los botones de editar y eliminar, al editar el perfil en selección se le puede cambiar el nombre del rol, guardar o cancelar la acción. El botón eliminar se accede a una notificación de aviso, para asegurarse que se quiere requerir esa acción.
            </p>
              <q-img
              src="statics/imagenes-manuales/roles28.png"
              style="margin-top:50px;"
            ></q-img>
              <q-img
              src="statics/imagenes-manuales/roles29.png"
              style="margin-top:50px;"
            ></q-img>
            <q-img
              src="statics/imagenes-manuales/roles30.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="accesos">
      <div class="bloque">
        <div class="titulo1">ACCESOS</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              En el inciso de Accesos, se administra todas las ventanas del Menú izquierdo, este ítem dentro de la plataforma, da la oportunidad de poder crear más accesos para navegación de los usuarios.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/accesos31.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Nuevo: Este botón permite crear nuevos accesos, da la oportunidad de poner nombre al acceso, Descripción del acceso, Icon del acceso es darle código de programación, Path del acceso es la dirección URL de ese nuevo acceso y la selección de la posición que tendrá dentro del menú.
            </p>
              <q-img
              src="statics/imagenes-manuales/accesos32.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Al seleccionar un Acceso, se habilitan los botones de Editar y Eliminar, en editar podremos cambiarle el nombre al Acceso, Descripción, Código, Extensión y Posición dentro de la lista de menú.
            </p>
              <q-img
              src="statics/imagenes-manuales/accesos33.png"
              style="margin-top:50px;"
            ></q-img>
            <q-img
              src="statics/imagenes-manuales/accesos34.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              El botón eliminar permite desaparecer un acceso, que ya no queremos que aparezca dentro del menú. Antes de efectuar la acción la plataforma nos mandará una notificación, si deseamos eliminar o no, el acceso.
            </p>
             <q-img
              src="statics/imagenes-manuales/accesos35.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
    <div id="permisos">
      <div class="bloque">
        <div class="titulo1">PERMISO</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
              En permisos podrás establecer los accesos, a los que podrán acceder los roles de usuarios de la plataforma. Los roles de Administrador, Asesor, Centro, Instructor e invitado.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/permisos36.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              Para crear un nuevo rol le damos clic en Nuevo y se nos abrirá una pestaña, donde aparecerá una tabla para especificaciones, se elige un rol ya establecido entre Administrador, Asesor, Centro, Instructor e invitado, luego de eso se establecen cuáles serán los permisos que tendrá ese nuevo rol, en fila tendremos todos los accesos a Accesos, Centros, Registro de cursos, Dashboard, Formularios, Instructores, Participantes, Permisos, Reporte, Roles, Usuarios, Ayuda, Ejecución de cursos, Test de Holland, Bitácora y Inscripciones,  en columnas se encuentran los permisos de acceso Ver, Crear, Editar y Eliminar. Se seleccionan los campos que queremos para ese rol y le damos guardar. Un ejemplo de este es: Rol Asistente, y establecemos que del ítem de Acceso podrá ver nada más, Centros Crear, Editar y Eliminar, y así sucesivamente con los demás.
            </p>
              <q-img
              src="statics/imagenes-manuales/permisos37.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              El botón editar, podrás cambiar los accesos y permisos de los roles creados, se da clic sobre los permisos activados para desactivarlos, y se da clic en los permisos desactivados para activarlos, clic en guardar y los cambios se han realizado
            </p>
              <q-img
              src="statics/imagenes-manuales/permisos38.png"
              style="margin-top:50px;"
            ></q-img>
            <p class="parrafo">
              En el botón eliminar se podrá deshacer un rol, la plataforma abrirá una notificación, si deseas eliminar el rol creado con los permisos.
            </p>
             <q-img
              src="statics/imagenes-manuales/permisos39.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
      <div id="bitacora">
      <div class="bloque">
        <div class="titulo1">BITÁCORA</div>

        <div class="row">
          <div class="col-12 col-md-12">
            <p class="parrafo">
             Este ítem será una tabla cronológica de acceso a la plataforma, que recopila la información de los usuarios, sobre el uso de inicio de sesión al sitio web, encontraremos los datos de: Fecha, ID, Usuario, Acción, Tabla, ID Tabla, IP, Agente, URL. En esta misma tabla podremos encontrar la opción buscar, para encontrar usuarios y acciones.
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <q-img
              src="statics/imagenes-manuales/bitacora40.png"
              style="margin-top:50px;"
            ></q-img>
          </div>
        </div>
      </div>

      <div class="row"></div>
    </div>
  </q-page>
</template>

<script>
import { scroll } from "quasar";
import {PuedeVerCentros} from "../helpers/accesos_helper"
const { getScrollTarget, setScrollPosition } = scroll;
// takes an element object

export default {
  methods: {
    descargarManual() {
      this.$router.push({
        name: "manual_administrador"
      });
    },
    scrollToElement(el) {
      const target = getScrollTarget(el);
      const offset = el.offsetTop;
      const duration = 1000;
      setScrollPosition(target, offset, duration);
    },

  },
  computed:{
    PuedeVerCentros()
    {
      return puedeVerCentros();
    }
  }

};
</script>

<style>
.q-card .q-card__section .q-img {
  border: 1px solid gray;
}

.q-card .q-card__section .q-img:hover {
  transition: transform 0.2s ease;
  transform: scale(1.03);
  overflow: hidden;
  cursor: pointer;
}

.bloque {
  padding: 35px;
  margin-top: 80px;
}

.titulo1 {
  font: bold 50px "Arial";
  color: #206fae;
  line-height: 50px;
  text-transform: uppercase;
}

.parrafo {
  text-align: justify;
  padding-left: 2px;
  padding-right: 62px;
  margin-top: 33px;
  margin-bottom: 0px;

  font: 20px "Arial";
  color: #1f1410;
  line-height: 30px;
}

.text-centered {
  text-align: center;
}
</style>
