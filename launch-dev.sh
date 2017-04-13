#!/bin/bash

# build docker images
docker-compose build

# service shutdown
docker-compose down

# service respawn
docker-compose up
