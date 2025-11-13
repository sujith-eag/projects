#!/bin/bash

# Variables
INSTANCE_TYPE="t2.micro"
KEY_NAME="your-key-name"  # Replace with your key pair name
SECURITY_GROUP="your-security-group"  # Replace with your security group name
AMI_ID="ami-0c55b159cbfafe1f0"  # Replace with the desired AMI ID
USER_DATA_FILE="user-data.sh"

# Launch EC2 instance
aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-groups $SECURITY_GROUP \
    --user-data file://$USER_DATA_FILE \
    --output json

echo "EC2 instance launched successfully."