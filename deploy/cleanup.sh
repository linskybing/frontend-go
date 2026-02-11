#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

IMAGE_NAME="frontend-go"
IMAGE_TAG="dev"
CONTAINER_NAME="frontend-dev"

echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
echo ""

# Stop container
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${BLUE}Stopping container: ${CONTAINER_NAME}${NC}"
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
    echo -e "${GREEN}Container removed${NC}"
fi

# Remove image
if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:${IMAGE_TAG}$"; then
    echo -e "${BLUE}Removing image: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
    docker rmi ${IMAGE_NAME}:${IMAGE_TAG}
    echo -e "${GREEN}Image removed${NC}"
fi

echo ""
echo -e "${GREEN}Cleanup complete${NC}"
