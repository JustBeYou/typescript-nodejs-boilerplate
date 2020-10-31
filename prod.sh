#!/bin/sh

cp .env.prod app/.env
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
