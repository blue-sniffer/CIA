#!/bin/bash
echo "[DEPLOY] Frontend deployment started at $(date)"
cd /home/service-web/front

# Pull latest code from Gitea
git pull http://n0tth3adm1n:superpassword@192.168.56.102/n0tth3adm1n/front-end.git master

# Rebuild and restart container
docker-compose down
docker-compose up --build -d

echo "[DEPLOY] Frontend deployment completed at $(date)"
