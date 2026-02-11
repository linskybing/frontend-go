#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

IMAGE_NAME="frontend-go"
PROJECT="library"
IMAGE_TAG="${1:-latest}"
REGISTRY="${2:-10.121.124.21:30003}"
FULL_IMAGE="${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${YELLOW}=== Frontend Build & Deploy ===${NC}"
echo -e "Image: ${FULL_IMAGE}"
echo ""

# Step 1: Build
echo -e "${YELLOW}Step 1: Building application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Build successful!${NC}"
echo ""

# Step 2: Build Docker image
echo -e "${YELLOW}Step 2: Building Docker image...${NC}"
docker build -t ${FULL_IMAGE} -f Dockerfile ..

if [ $? -ne 0 ]; then
    echo -e "${RED}Docker build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Docker image built successfully!${NC}"
echo ""

# Step 3: Push to registry (optional)
echo -e "${YELLOW}Step 3: Pushing image to registry...${NC}"
docker push ${FULL_IMAGE}
if [ $? -ne 0 ]; then
    echo -e "${RED}Docker push failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Image pushed successfully!${NC}"
echo ""

# Step 4: Create/Update Kubernetes Deployment
echo -e "${YELLOW}Step 4: Deploying to Kubernetes...${NC}"
kubectl apply -f k8s-deployment.yaml
if [ $? -ne 0 ]; then
    echo -e "${RED}Kubernetes deployment apply failed!${NC}"
    exit 1
fi

echo -e "${YELLOW}Updating image in deployment...${NC}"
kubectl set image deployment/frontend-app \
  frontend=${FULL_IMAGE} \
  -n frontend
if [ $? -ne 0 ]; then
    echo -e "${RED}Kubernetes deployment failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Kubernetes deployment successful!${NC}"
echo ""

# Step 5: Wait for rollout
echo -e "${YELLOW}Step 5: Waiting for rollout...${NC}"
kubectl rollout status deployment/frontend-app -n frontend
if [ $? -ne 0 ]; then
    echo -e "${RED}Rollout failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Rollout successful!${NC}"
echo ""

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Service: kubectl get svc -n frontend"
echo -e "Status: kubectl get deployment -n frontend"
echo -e "Logs: kubectl logs -f deployment/frontend-app -n frontend"
