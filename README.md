
[![Test](https://github.com/mabumusa1/kub8-api/actions/workflows/test.yaml/badge.svg)](https://github.com/mabumusa1/kub8-api/actions/workflows/test.yaml)

[![Coverage Status](https://coveralls.io/repos/github/mabumusa1/kub8-api/badge.svg?branch=main)](https://coveralls.io/github/mabumusa1/kub8-api?branch=main)

## Getting Started

We are building a simple Adonisjs app that controls a kubernetes cluster,as a developer we recommend that you have the folloiwng tools installed on your machine before you start writing code for the system:

1. Ubuntu as the OS, you can use Windows or MacOS but we recommend Ubuntu

2. Docker & Docker compsose installed on your OS

3. Use Visual Studio code as IDE

# How to build the system

The following command will run the system inside a docker image and it will reload each time you make changes to your code files

```docker-compose up -d```

Once it is running you can access the system using the follwoing link

<http://localhost:3333>

# Running commands

In order to enter the docker machine and run commands from the machine your can run

```docker exec -it adonis_app /bin/sh```
``docker exec -it adonis_db mysql -pdb``
From there you can run any command like `npm run lint`

# Testing with a real kubernetes cluster

We have a small cluster used for testing, for making the calls to that server you need to have

1. Key which will be provided to you privatly
2. Running the following command

```docker exec -it adonis_app /usr/bin/ssh -4 -N -i key.pem -L 8001:127.0.0.1:8001 ubuntu@3.111.132.155```