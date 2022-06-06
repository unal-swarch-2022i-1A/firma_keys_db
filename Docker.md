# Docker
## Development
Para correr con `Dockerfile.dev`:
```bash
docker rm -f firma_keys_dev && \
docker build -t firma_keys_dev . -f Dockerfile.dev && \
docker run -it -d \
    --name firma_keys_dev \
    -v $(pwd)/package.json:/usr/src/app/package.json \
    -v $(pwd)/src:/usr/src/app/src \
    -v $(pwd)/tests:/usr/src/app/tests \
    --add-host=host.docker.internal:host-gateway \
    firma_keys_dev && \
docker exec -it firma_keys_dev /bin/bash
```
