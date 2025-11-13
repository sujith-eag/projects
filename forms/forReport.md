# AWS Static Site Demo — Detailed Setup and Record

This repository demonstrates hosting a simple static website using AWS S3 for static hosting and an EC2 instance for an alternative server-backed deployment.

- Status (what was performed)
- S3: site files prepared at the repository root and uploaded to an S3 bucket (site hosted as a static website).
- EC2: an Amazon Linux 2 `t3.micro` instance was launched, configured to serve the site via `nginx` and to sync content from the S3 bucket.
- IAM role: an EC2 role granting read-only access to the S3 bucket was created and attached to the instance.
- Security group: a security group allowing inbound HTTP (80) from the Internet and SSH (22) from the operator's IP was created and attached.
- SSH key: the private key used to SSH was fixed (file permissions) and used to connect to the instance for verification.

This document covers the steps performed and explains the reasons and choices.

Contents
- Prerequisites
- S3: prepare, upload, and serve
- IAM role: least-privilege access for EC2
- Security group: network access control
- EC2: launch, user-data, and verification
- Common troubleshooting and fixes (SSH key, sync, nginx)
- Optional improvements and teardown

S3 — prepare and host the static site

Files and locations
- Local site files live at the repository root and include `index.html`, `main.css`, `index.js`, `form_1.html`, `form_2.html`, `form_3.html`.

Manual console steps performed:

1) Create an S3 bucket. In the console: Services → S3 → Create bucket.
   - Select region (e.g., `ap-south-1`).
   - Uncheck "Block all public access" for public site.
   - Create.

2) Enable static website hosting for the bucket:
   - Bucket → Properties → Static website hosting → Enable.
   - Index document: `index.html`.

3) Make the content accessible (bucket policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```

4) Upload the site files to the bucket root (so `index.html` is at the root):

```bash
# from repository root (this repo)
aws s3 sync . s3://BUCKET_NAME --exclude "infra/*" --acl public-read
```


IAM role for EC2 — least privilege access

AWS Console → IAM → Roles → Create role.
* Choose "AWS service" → "EC2" → Next.
* Attach policy:
    Easiest: attach built-in AmazonS3ReadOnlyAccess.
    More secure: attach a custom policy that only allows s3:GetObject on your bucket (example below).

Steps performed in Console
- IAM → Roles → Create Role → Select EC2 → Attach the policy above (or AmazonS3ReadOnlyAccess for quick setup) → Create role (named e.g. `ec2-s3-read-role`).

Security group — network access control

Rules created
- Inbound:
  - SSH (TCP 22) — Source: your public IP (e.g., `203.0.113.5/32`) — limits attack surface.
  - HTTP (TCP 80) — Source: `0.0.0.0/0` (or restrict to specific CIDRs if needed).
- Outbound: allow all (default) so the instance can reach S3 endpoints.

EC2 instance launch and configuration

Key options chosen
- AMI: Amazon Linux 2 (common, includes yum and works with the `ec2-user` account).
- Instance type: t3.micro (cheap / free-tier eligible for demo).
- IAM role: `ec2-s3-read-role` attached so the instance can run `aws s3 sync` without credentials.
- Security group: the security group created above.
- Key pair: select an existing key pair or create one (download `.pem`).
- Auto-assign Public IP: Enabled so the instance has a public IPv4 address.

User-data script used (runs on first boot)

Paste into "Advanced details -> user data" when launching the instance:

```bash
#!/bin/bash
set -e

# Adjust region and bucket name
BUCKET="BUCKET_NAME"
REGION="ap-south-1"

# update and install nginx, awscli
yum update -y
yum install -y nginx aws-cli

# start nginx
systemctl enable nginx
systemctl start nginx

# sync from S3 (will use the instance's IAM role for credentials)
mkdir -p /usr/share/nginx/html
aws s3 sync s3://$BUCKET /usr/share/nginx/html --region $REGION --delete
chown -R nginx:nginx /usr/share/nginx/html
systemctl restart nginx

echo "Site synced from s3://$BUCKET to /usr/share/nginx/html" >> /var/log/user-data.log
```

Post-launch verification steps performed

1) SSH to the instance (fixing private key permissions locally if needed):

```bash
chmod 400 for_demo_static_host.pem

ssh -i for_demo_static_host.pem ec2-user@<PUBLIC_IP>
```

2) Verify the files are present and nginx is serving:

```bash
sudo systemctl status nginx --no-pager
ls -la /usr/share/nginx/html
```

If files are missing, re-run the S3 sync (this will use the instance IAM role)
```bash
# replace BUCKET_NAME and REGION if different
aws s3 sync s3://BUCKET_NAME /usr/share/nginx/html --region us-east-1 --delete
sudo chown -R nginx:nginx /usr/share/nginx/html
sudo systemctl restart nginx
```

3) Test the public endpoint:

```bash
curl -I http://<PUBLIC_IP>
# or open http://<PUBLIC_IP> in a browser
```
