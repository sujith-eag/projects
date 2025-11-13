#!/bin/bash

# Variables
BUCKET_NAME="your-s3-bucket-name"  # Replace with your desired bucket name
REGION="us-east-1"                   # Replace with your desired AWS region

# Create S3 bucket
aws s3api create-bucket --bucket $BUCKET_NAME --region $REGION --create-bucket-configuration LocationConstraint=$REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload site files to S3
aws s3 sync ../site s3://$BUCKET_NAME

# Set bucket policy to allow public access
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'"$BUCKET_NAME"'/*"
        }
    ]
}' 

echo "Deployment to S3 completed. Access your site at: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"