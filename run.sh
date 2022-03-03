docker build . -t user/api-server
docker run -p 49160:8080 -d user/api-server