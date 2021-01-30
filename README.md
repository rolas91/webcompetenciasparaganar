# Instrucciones

## Instalar las dependencias
```bash
npm install
```



### Create the file .env
estos datos puenden ser diferentes en tu local
```bash
WEB_URL=http://localhost:8082
API_URL=http://localhost/innovactioncorp/swisscontact-api/public/api
IMAGE_URL=http://localhost/innovactioncorp/swisscontact-api/public/img
VUE_ROUTER_MODE=history
```

### Create the file .env.production
copiar estos datos tal cual..porque son los datos de produccion
```bash
WEB_URL=https://competenciasparaganar.com
API_URL=https://api.competenciasparaganar.com/api
IMAGE_URL=https://api.competenciasparaganar.com/public/img
VUE_ROUTER_MODE=history


```

### Iniciar el app en modo developer
```bash
quasar dev
```

### para publicar los cambios correr el script build_for_production.sh
```bash
./build_for_production.sh
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
