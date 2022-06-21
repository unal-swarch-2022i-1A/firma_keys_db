# Docker
## Development
Para correr con `Dockerfile.dev`:
```bash
docker rm -f firma_keys_ms && \
docker build -t firma_keys_ms:dev . -f Dockerfile.dev && \
docker run -it -d \
    --name firma_keys_dev \
    -v $(pwd)/package.json:/usr/src/app/package.json \
    -v $(pwd)/src:/usr/src/app/src \
    -v $(pwd)/tests:/usr/src/app/tests \
    --add-host=host.docker.internal:host-gateway \
    firma_keys_ms:dev && \
docker logs --tail 1000 -f firma_keys_dev  
docker exec -it firma_keys_dev /bin/bash
```
## Production
Para correr con `Dockerfile.prod`:
```bash
docker rm -f firma_keys_ms && \
docker build -t firma_keys_ms:prod . -f Dockerfile.prod && \
docker run -it -d \
    --name firma_keys_ms \
    -v $(pwd)/package.json:/usr/src/app/package.json \
    -v $(pwd)/src:/usr/src/app/src \
    -v $(pwd)/tests:/usr/src/app/tests \
    --add-host=host.docker.internal:host-gateway \
    firma_keys_ms:prod \
    generate public private && \
docker logs --tail 1000 -f firma_keys_ms  
docker exec -it firma_keys_ms /bin/bash
```