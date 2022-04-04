# How to build the system
docker-compose up -d
http://localhost:3333

# Running commands
docker ps
docker exec -it <container name> npm lint
docker exec -it <container name> npm i
docker exec -it <container name> /bin/sh


# Connecting to remote server to run commands
This command should run from within the docker image
docker exec -it <container name> /bin/sh
ssh -4 -N -i key.pem -L 8001:127.0.0.1:8001 ubuntu@3.111.132.155