#!/bin/bash

# Update the package repository
sudo apt-get update -y

# Install necessary packages
sudo apt-get install -y nginx

# Start the Nginx service
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Copy the static site files from S3 to the Nginx web root
aws s3 sync s3://your-bucket-name /var/www/html

# Set permissions for the web root
sudo chown -R www-data:www-data /var/www/html

# Restart Nginx to apply changes
sudo systemctl restart nginx

# Output the public IP address of the instance
echo "EC2 instance is running. Access it at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"