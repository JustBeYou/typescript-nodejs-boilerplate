xcopy .env.prod .env
docker-compose -f docker-compose.yml build 
docker-compose -f docker-compose.yml up -d 
