# Docker

## Development
Para correr con ` Dockerfile.dev`:
```bash
docker rm -f node.dev
docker build -t node.dev . -f Dockerfile.dev
docker run -it -d --name node.dev -v $(pwd):/usr/src/app -p 8093:8093  node.dev
docker exec -it node.dev /bin/bash
npm run dev
```

Reiniciar servidor
```bash
docker exec -it node.prod /bin/bash
ps aux
ps aux | grep node
PID='PID del node app.js'
kill -2 $PID
```

## Production
Para correr con ` Dockerfile.prod`:
### Para correr con RUN
```bash
docker rm -f node.prod
docker build -t node.prod . -f Dockerfile.prod
docker run -it -d --name node.prod -v $(pwd):/usr/src/app --network="host" node.prod
docker exec -it node.prod /bin/bash
```
Comprobamos que desde el contenedor sea accesible el puerto  `27017` de `MongoDB` corriendo en el host ya sea local o desde otro contenedor:
```bash
sudo nsenter -t $(docker inspect -f '{{.State.Pid}}' node.prod) -n netstat -tulpn | grep 27017
```

### Para correr con COMPOSE
Para correr con ` docker-compose.yml`:
```bash
docker-compose --project-name "firma" build
docker-compose --project-name "firma" up --detach
docker exec -it docs_ms /bin/bash
```