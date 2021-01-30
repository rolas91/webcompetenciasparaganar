#!/bin/sh
quasar build
cd dist/spa && tar -zcvf ../spa.tar.gz . && cd -
scp dist/spa.tar.gz zeus@competenciasparaganar.com:/home/zeus
ssh zeus@competenciasparaganar.com "mv /home/zeus/spa.tar.gz  /var/www/html/swisscontact-web/dist/spa ; cd /var/www/html/swisscontact-web/dist/spa ; tar -xvf spa.tar.gz"
echo "Tu proyecto ha sido publicado exitosamente!! XD"
