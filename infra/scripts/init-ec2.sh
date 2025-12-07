#!/bin/bash

# EC2 Initial Setup Script
# Run this once when setting up a new EC2 instance

set -e

echo "Starting EC2 initialization..."

# Update system packages
echo "Updating system packages..."
sudo yum update -y

# Install Docker
echo "Installing Docker..."
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI (usually pre-installed on Amazon Linux)
echo "Checking AWS CLI..."
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Create directory for the application
echo "Creating application directory..."
mkdir -p /home/ec2-user/app

# Set up environment variables file
echo "Creating environment file template..."
cat > /home/ec2-user/.env.template << 'EOF'
# AWS Configuration
AWS_ACCOUNT_ID=your_account_id
AWS_REGION=us-east-1

# Application Configuration
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgres://blog:blogpass@db:5432/blogdb
EOF

echo "EC2 initialization completed!"
echo ""
echo "Next steps:"
echo "1. Copy docker-compose.yml to /home/ec2-user/"
echo "2. Create .env file from .env.template with your actual values"
echo "3. Run deploy.sh to start the application"
echo "4. Log out and log back in for Docker group membership to take effect"
