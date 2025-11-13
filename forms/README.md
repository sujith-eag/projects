# AWS Static Site Demo — Detailed Setup and Record

This repository demonstrates hosting a simple static website using AWS S3 for static hosting and an EC2 instance for an alternative server-backed deployment. This README documents the exact steps and reasoning used to set up the environment, the resources created, commands used, and troubleshooting performed.

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

Prerequisites
- AWS account with permissions to create S3 buckets, EC2 instances, IAM roles, and security groups.
- AWS CLI configured locally (for sync commands and debugging) or use the Console.
- Basic knowledge of SSH and managing private key files.

S3 — prepare and host the static site

Why S3: S3 static website hosting is cheap, scalable and ideal for static HTML/CSS/JS sites. We host the site on S3 and optionally use CloudFront if HTTPS and CDN are needed.

Files and locations
- Local site files live at the repository root and include `index.html`, `main.css`, `index.js`, `form_1.html`, `form_2.html`, `form_3.html`.

Manual console steps performed (or reproducible with CLI):

1) Create an S3 bucket (globally unique name). In the console: Services → S3 → Create bucket.
   - Select region (e.g., `us-east-1`).
   - Uncheck "Block all public access" if you want public site (the README below also shows a bucket policy alternative).
   - Create.

2) Enable static website hosting for the bucket:
   - Bucket → Properties → Static website hosting → Enable.
   - Index document: `index.html`. Error document optional.

3) Make the content accessible (bucket policy). Example bucket policy (replace BUCKET_NAME):

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

Using AWS CLI (recommended for exact structure):

```bash
# from repository root (this repo)
aws s3 sync . s3://BUCKET_NAME --exclude "infra/*" --acl public-read
```

5) Verify website endpoint (S3 console → Properties → Static website hosting → Endpoint) and test:

```bash
curl -I http://BUCKET_NAME.s3-website-REGION.amazonaws.com
```

Notes and reasoning
- Keep `index.html` at the bucket root. If `index.html` is nested under a folder, the website endpoint will return 404 for the root path.
- Using a bucket policy is preferred over per-object ACLs for simpler management.
- For HTTPS and a custom domain, use CloudFront + ACM; CloudFront can point to the S3 website endpoint to preserve website behavior.

IAM role for EC2 — least privilege access

Why: The EC2 instance needs to read files from the S3 bucket. Instead of embedding AWS credentials on the instance (insecure), we create an IAM role that grants the instance the permissions it needs.

AWS Console → IAM → Roles → Create role.
* Choose "AWS service" → "EC2" → Next.
* Attach policy:
    Easiest: attach built-in AmazonS3ReadOnlyAccess.
    More secure: attach a custom policy that only allows s3:GetObject on your bucket (example below).

Policy used (scoped to the bucket): replace BUCKET_NAME

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::BUCKET_NAME",
        "arn:aws:s3:::BUCKET_NAME/*"
      ]
    }
  ]
}
```

Steps performed in Console
- IAM → Roles → Create Role → Select EC2 → Attach the policy above (or AmazonS3ReadOnlyAccess for quick setup) → Create role (named e.g. `ec2-s3-read-role`).

Security group — network access control

Why: Control network access to the instance by limiting ports and sources. For a public web server we allow HTTP (port 80) from the Internet. For SSH, limit to only your administrative IP.

Rules created
- Inbound:
  - SSH (TCP 22) — Source: your public IP (e.g., `203.0.113.5/32`) — limits attack surface.
  - HTTP (TCP 80) — Source: `0.0.0.0/0` (or restrict to specific CIDRs if needed).
- Outbound: allow all (default) so the instance can reach S3 endpoints.

EC2 instance launch and configuration

Why: We create a small Amazon Linux 2 `t2.micro` to host `nginx` and sync the site from S3. This demonstrates serving the static site from an instance and how the EC2 role integrates with S3.

Key options chosen
- AMI: Amazon Linux 2 (common, includes yum and works with the `ec2-user` account).
- Instance type: t2.micro (cheap / free-tier eligible for demo).
- IAM role: `ec2-s3-read-role` attached so the instance can run `aws s3 sync` without credentials.
- Security group: the security group created above.
- Key pair: select an existing key pair or create one (download `.pem`).
- Auto-assign Public IP: Enabled so the instance has a public IPv4 address.

User-data script used (runs on first boot)

Paste into "Advanced details -> user data" when launching the instance (replace `BUCKET_NAME` and `REGION`):

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

Why this user-data
- Installs `nginx` to serve files.
- Installs `aws-cli` and performs `aws s3 sync` leveraging the instance role for credentials — secure and automated.
- Writes a log to `/var/log/user-data.log` for troubleshooting.

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

curl -I http://localhost
sudo tail -n 200 /var/log/nginx/error.log
sudo cat /var/log/user-data.log
```

