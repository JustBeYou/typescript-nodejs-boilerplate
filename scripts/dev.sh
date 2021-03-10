#!/bin/sh

cp .env.dev web/.env
cp .env.dev .env
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
