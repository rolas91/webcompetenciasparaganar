<template>
  <q-page v-cloak>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="bg-blue-background text-white q-gutter-sm">
          <h5 class="page-title">
            {{ nuevo ? 'Nuevo Centro' : 'Editar Centro' }}
          </h5>
        </q-card-section>
        <q-separator />

        <q-card-section class="bg-grey-2">
          <q-form ref="formCentro" @submit="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-img
                  :src="
                    centro.logo && centro.logo.length > 0
                      ? centro.logo
                      : emptyUrl
                  "
                  spinner-color="white"
                  contain
                  style="height: 140px; max-width: 300px;background-size: background-position;cursor:pointer"
                  @click="openFile()"
                />
                <div class="center-mobile">
                  <q-btn
                    v-if="centro.logo && centro.logo.length > 0"
                    class="btn-delete-image"
                    icon="delete_forever"
                    @click="deleteImage"
                    color="red"
                  ></q-btn>
                </div>

                <q-btn
                  class="bg-primary text-white openFile"
                  @click="openFile()"
                >
                  Seleccionar
                </q-btn>
                <q-uploader
                  ref="uploader"
                  v-show="false"
                  v-model="centro.logo"
                  label="Logo"
                  :url="imageUrl"
                  style="max-width: 300px;"
                  @added="previewImage"
                  @removed="RemoveFile"
                  field-name="imagen"
                  hide-upload-btn
                  no-thumbnails
                  accept=".jpg, image/*"
                ></q-uploader>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-md-8">
                <q-input
                  bg-color="white"
                  v-model="centro.nombre"
                  label="Nombre"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 191) ||
                      'Ingrese un Nombre válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  bg-color="white"
                  v-model="centro.id_tipo"
                  label="Tipo de Centro"
                  :options="tipoCentros"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un tipo válido']"
                  option-value="id"
                  option-label="nombre"
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
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  bg-color="white"
                  v-model="centro.id_pais"
                  label="Pais"
                  :options="paises"
                  :loading="loadingPaises"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Pais válido']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  readonly
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
                  bg-color="white"
                  v-model="centro.id_departamento"
                  label="Departamento"
                  :options="departamentos"
                  :loading="loadingDepartamentos"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Departamento válido']"
                  option-value="id"
                  option-label="nombre"
                  emit-value
                  map-options
                  @input="CargarMunicipios('', true)"
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
                  bg-color="white"
                  v-model="centro.id_municipio"
                  label="Municipio"
                  :options="municipios"
                  @filter="filtrarMunicipios"
                  :loading="loadingMunicipios"
                  lazy-rules
                  :rules="[val => val || 'Ingrese un Municipio válido']"
                  option-value="id"
                  option-label="nombre"
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
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <label>Descripcion</label>
                <q-editor
                  color="primary"
                  min-height="15rem"
                  v-model="centro.descripcion"
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                      'subscript',
                      'superscript',
                    ],
                    ['token', 'hr', 'link', 'custom_btn'],
                    [, 'fullscreen'],
                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: [
                          'p',
                          'h1',
                          'h2',
                          'h3',
                          'h4',
                          'h5',
                          'h6',
                          'code',
                        ],
                      },
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },

                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                />
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.lema"
                  label="Lema"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-md">
              <div class="col-12">
                <q-input
                  bg-color="white"
                  type="textarea"
                  autogrow
                  color="primary"
                  v-model="centro.quienes_somos"
                  label="Quienes Somos"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  bg-color="white"
                  type="textarea"
                  autogrow
                  color="primary"
                  v-model="centro.mision"
                  label="Mision"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  bg-color="white"
                  type="textarea"
                  autogrow
                  color="primary"
                  v-model="centro.vision"
                  label="Vision"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  bg-color="white"
                  type="textarea"
                  autogrow
                  color="primary"
                  v-model="centro.valores"
                  label="Valores"
                ></q-input>
              </div>
            </div>
            <br />

            <div class="row q-col-gutter-md">
              <div class="col">
                <q-img
                  :src="
                    centro.foto_representante &&
                    centro.foto_representante.length > 0
                      ? centro.foto_representante
                      : emptyUrl
                  "
                  spinner-color="white"
                  contain
                  style="height: 140px; max-width: 300px;background-size: background-position;cursor:pointer"
                  @click="openFile()"
                />
                <div class="center-mobile">
                  <q-btn
                    v-if="
                      centro.foto_representante &&
                        centro.foto_representante.length > 0
                    "
                    class="btn-delete-image"
                    icon="delete_forever"
                    @click="deleteFoto"
                    color="red"
                  ></q-btn>
                </div>

                <q-btn
                  class="bg-primary text-white openFile"
                  @click="openFileFoto()"
                >
                  Seleccionar
                </q-btn>
                <q-uploader
                  ref="uploaderFoto"
                  v-show="false"
                  v-model="centro.foto_representante"
                  label="Foto representante"
                  :url="FotoUrl"
                  style="max-width: 300px;"
                  @added="previewFoto"
                  @removed="RemoveFileFoto"
                  field-name="imagen"
                  hide-upload-btn
                  no-thumbnails
                  accept=".jpg, image/*"
                ></q-uploader>
              </div>
            </div>

            <br />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.contacto_nombre"
                  label="Contacto Nombre"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 191) ||
                      'Ingrese un Contacto Nombre válido',
                  ]"
                ></q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.contacto_telefono"
                  label="Contacto Telefono"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && phoneRegex.test(val)) ||
                      !val ||
                      'Ingrese un telefono válido',
                  ]"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.contacto_correo"
                  label="Contacto Correo"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && emailRegex.test(val)) ||
                      !val ||
                      'Ingrese un correo válido',
                  ]"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row col-q-gutter-md">
              <div class="col-12">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.direccion"
                  label="Dirección"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0 && val.length < 191) ||
                      'Ingrese una dirección válida',
                  ]"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  v-model="centro.computadoras"
                  type="number"
                  label="Computadoras"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  v-model="centro.tablets"
                  type="number"
                  label="Tablets"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  v-model="centro.celulares"
                  type="number"
                  label="Celulares"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.latitud"
                  label="Latitud"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.longitud"
                  label="Longitud"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.youtube"
                  label="Youtube"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12 center">
                <div>
                  <q-img
                    :src="
                      centro.banner && centro.banner.length > 0
                        ? centro.banner
                        : emptyUrl
                    "
                    spinner-color="white"
                    contain
                    style="max-height:500px;margin:10px 0;cursor:pointer;"
                    position="left"
                    @click.native="openFileBanner"
                  />
                  <q-btn
                    v-if="centro.banner && centro.banner.length > 0"
                    color="red"
                    class="btn-delete-image"
                    icon="delete_forever"
                    @click="deleteImageBanner"
                    style="text-align:center;margin:auto;display:flex;justify-Content:center"
                  ></q-btn>

                  <q-btn
                    class="bg-primary text-white"
                    style="width: 300px;margin-top:10px;"
                    @click="openFileBanner()"
                  >
                    Seleccionar
                  </q-btn>
                </div>

                <div>
                  <q-uploader
                    ref="uploaderBanner"
                    v-show="false"
                    v-model="centro.banner"
                    label="Banner"
                    :url="imageUrlBanner"
                    style="max-width: 300px;"
                    @added="previewImageBanner"
                    @removed="RemoveFileBanner"
                    field-name="banner"
                    hide-upload-btn
                    no-thumbnails
                    accept=".jpg, image/*"
                  ></q-uploader>
                </div>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.telefono"
                  label="Telefono"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.correo"
                  label="Correo"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.web_url"
                  label="Web Url"
                ></q-input>
              </div>
            </div>
            <br />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.facebook"
                  label="Facebook"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.instagram"
                  label="Instagram"
                ></q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  bg-color="white"
                  color="primary"
                  v-model="centro.twitter"
                  label="Twitter"
                ></q-input>
              </div>
            </div>

            <br />
            <q-card-actions class="row justify-between q-gutter-md">
              <q-btn right icon="close" @click="cancelar">Cancelar</q-btn>
              <q-btn
                :loading="loading"
                :disable="loading"
                right
                class="bg-primary text-white"
                type="submit"
                icon="save"
              >
                Guardar
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
        <!-- <q-separator></q-separator> -->
      </q-card>
    </div>
  </q-page>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      emailRegex: new RegExp(
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
      phoneRegex: new RegExp(/^[\s.-]?\(?\d{4}\)?[\s.-]?\d{4}$/),
      selected_file: '',
      check_if_document_upload: false,
      uploadedUrl: '',
      nuevo: true,
      imageUrl: process.env.API_URL + '/admin/centros/uploadImage',
      imageUrlBanner: process.env.API_URL + '/admin/centros/uploadImageBanner',
      FotoUrl: process.env.API_URL + '/admin/centros/uploadFotoRepresentante ',
      emptyUrl: process.env.IMAGE_URL + '/placeholder.jpg',
      centro: {
        id: 0,
        nombre: '',
        id_pais: 1438,
        id_departamento: null,
        id_municipio: null,
        lema: '',
        logo: '',
        banner: '',
        descripcion: '',
        quienes_somos: '',
        mision: '',
        vision: '',
        valores: '',
        direccion: '',
        latitud: '',
        longitud: '',
        contacto_nombre: '',
        contacto_telefono: '',
        contacto_correo: '',
        telefono: '',
        correo: '',
        web_url: '',
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        computadoras: 0,
        tablets: 0,
        celulares: 0,
        foto_representante: '',
      },
      departamentos: [],
      municipios: [],
      paises: [],
      tipoCentros: [],
      loadingTipos: false,
      loadingDepartamentos: false,
      loadingMunicipios: false,
      loadingPaises: false,
      loading: false,
      visible: false,
    }
  },
  mounted() {},
  async created() {
    this.loading = true
    if (this.$route.name === 'editar_centro' && this.$route.params.id) {
      this.nuevo = false
      await this.CargarCentro()
    }
    await this.CargarPaises()
    this.loading = false
    this.CargarTiposCentros()
    // si es editar cargamos los datos del centro

    await this.CargarDepartamentos('', false)
    await this.CargarMunicipios()
  },
  methods: {
    cancelar() {
      this.$router.push({
        path: '/admin/centros',
      })
    },
    openFile() {
      this.$refs.uploader.reset()
      setTimeout(() => {
        this.$refs.uploader.pickFiles()
      }, 0)
    },
    openFileBanner() {
      this.$refs.uploaderBanner.reset()
      setTimeout(() => {
        this.$refs.uploaderBanner.pickFiles()
      }, 0)
    },

    openFileFoto() {
      this.$refs.uploaderFoto.reset()
      setTimeout(() => {
        this.$refs.uploaderFoto.pickFiles()
      }, 0)
    },

    deleteImageBanner() {
      this.RemoveFileBanner()
      this.centro.banner = null
    },
    deleteImage() {
      this.RemoveFile()
      this.centro.logo = null
    },

    deleteFoto() {
      this.RemoveFileFoto()
      this.centro.foto_representante = null
    },
    file_selected(file) {
      this.selected_file = file[0]
      this.check_if_document_upload = true
    },

    previewImage() {
      this.centro.logo = URL.createObjectURL(this.$refs.uploader.files[0])
    },

    previewImageBanner() {
      this.centro.banner = URL.createObjectURL(
        this.$refs.uploaderBanner.files[0],
      )
    },

    previewFoto() {
      this.centro.foto_representante = URL.createObjectURL(
        this.$refs.uploaderFoto.files[0],
      )
    },

    uploadFile() {
      let fd = new FormData()
      fd.append('imagen', this.$refs.uploader.files[0])
      fd.append('banner', this.$refs.uploaderBanner.files[0])
      fd.append('foto_representante', this.$refs.uploaderFoto.files[0])
      fd.append('centro', JSON.stringify(this.centro))
      axios
        .post(this.imageUrl, fd, {
          headers: {
            'Content-Type': undefined,
            Authorization: 'Bearer ' + this.$store.state.token,
          },
        })
        .then(function(response) {
          if (response.data.ok) {
            this.centro.logo =
              process.env.IMAGE_URL + '/logos/' + response.data.urlLogo

            this.centro.banner =
              process.env.IMAGE_URL + '/banners/' + response.data.urlBanner

            this.centro.foto_representante =
              process.env.IMAGE_URL +
              '/fotos_representantes/' +
              response.data.urlFotoRepresentante
          }
        })
    },

    RemoveFile() {
      this.$refs.uploader.reset()
    },

    RemoveFileBanner() {
      this.$refs.uploaderBanner.reset()
    },
    RemoveFileFoto() {
      this.$refs.uploaderFoto.reset()
    },

    CargarCentro() {
      if (this.$route.params.id) {
        this.loading = true
        this.visible = true
        var url =
          process.env.API_URL + `/admin/centros/${this.$route.params.id}/edit`

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
            this.centro = response.data.centro
            this.centro.logo = response.data.centro.logo
              ? process.env.IMAGE_URL + '/logos/' + response.data.centro.logo
              : ''

            this.centro.banner = response.data.centro.banner
              ? process.env.IMAGE_URL +
                '/banners/' +
                response.data.centro.banner
              : ''

            this.centro.foto_representante = response.data.centro
              .foto_representante
              ? process.env.IMAGE_URL +
                '/fotos_representantes/' +
                response.data.centro.foto_representante
              : ''

            this.loading = false
            this.visible = false
            this.CargarPaises()
            this.CargarDepartamentos('', false)
            this.CargarMunicipios()
          })
          .catch(error => {
            this.loading = false
            this.visible = false

            if (error.response.status === 401) {
              this.removeCredentials()
              this.$router.push({
                name: 'login',
              })
            }
          })
      }
    },
    onSubmit() {
      this.loading = true
      var method = 'post'

      var url = process.env.API_URL + '/admin/centros'
      if (!this.nuevo) {
        url = process.env.API_URL + '/admin/centros/' + this.centro.id
        method = 'put'
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      let fd = new FormData()
      if (this.$refs.uploader) {
        fd.append('imagen', this.$refs.uploader.files[0])
      }

      axios({
        method: method,
        url: url,
        data: { centro: this.centro },
        headers: headers,
      })
        .then(response => {
          this.centro.id = response.data.centro.id
          this.uploadFile()
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: this.nuevo
              ? 'Centro creado correctamente'
              : 'Centro actualizado correctamente',
            position: 'bottom',
            timeout: 2000,
          })
          this.$router.push({
            path: '/admin/centros',
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
    },
    CargarDepartamentos(filtro = '', resetearMunicipio = true) {
      this.loadingDepartamentos = true
      var url = process.env.API_URL + '/catalogos/departamentos'

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
        id_padre: this.centro.id_pais !== null ? this.centro.id_pais : '',
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then(response => {
          this.departamentos = response.data.departamentos
          this.loadingDepartamentos = false
          if (resetearMunicipio) {
            this.centro.id_municipio = null
          }
        })
        .catch(error => {
          this.loadingDepartamentos = false
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
    },

    CargarTiposCentros(filtro = '') {
      this.loadingTipos = true
      var url = process.env.API_URL + '/catalogos/tipoCentros'

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
          this.loadingTipos = false
          this.tipoCentros = response.data.tipoCentros
        })
        .catch(error => {
          this.loadingTipos = false
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
    },

    CargarMunicipios(filtro = '', resetValue = false) {
      this.loadingMunicipios = true
      var url = process.env.API_URL + '/catalogos/municipios'

      if (resetValue) {
        this.centro.id_municipio = null
      }

      var headers = {
        Authorization: 'Bearer ' + this.$store.state.token,
      }

      var params = {
        q: filtro,
        id_padre:
          this.centro.id_departamento !== null
            ? this.centro.id_departamento
            : '',
      }
      axios({
        method: 'get',
        url: url,
        params: params,
        headers: headers,
      })
        .then(response => {
          this.municipios = response.data.municipios
          this.loadingMunicipios = false
        })
        .catch(error => {
          this.loadingMunicipios = false
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
    },

    CargarPaises(filtro = '') {
      this.loadingPaises = true
      var url = process.env.API_URL + '/catalogos/paises'

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
          this.paises = response.data.paises
          this.loadingPaises = false
        })
        .catch(error => {
          this.loadingPaises = false
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
    },
    removeCredentials() {
      this.$store.dispatch('removeCredentials')
    },
    filtrarDepartamentos(val, update, abort) {
      update(() => {
        this.CargarDepartamentos(val)
      })
    },

    filtrarMunicipios(val, update, abort) {
      update(() => {
        this.CargarMunicipios(val)
      })
    },

    filtrarPaises(val, update, abort) {
      update(() => {
        this.CargarPaises(val)
      })
    },
    LimpiarDatos() {
      this.centro.id = 0
      this.centro.nombre = ''
      this.centro.id_pais = 1438
      this.centro.id_departamento = 0
      this.centro.id_municipio = 0
      this.centro.lema = ''
      this.centro.logo = null
      this.centro.banner = ''
      this.centro.descripcion = ''
      this.centro.quienes_somos = ''
      this.centro.mision = ''
      this.centro.vision = ''
      this.centro.valores = ''
      this.centro.direccion = ''
      this.centro.latitud = ''
      this.centro.longitud = ''
      this.centro.contacto_nombre = ''
      this.centro.contacto_telefono = ''
      this.centro.contacto_correo = ''
      this.centro.telefono = ''
      this.centro.correo = ''
      this.centro.web_url = ''
      this.centro.facebook = ''
      this.centro.instagram = ''
      this.centro.twitter = ''
      this.centro.youtube = ''
      this.centro.created_at = null
      this.centro.updated_at = null
      this.centro.deleted_at = null
    },
  },
  directives: {
    focus: {
      // directive definition
      inserted: function(el) {
        el.focus()
      },
    },
  },
}
</script>
<style>
.q-uploader__file--img {
  /* height: -webkit-fill-available; */

  background-position: top;
  background-size: contain;
  background-repeat: no-;
}
</style>

<style scoped>
.page-title {
  margin: 0px 10px;
}

.btn-delete-image {
  margin-top: 5px;
  width: 300px;
}

.center-mobile {
  display: flex;
  justify-content: center;
  width: 300px;
}

.openFile {
  width: 300px;
  margin-top: 10px;
}

@media (max-width: 600px) {
  /* .btn-delete-image {
    left: -20px;
    width: 150px;
  } */

  .openFile {
    width: 250px;
    margin-top: 10px;
  }
}

.bg-blue-background {
  background-color: #027be3;
}
</style>