If files are missing, re-run the S3 sync (this will use the instance IAM role)
```bash
# replace BUCKET_NAME and REGION if different
aws s3 sync s3://BUCKET_NAME /usr/share/nginx/html --region us-east-1 --delete
sudo chown -R nginx:nginx /usr/share/nginx/html
sudo systemctl restart nginx
```


3) From your laptop, test the public endpoint:

```bash
curl -I http://<PUBLIC_IP>
# or open http://<PUBLIC_IP> in a browser
```

Common troubleshooting and fixes performed

- SSH "bad permissions" error: fixed by running `chmod 400 yourkey.pem` so ssh will accept the key and authenticate.
- S3 "NoSuchKey"/404 for `index.html`: resolved by ensuring `index.html` was uploaded at the bucket root (s3 sync from `site/` to the bucket root) rather than nested under a folder.
- IAM permission errors during `aws s3 sync`: fixed by attaching the scoped S3 read policy (or AmazonS3ReadOnlyAccess) to the EC2 role.
- If nginx served default page or no content: re-run `aws s3 sync` to copy site files into `/usr/share/nginx/html` and `chown -R nginx:nginx /usr/share/nginx/html`.

Optional enhancements

- Elastic IP: allocate an Elastic IP and associate with the instance to preserve a stable public IP across restarts.
- HTTPS: front the site with CloudFront or an Application Load Balancer + ACM certificate for HTTPS. CloudFront is the recommended route for static sites on S3 and provides CDN caching.
- Auto-update: add a cronjob or systemd timer on the EC2 instance to regularly run `aws s3 sync` to pick up changes from the bucket.

Security and cost notes

- Least-privilege IAM: scope the EC2 IAM policy to the single bucket used by the demo.
- SSH access: restrict SSH to your IP; use Session Manager (SSM) for keyless access if you prefer.
- Costs: S3 storage & data out (small for static site), EC2 instance hourly charges if running. Destroy the instance and release the EIP when not needed.

Teardown (to avoid charges)

1) Terminate the EC2 instance (EC2 → Instances → Actions → Instance State → Terminate).
2) Release any Elastic IPs allocated (EC2 → Network & Security → Elastic IPs → Release).
3) Remove the IAM role if not used elsewhere (IAM → Roles → Delete).
4) If you don't need the S3 bucket, empty and delete it (S3 → Bucket → Empty then Delete), or use `aws s3 rb --force s3://BUCKET_NAME`.

Appendix — useful commands

Upload site to S3 root:
```bash
# from repository root; exclude infra/ so deployment scripts are not published
aws s3 sync . s3://BUCKET_NAME --exclude "infra/*" --acl public-read
```

Check object exists at bucket root:
```bash
aws s3api head-object --bucket BUCKET_NAME --key index.html
```

Verify nginx locally on the instance:
```bash
curl -I http://localhost
```

Check cloud-init/user-data logs for errors:
```bash
sudo cat /var/log/cloud-init-output.log
sudo cat /var/log/user-data.log
```

If you want, I can also add a small `deploy-ec2.sh` and `deploy-s3.sh` that automate the exact commands used here, or a Terraform snippet that creates the IAM role, security group and EC2 instance with the same user-data. Tell me which automation option you prefer.

---
Generated: detailed record of steps used to set up S3 static hosting and an EC2-backed static site, including IAM and security group configuration to support secure, least-privilege access.
