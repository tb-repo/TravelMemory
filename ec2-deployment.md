# EC2 Deployment Guide – TravelMemory Application

## Overview

This document describes how the TravelMemory application is deployed on AWS EC2 using a simple 3-tier architecture.

The application consists of:

* React frontend
* Node.js backend (Express)
* NGINX as reverse proxy
* AWS Application Load Balancer (ALB)

---

## Architecture

```
 User (Browser)
      ↓
   ALB (HTTPS)
      ↓
NGINX (running on Frontend EC2)
      ↓
  Frontend EC2
      ↓
Backend EC2 (Node.js API)
      ↓
    MongoDB
```

### Key Responsibilities

| Component    | Role                                      |
| ------------ | ----------------------------------------- |
| ALB          | Entry point, handles HTTPS                |
| Frontend EC2 | Serves React static files + reverse proxy |
| NGINX        | Routes `/api` traffic to backend          |
| Backend EC2  | Handles API requests                      |
| MongoDB      | Stores application data                   |

---

## Infrastructure Setup

### 1. EC2 Instances

Create two EC2 instances:

* **Frontend EC2**
* **Backend EC2**

Both should:

* Be in same VPC
* Be in private subnet or accessible via ALB
* Have proper security groups

---

### 2. Security Groups

#### ALB Security Group

* Allow:

  * 80 (HTTP)
  * 443 (HTTPS)

#### Frontend EC2 Security Group

* Allow:

  * Port 80 from ALB SG
  * SSH (22) from your IP

#### Backend EC2 Security Group

* Allow:

  * Port 3001 from Frontend SG
  * SSH (22) from your IP

---

## Backend Setup (Node.js)

### Install dependencies

```bash
sudo apt update
sudo apt install nodejs npm -y
```

### Run application

```bash
cd backend
npm install
node index.js
```

### Ensure app listens on:

```js
app.listen(PORT, '0.0.0.0')
```

---

## Backend Environment Variables

Create `.env`:

```
PORT=3001
MONGO_URI=<your-mongodb-uri>
FRONTEND_URL=https://travelmemory.thiagarajanb.dpdns.org
```

---

## Frontend Setup (React)

### Build the app

```bash
cd frontend
npm install
npm run build
```

### Copy build files

```bash
sudo mkdir -p /var/www/travelmemory/html
sudo cp -r build/* /var/www/travelmemory/html/
```

---

## Frontend Environment Variables

Create `.env`:

```
REACT_APP_API_URL=/api
```

This ensures all API calls go through NGINX.

---

## NGINX Configuration

File:

```
/etc/nginx/sites-available/travelmemory
```

### Final Configuration

```nginx
server {
    listen 80;
    server_name travelmemory.thiagarajanb.dpdns.org;

    root /var/www/travelmemory/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://172.31.96.57:3001/;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
```

### Enable config

```bash
sudo ln -s /etc/nginx/sites-available/travelmemory /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ALB Configuration

### Target Group (Frontend)

* Protocol: HTTP
* Port: 80
* Health check path: `/health`

### Listener Rules

| Path | Target      |
| ---- | ----------- |
| `/`  | Frontend TG |

> Note: `/api` routing is handled by NGINX (not ALB)

---

## Application Flow

### Frontend Request

```
GET /
→ ALB → Frontend EC2 → React App
```

### API Request

```
GET /api/trip
→ ALB → Frontend EC2 (NGINX)
→ Backend EC2 (Node API)
→ MongoDB
```

---

## API Configuration (Frontend)

Example (Home.js):

```js
axios.get(`${baseUrl}/trip/`)
```

Where:

```js
export const baseUrl = process.env.REACT_APP_API_URL || "/api";
```

---

## Deployment Steps Summary

1. Launch EC2 instances
2. Configure security groups
3. Deploy backend (Node.js)
4. Deploy frontend build
5. Configure NGINX
6. Setup ALB + target group
7. Configure domain (Route53 / DNS)
8. Test endpoints

---

## Verification

### Frontend

```
https://travelmemory.thiagarajanb.dpdns.org
```

### API

```
https://travelmemory.thiagarajanb.dpdns.org/api/trip
```

### Health Check

```
http://<frontend-ec2-ip>/health
```

---

## Notes

* Backend is not exposed publicly
* All traffic flows through frontend (NGINX)
* CORS issues are avoided using same-origin routing
* ALB only routes to frontend

---

## Next Improvements (Optional)

* Move backend behind internal ALB
* Use PM2 for backend process management
* Add CloudWatch logging
* Enable autoscaling
* Add HTTPS termination only at ALB

---