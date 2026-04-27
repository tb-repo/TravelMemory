# TravelMemory: MERN Stack Deployment on AWS EC2 (Exhaustive Implementation Guide)

A comprehensive documentation of the end-to-end deployment of the **TravelMemory** application on AWS, demonstrating a highly available and secure 3-tier architecture with every implementation step verified.

---

## Table of Contents
- [About TravelMemory](#about-travelmemory)
- [Core Features](#core-features)
- [Deployment Quick-Start](#deployment-quick-start)
- [Architecture Overview](#architecture-overview)
- [Phase 1: Networking & Infrastructure Deep-Dive](#phase-1-networking--infrastructure-deep-dive)
- [Phase 2: Frontend and Backend Infrastructure Setup](#phase-2-frontend-and-backend-infrastructure-setup)
- [Phase 3: MongoDB & Nginx Setup with SSL Configuration](#phase-3-mongodb--nginx-setup-with-ssl-configuration)
- [Phase 4: Load Balancing & DNS Integration](#phase-4-load-balancing--dns-integration)
- [Phase 5: Live Application Verification](#phase-5-live-application-verification)
- [Key Learnings and Highlights](#key-learnings-and-highlights)

---

## About TravelMemory
**TravelMemory** is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for travel enthusiasts to document and cherish their journeys. It serves as a digital travel journal where users can store details about their trips, including the places they visited, the hotels they stayed at, and the unique experiences they had.

The application is built to be lightweight, responsive, and easy to use, providing a seamless way to preserve travel memories forever.

## Core Features
- **Experience Journal**: Capture detailed notes about your trips, including start/end dates and personal reflections.
- **Trip Categorization**: Organize memories by trip type, such as *Leisure*, *Backpacking*, or *Business*.
- **Expense Tracking**: Keep a record of the total cost associated with each journey.
- **Visual Memories**: Support for attaching images to each travel entry (via URL).
- **Featured Experiences**: Highlight specific trips on the homepage for quick access.
- **Responsive Design**: A user-friendly interface that works across various devices.

---

## Deployment Quick-Start
To deploy this application for your own use, follow these high-level steps:

1.  **Cloud Infrastructure**: Set up a custom VPC with Public and Private subnets. Configure Security Groups to allow traffic on ports 80 (HTTP), 443 (HTTPS), and 3001 (Backend API).
2.  **Database**: Create a MongoDB Atlas cluster and obtain your connection string.
3.  **Backend Tier**: 
    - Launch an EC2 instance in the Private subnet.
    - Clone the repository and configure the `.env` file in the `backend/` directory with your `MONGO_URI` and `PORT=3001`.
    - Install dependencies and start the Node.js server (using PM2 for persistence).
4.  **Frontend Tier**: 
    - Launch an EC2 instance in the Public subnet.
    - Update `frontend/src/url.js` to point to your backend API.
    - Generate a production build (`npm run build`).
    - Configure Nginx as a reverse proxy to serve the build files and forward API requests.
5.  **Traffic Management**: 
    - Set up an Application Load Balancer (ALB) to distribute traffic.
    - Configure Target Groups and Health Checks.
6.  **Domain & Security**: 
    - Point your custom domain to the ALB DNS using Cloudflare (CNAME).
    - Provision an SSL certificate via AWS Certificate Manager (ACM) for HTTPS.

---

## Architecture Overview

The deployment follows AWS best practices for security and scalability, utilizing a custom VPC, isolated Public/Private subnets, an Application Load Balancer, and Nginx as a reverse proxy.

![TravelMemory AWS Architecture Diagram](images/Site/architecture.png)

---

## Phase 1: Networking & Infrastructure Deep-Dive

### 1.1 Custom VPC & Subnet Architecture
The foundation is a dedicated VPC (`TravelMemory-vpc`) with a `172.31.0.0/16` CIDR. To ensure high availability, subnets were distributed across multiple Availability Zones.

| Action | Reference Image |
| :--- | :--- |
| **VPC Dashboard and CIDR Configuration** | ![VPC Setup](images/Network/vpc-img1.png) |
| **Subnet Segmentation (Public/Private)** | ![Subnets](images/Network/vpc-img1-1.png) |
| **NAT Gateway Details** | ![NAT GW](images/Network/vpc-img4.png) |
| **Route Table Details** | ![RT 5](images/Network/vpc-img5.png) |
|                           | ![RT 6](images/Network/vpc-img6.png) |
|                           | ![RT 7](images/Network/vpc-img7.png) |
|                           | ![RT 8](images/Network/vpc-img8.png) |
|                           | ![RT 9](images/Network/vpc-img9.png) |

---

### 1.2 Multi-Layer Security Grouping
Implemented a "least-privilege" traffic model using tiered security groups.

List of Security Groups Created:
![Security Groups:](images/Network/vpc-img2.png)

| SG Name | Purpose | Configuration |
| :--- | :--- | :--- |
| `ALB-SG` | Internet Edge | ![ALB SG](images/Network/vpc-img3.png) |
| `Frontend-SG` | Web Tier | ![FE SG](images/Network/vpc-img3-1.png) |
| `Backend-SG` | App Tier | ![BE SG](images/Network/vpc-img3-2.png) |

---

## Phase 2: Frontend and Backend Infrastructure

### 2.1 Frontend Instances Launch & Environment Setup
Launched a Ubuntu 24.04 EC2 server and configured the React application to optimize for production that was served via a Nginx configuration.

| Action | Screenshot | Reference Image |
| :--- | :--- | :--- |
| **Instance Creation** | Provisioning the Ubuntu 24.04 `t2.micro` | ![FE Launch1](images/Frontend/EC2-img1.png) |
|  | | ![FE Launch2](images/Frontend/EC2-img2.png) |
|  | | ![FE Launch3](images/Frontend/EC2-img3.png) |
|  | | ![FE Launch4](images/Frontend/EC2-img4.png) |
|  | | ![FE Launch5](images/Frontend/EC2-img8.png) |
| **Terminal Connection** | Initial SSH and System Update | ![FE SSH1](images/Frontend/EC2-img17.png) |
|  |  | ![FE SSH2](images/Frontend/EC2-img18.png) |
|  |  | ![FE SSH3](images/Frontend/EC2-img19.png) |
| **Git Cloning**| Clone the code from Git Repo | ![GIT SSH1](images/Site/Git-img1.png) |
|                |                              | ![GIT SSH1](images/Frontend/EC2-img22.png) |
| **Dependencies** | Running `npm install` for React | ![FE Install](images/Frontend/EC2-img24.png) |
| **Service Status** | Verification of Nginx Active Status | ![SERVICE1](images/Frontend/EC2-img25.png) |
| | | ![SERVICE2](images/Frontend/EC2-img26.png) |
</details>

---

### 2.2 Backend Instances Launch & Environment Setup
Launched a Ubuntu 24.04 EC2 server and configured the environment.

| Milestone | Action | Reference Image |
| :--- | :--- | :--- |
| **Instance Creation** | Provisioning the Ubuntu 24.04 `t2.micro` | ![BE Launch1](images/Backend/EC2-img1.png) |
|                       |                                          | ![BE Launch2](images/Backend/EC2-img2.png) |
|                       |                                          | ![BE Launch3](images/Backend/EC2-img3.png) |
|                       |                                          | ![BE Launch4](images/Backend/EC2-img4.png) |
|                       |                                          | ![BE Launch5](images/Backend/EC2-img5.png) |
|                       |                                          | ![BE Launch6](images/Backend/EC2-img6.png) |
|                       |                                          | ![BE Launch7](images/Backend/EC2-img7.png) |
| **Terminal Connection** | Initial SSH and System Update | ![BE SSH1](images/Backend/EC2-img8.png) |
|                         |                               | ![BE SSH2](images/Backend/EC2-img9.png) |
|                         |                               | ![BE SSH2](images/Backend/EC2-img10.png) |
| **Git Cloning**| Clone the code from Git Repo | ![GIT SSH1](images/Backend/Git-img2.png) |
| **Node Installation** | Install Node.js | ![NODE SSH1](images/Backend/EC2-img11.png) |
| **Env Configuration** | Setting up `.env` with MongoDB URI | ![BE Env](images/Backend/Site-img1.png) |
| **Service Launch and Connectivity Check** | Starting the Node.js process on Port 3001 | ![BE Start](images/Backend/EC2-img13.png) |
</details>

---

## Phase 3: MongoDB & Nginx Setup with SSL Configuration

### 3.1 MongoDB Cluster Creation and Connectivity
Create a new MongoDB cluster named TravelMemory via https://cloud.mongodb.com/ using FreeTier and test connectivity using MongoDB Compass installed locally:

| Action | Reference Image/File |
| :--- | :--- |
| **MongoDB Cluster Details** | ![MongoDB1](images/MongoDB/MongoDB-img1.png) |
| | ![MongoDB2](images/MongoDB/MongoDB-img2.png) |
| **Verify DB connectivity locally using MongoDB Compass** | ![MongoDB3](images/MongoDB/MongoDB-img3.png) |

### 3.2 Nginx Setup
Install and configure Nginx Service in the Frontend EC2 server for both reverse proxy and SSL configuration

| Action | Reference Image/File |
| :--- | :--- |
| **Install and Start Nginx Service** | ![NGINX Install1](images/Frontend/EC2-ssl-img1.png) |
|  | ![NGINX Install2](images/Frontend/EC2-ssl-img2.png) |
| **Configure the Nginx** | [deployment/nginx/travelmemory.conf](./deployment/nginx/travelmemory.conf) |
| **Enable configuration via symlink** | `sudo ln -s /etc/nginx/sites-available/travelmemory.conf /etc/nginx/sites-enabled/` |
| **Verify the Config and Start Nginx** | ![Nginx Up1](images/Frontend/EC2-ssl-img4.png) |
|  | ![Nginx Up2](images/Frontend/EC2-ssl-img5.png) |

### 3.3 SSL/TLS Configuration
Security was reinforced by implementing SSL certificate created in EC2 using Nginx and imported via AWS Certificate Manager (ACM).

| Action | Reference Image |
| :--- | :--- |
| SSL Config in Nginx using Certbot | ![ACM Req](images/Frontend/EC2-ssl-img7.png) |
| AWS ACM Config to import the new SSL | ![ACM1](images/Frontend/EC2-ssl-img8.png) |
| | ![ACM2](images/Frontend/EC2-ssl-img9.png) |
| | ![ACM2](images/Frontend/EC2-ssl-img10.png) |

---

## Phase 4: Load Balancing & DNS Integration

### 4.1 Application Load Balancer (ALB)
The ALB manages incoming traffic and health checks for the frontend tier.

| Phase | Description | Image |
| :--- | :--- | :--- |
| **Create ALB Target Group** | Creating the `TravelMemory-TG` | ![TG Create1](images/Site/ALB-img1.png) |
| | | ![TG Create2](images/Site/ALB-img2.png) |
| | | ![TG Create3](images/Site/ALB-img3.png) |
| | | ![TG Create4](images/Site/ALB-img4.png) |
| | | ![TG Create5](images/Site/ALB-img5.png) |
| | | ![TG Create6](images/Site/ALB-img6.png) |
| **ALB Creation** | Initial Load Balancer Config | ![ALB Creation1](images/Site/ALB-img7.png) |
| | | ![ALB Creation2](images/Site/ALB-img8.png) |
| | | ![ALB Creation3](images/Site/ALB-img9.png) |
| **ALB SSL Config** | Configure Secure Listener in ALB via ACM SSL certificate created | ![ALB SSL](images/Site/ALB-img10.png) |
| **Review** | Validate the ALB config | ![ALB Config1](images/Site/ALB-img11.png) |
| | | ![ALB Config2](images/Site/ALB-img11-1.png) |

### 4.2 Configure ALB HealthChecks for Frontend

| **ALB Health Check Config** | Frontend |
| :--- | :--- |
| Setting               | Value                               |
| Target Type           | Instance                            |
| Protocol              | HTTP                                |
| Port                  | **80**                              |
| Health Check Protocol | HTTP                                |
| Health Check Port     | **traffic port** (or explicitly 80) |
| Health Check Path     | `/health`                           |
| Success Codes         | `200`                               |


### 4.2 Cloudflare DNS & Edge Integration
Connected the domain `thiagarajanb.dpdns.org` to the AWS infrastructure via Cloudflare.

| Action | Description | Screenshot |
| :--- | :--- | :--- |
| **CNAME Record** | Mapping Domain to ALB DNS | ![DNS Record1](images/Site/DNS-img1.png) |
| | | ![DNS Record2](images/Site/DNS-img2.png) |
| | | ![DNS Record3](images/Site/DNS-img3.png) |
| **Verification** | Successful DNS Propagation with SSL | ![DNS SSL Verification1](images/Frontend/EC2-ssl-img6.png) |
| | | ![DNS SSL Verification2](images/Site/DNS-img5.png) |
</details>

---

## Phase 5: Live Application Verification

The application is fully functional and accessible via the custom domain with a valid SSL certificate.

**Homepage:**
![Live Site](images/Site/Site-img1.png)

**Detailed Experience View:**
![Experience Page](images/Site/Site-img2.png)

**Add a New Experience:**
![New Experience Page1](images/Site/Site-img3.png)
![New Experience Page2](images/Site/Site-img4.png)
![New Experience Page3](images/Site/Site-img5.png)
![New Experience Page4](images/Site/Site-img6.png)

---

## Key Learnings and Highlights

* Architecting Secure Networking: Mastered the practical implementation of a custom AWS VPC, including subnet segmentation (Public/Private), Internet Gateway integration, and granular Route Table management to ensure a secure, multi-tier environment.
* Full-Lifecycle Load Balancing: Gained hands-on experience in orchestrating Application Load Balancers (ALB), including Target Group management, advanced Listener rules, and the implementation of robust Health Check protocols for high-availability routing.
* SSL/TLS & Certificate Management: Successfully navigated the end-to-end process of securing a web application by generating certificates, managing SSL termination at the ALB layer, and utilizing AWS Certificate Manager (ACM) for centralized security.
* Network Security Maturity: Demonstrated expertise in the "Least Privilege" security model by implementing tiered Security Groups (SGs) to strictly isolate traffic between the Edge, Web, and Application layers.
* Managed DNS & Edge Integration: Learned to bridge on-premise domain management with cloud infrastructure by configuring Cloudflare DNS, managing CNAME/A records, and verifying global propagation to connect a custom domain.

---
*Deployed by Thiagarajan Baskarasubramanian* 
