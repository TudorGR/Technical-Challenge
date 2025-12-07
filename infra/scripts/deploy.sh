#!/bin/bash

# EC2 Deployment Script
set -e

echo "Starting deployment..."

# Configuration - set these as environment variables on EC2
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}"
AWS_REGION="${AWS_REGION:-us-east-1}"
ECR_BACKEND_REPO="blog-backend"
ECR_FRONTEND_REPO="blog-frontend"

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Pull latest images
echo "Pulling latest images..."
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f /home/ec2-user/docker-compose.yml down || true

# Start new containers
echo "Starting new containers..."
export AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID
export AWS_REGION=$AWS_REGION
docker-compose -f /home/ec2-user/docker-compose.yml up -d

# Clean up old images
echo "Cleaning up old images..."
docker image prune -f

echo "Deployment completed successfully!"
