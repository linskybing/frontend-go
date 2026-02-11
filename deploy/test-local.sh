#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="frontend-go"
IMAGE_TAG="dev"
CONTAINER_NAME="frontend-dev"
LOCAL_PORT="8080"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Frontend Local Docker Test           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Clean up old containers
echo -e "${YELLOW}Step 1: Cleaning up old containers...${NC}"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Stopping and removing old container..."
    docker stop ${CONTAINER_NAME} 2>/dev/null
    docker rm ${CONTAINER_NAME} 2>/dev/null
    echo -e "${GREEN}Old container removed${NC}"
else
    echo "No existing container found"
fi
echo ""

# Step 2: Build application
echo -e "${YELLOW}Step 2: Building application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}Build successful${NC}"
echo ""

# Step 3: Build Docker image
echo -e "${YELLOW}Step 3: Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -f ./deploy/Dockerfile .
if [ $? -ne 0 ]; then
    echo -e "${RED}Docker build failed${NC}"
    exit 1
fi
echo -e "${GREEN}Docker image built: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
echo ""

# Step 4: Run container
echo -e "${YELLOW}Step 4: Running container...${NC}"
docker run -d \
  --name ${CONTAINER_NAME} \
  -p ${LOCAL_PORT}:80 \
  ${IMAGE_NAME}:${IMAGE_TAG}

if [ $? -ne 0 ]; then
    echo -e "${RED}Container failed to start${NC}"
    exit 1
fi
echo -e "${GREEN}Container started${NC}"
echo ""

# Step 5: Wait for container readiness
echo -e "${YELLOW}Step 5: Waiting for container to be ready...${NC}"
sleep 2
for i in {1..10}; do
    if docker exec ${CONTAINER_NAME} wget -q -O /dev/null http://localhost/index.html 2>/dev/null; then
        echo -e "${GREEN}Container is ready${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}Container health check failed${NC}"
        docker logs ${CONTAINER_NAME}
        exit 1
    fi
    echo "Attempt $i/10..."
    sleep 1
done
echo ""

# Step 6: Show summary
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Local Test Ready                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Access your app:${NC}"
echo -e "  http://localhost:${LOCAL_PORT}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  View logs:"
echo -e "     ${YELLOW}docker logs -f ${CONTAINER_NAME}${NC}"
echo ""
echo -e "  Stop container:"
echo -e "     ${YELLOW}docker stop ${CONTAINER_NAME}${NC}"
echo ""
echo -e "  Remove container:"
echo -e "     ${YELLOW}docker rm ${CONTAINER_NAME}${NC}"
echo ""
echo -e "  Check running containers:"
echo -e "     ${YELLOW}docker ps${NC}"
echo ""
echo -e "  Clean up (remove image & container):"
echo -e "     ${YELLOW}./deploy/cleanup.sh${NC}"
echo ""
