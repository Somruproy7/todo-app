# AWS Deployment Guide

## Option 1: AWS App Runner (Easiest)

### Step 1: Push to GitHub
1. Create a GitHub repository
2. Push your code to GitHub

### Step 2: Create App Runner Service
1. Go to **AWS App Runner** console
2. Click **Create service**
3. Select **GitHub** as source
4. Connect your GitHub account
5. Select your repository and branch (main)
6. Configure:
   - **Service name**: `todo-app`
   - **Port**: `5000`
   - **Environment variables**: Add `MONGODB_URI` with your MongoDB connection string
7. Click **Create and deploy**

App Runner will automatically build and deploy your app!

---

## Option 2: AWS Elastic Beanstalk (More Control)

### Step 1: Install AWS CLI
```bash
pip install awsebcli
```

### Step 2: Initialize Beanstalk
```bash
eb init -p "Node.js 18" todo-app --region us-east-1
```

### Step 3: Create Environment
```bash
eb create todo-app-env
```

### Step 4: Set Environment Variables
```bash
eb setenv MONGODB_URI="your_mongodb_uri_here"
```

### Step 5: Deploy
```bash
eb deploy
```

---

## Option 3: Docker + ECR + ECS (Advanced)

### Step 1: Build Docker Image
```bash
docker build -t todo-app .
```

### Step 2: Push to ECR
1. Create ECR repository in AWS console
2. Get login credentials from AWS
3. Tag and push image:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [YOUR_AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

docker tag todo-app:latest [YOUR_AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/todo-app:latest

docker push [YOUR_AWS_ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/todo-app:latest
```

### Step 3: Create ECS Task & Service
1. Create ECS cluster
2. Create task definition pointing to your ECR image
3. Create service

---

## Environment Variables Needed

Make sure to set these in AWS:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `NODE_ENV` - Set to `production`

---

## Estimated Costs

- **App Runner**: ~$1-5/month (free tier available)
- **Elastic Beanstalk**: ~$5-20/month
- **ECS**: ~$5-15/month

---

## Recommendation

**Start with App Runner** - it's the easiest and cheapest option for this full-stack app!
