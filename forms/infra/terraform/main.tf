provider "aws" {
  region = "us-east-1"  # Change to your preferred region
}

resource "aws_s3_bucket" "static_site_bucket" {
  bucket = "your-unique-bucket-name"  # Change to a unique bucket name
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_s3_bucket_object" "site_files" {
  for_each = fileset("${path.module}/../../site", "**/*")

  bucket = aws_s3_bucket.static_site_bucket.bucket
  key    = each.value
  source = "${path.module}/../../site/${each.value}"
  acl    = "public-read"
}

resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Change to a valid AMI ID for your region
  instance_type = "t2.micro"

  user_data = file("${path.module}/../ec2/user-data.sh")

  tags = {
    Name = "WebServerInstance"
  }
}

output "s3_bucket_url" {
  value = aws_s3_bucket.static_site_bucket.website_endpoint
}

output "ec2_instance_public_ip" {
  value = aws_instance.web_server.public_ip
}