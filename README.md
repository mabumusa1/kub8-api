# How to build the system
docker-compose up -d
http://localhost:3333

# Running commands
docker exec -it adonis_app /bin/sh
npm lint
docker ps

Not working yet, but we need to be able to open the tunnel directly
docker exec -it adonis_app /bin/sh /usr/bin/ssh -4 -N -i key.pem -L 8001:127.0.0.1:8001 ubuntu@3.111.132.155