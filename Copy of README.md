# TravelMemory: MERN Stack Deployment on AWS EC2 (Exhaustive Implementation Guide)

A comprehensive documentation of the end-to-end deployment of the **TravelMemory** application on AWS, demonstrating a highly available and secure 3-tier architecture with every implementation step verified.

---

## 📖 Table of Contents
- [About TravelMemory](#-about-travelmemory)
- [Core Features](#-core-features)
- [Deployment Quick-Start](#-deployment-quick-start)
- [🏗 Architecture Overview](#-architecture-overview)
- [🛠 Phase 1: Networking & Infrastructure](#-phase-1-networking--infrastructure-deep-dive)
- [🚀 Phase 2: Backend Infrastructure](#-phase-2-backend-infrastructure-nodejsubuntu)
- [🌐 Phase 3: Frontend & Reverse Proxy](#-phase-3-frontend--reverse-proxy-reactnginx)
- [⚖️ Phase 4: Load Balancing & DNS Integration](#-phase-4-load-balancing--dns-integration)
- [📊 Phase 5: Database & Live Application](#-phase-5-database--live-application)
- [📝 Key Learnings](#-key-learnings--implementation-highlights)

---

## 🌟 About TravelMemory
**TravelMemory** is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for travel enthusiasts to document and cherish their journeys. It serves as a digital travel journal where users can store details about their trips, including the places they visited, the hotels they stayed at, and the unique experiences they had.

The application is built to be lightweight, responsive, and easy to use, providing a seamless way to preserve travel memories forever.

## ✨ Core Features
- **Experience Journal**: Capture detailed notes about your trips, including start/end dates and personal reflections.
- **Trip Categorization**: Organize memories by trip type, such as *Leisure*, *Backpacking*, or *Business*.
- **Expense Tracking**: Keep a record of the total cost associated with each journey.
- **Visual Memories**: Support for attaching images to each travel entry (via URL).
- **Featured Experiences**: Highlight specific trips on the homepage for quick access.
- **Responsive Design**: A user-friendly interface that works across various devices.

---

## 🛠 Deployment Quick-Start
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

## 🏗 Architecture Overview

The deployment follows AWS best practices for security and scalability, utilizing a custom VPC, isolated Public/Private subnets, an Application Load Balancer, and Nginx as a reverse proxy.

![TravelMemory AWS Architecture Diagram](images/Site/architecture.png)

---

## 🛠 Phase 1: Networking & Infrastructure Deep-Dive

### 1.1 Custom VPC & Subnet Architecture
The foundation is a dedicated VPC (`TravelMemory-vpc`) with a `172.31.0.0/16` CIDR. To ensure high availability, subnets were distributed across multiple Availability Zones.

| Step | Action | Reference Image |
| :--- | :--- | :--- |
| 1 | VPC Dashboard and CIDR Configuration | ![VPC Setup](images/Network/vpc-img1.png) |
| 2 | Subnet Segmentation (Public/Private) | ![Subnets](images/Network/vpc-img2.png) |

<details>
<summary>📸 <b>View Detailed Networking Sub-steps (VPC, IGW, Route Tables)</b></summary>

> In this phase, I configured the Internet Gateway, attached it to the VPC, and established custom Route Tables for both Public and Private traffic flow.

| Action | Screenshot |
| :--- | :--- |
| **VPC Details** | ![VPC Map](images/Network/vpc-img1-1.png) |
| **Subnet Creation and Associations** | ![Subnet 10](images/Network/vpc-img10.png) <br> ![Subnet 11](images/Network/vpc-img11.png) <br> ![Subnet 1-1](images/Network/vpc-img1-1.png) |
| **NAT Gateway Details** | ![NAT GW](images/Network/vpc-img4.png) |
| **Route Table Details** | ![RT 5](images/Network/vpc-img5.png) |
| | ![RT 6](images/Network/vpc-img6.png) |
| | ![RT 7](images/Network/vpc-img7.png) |
| | ![RT 8](images/Network/vpc-img8.png) |
| | ![RT 9](images/Network/vpc-img9.png) |
</details>

### 1.2 Multi-Layer Security Grouping
I implemented a "least-privilege" traffic model using tiered security groups.

<details>
<summary>📸 <b>View Detailed Security Group Rules & Configuration</b></summary>

| SG Name | Purpose | Configuration |
| :--- | :--- | :--- |
| `ALB-SG` | Internet Edge | ![ALB SG](images/Network/vpc-img3-1.png) |
| `Frontend-SG` | Web Tier | ![FE SG](images/Network/vpc-img3-2.png) |
| `Backend-SG` | App Tier | ![BE SG](images/Network/vpc-img3.png) |
</details>

---

## 🚀 Phase 2: Backend Infrastructure (Node.js/Ubuntu)

### 2.1 Instance Launch & Environment
Launched an Ubuntu 24.04 server and configured the MERN backend environment.

<details>
<summary>📸 <b>View Detailed Backend Implementation (Provisioning & CLI)</b></summary>

| Milestone | Action | Reference Image |
| :--- | :--- | :--- |
| **Instance Creation** | Provisioning the Ubuntu 24.04 `t2.micro` | ![BE Launch](images/Backend/EC2-img1.png) |
| **Terminal Connection** | Initial SSH and System Update | ![BE SSH](images/Backend/EC2-img3.png) |
| **Env Configuration** | Setting up `.env` with MongoDB URI | ![BE Env](images/Backend/EC2-img5.png) |
| **Service Launch** | Starting the Node.js process on Port 3001 | ![BE Start](images/Backend/EC2-img10.png) |
| **Connectivity Check** | Internal testing of the API endpoint | ![BE Check](images/Backend/EC2-img13.png) |
</details>

---

## 🌐 Phase 3: Frontend & Reverse Proxy (React/Nginx)

### 3.1 Build and Nginx Setup
The React application was optimized for production and served via a hardened Nginx configuration.

| Step | Action | Configuration / Reference |
| :--- | :--- | :--- |
| 1 | Create Nginx configuration | [deployment/nginx/travelmemory.conf](./deployment/nginx/travelmemory.conf) |
| 2 | Enable configuration via symlink | `sudo ln -s /etc/nginx/sites-available/travelmemory.conf /etc/nginx/sites-enabled/` |
| 3 | Verification | ![Nginx Up](images/Frontend/EC2-img21.png) |

<details>
<summary>📸 <b>View Detailed Frontend & Nginx Sub-steps</b></summary>

| Action | Screenshot |
| :--- | :--- |
| **Dependencies** | Running `npm install` for React | ![FE Install](images/Frontend/EC2-img10.png) |
| **Optimization** | Generating the Production Build | ![FE Build](images/Frontend/EC2-img11.png) |
| **Nginx Logic** | Configuring the Reverse Proxy Routes | ![Nginx Config](images/Frontend/EC2-img18.png) |
| **Service Status** | Verification of Nginx Active Status | ![Nginx Up](images/Frontend/EC2-img21.png) |
</details>

### 3.2 SSL/TLS Implementation
Security was reinforced by implementing SSL certificates via AWS Certificate Manager (ACM).

<details>
<summary>📸 <b>View Detailed SSL/ACM Configuration Steps</b></summary>

| Step | Action | Reference Image |
| :--- | :--- | :--- |
| 1 | Certificate Request in ACM | ![ACM Req](images/Frontend/EC2-ssl-img1.png) |
| 2 | DNS Validation in Cloudflare | ![DNS Val](images/Frontend/EC2-ssl-img3.png) |
| 3 | Certificate Issued & Ready | ![ACM Issued](images/Frontend/EC2-ssl-img5.png) |
| 4 | HTTPS Listener Configuration | ![ALB SSL](images/Frontend/EC2-ssl-img10.png) |
</details>

---

## ⚖️ Phase 4: Load Balancing & DNS Integration

### 4.1 Application Load Balancer (ALB)
The ALB manages incoming traffic and performs continuous health monitoring of the frontend tier to ensure zero-downtime routing.

| Requirement | Target Group Setting | Description |
| :--- | :--- | :--- |
| **Protocol** | HTTP | Standard web traffic monitoring |
| **Path** | `/health` | Dedicated lightweight health endpoint |
| **Healthy Threshold** | 5 consecutive successes | Ensures instance is fully stabilized |
| **Unhealthy Threshold** | 2 consecutive failures | Rapidly removes failing nodes from rotation |
| **Timeout** | 5 seconds | Prevents slow responses from hanging the balancer |
| **Interval** | 30 seconds | Balanced check frequency for low overhead |
| **Success Codes** | 200 | Expects a standard HTTP OK response |

#### Health Endpoint Implementation
I implemented specific logic at each layer to respond to these ALB pings:
*   **Nginx Layer**: Returns a static `200 OK` via the `/health` location block.
*   **Node.js Layer**: A dedicated Express route returns `{ status: "OK" }` to verify the application process is alive.

<details>
<summary>📸 <b>View Exhaustive ALB Creation & Target Group Gallery</b></summary>

> This gallery documents the full step-by-step ALB setup process.

| Phase | Description | Image |
| :--- | :--- | :--- |
| **ALB Creation** | Initial Load Balancer Config | ![ALB Start](images/Site/ALB-img1.png) |
| **Network Config** | Selecting VPC and Subnets | ![ALB Net](images/Site/ALB-img4.png) |
| **Target Groups** | Creating the `TravelMemory-TG` | ![TG Create](images/Site/ALB-img9.png) |
| **Registration** | Registering Frontend Targets | ![TG Reg](images/Site/ALB-img10.png) |
| **Review** | Final validation before launch | ![ALB Review](images/Site/ALB-img14.png) |
| **Active Status** | ALB Provisioning Complete | ![ALB Active](images/Site/ALB-img19.png) |
</details>

### 4.2 Cloudflare DNS & Edge Integration
Connected the domain `thiagarajanb.dpdns.org` to the AWS infrastructure via Cloudflare.

<details>
<summary>📸 <b>View Cloudflare DNS & Analytics Gallery</b></summary>

| Action | Screenshot |
| :--- | :--- |
| **CNAME Record** | Mapping Domain to ALB DNS | ![DNS Record](images/Site/DNS-img1.png) |
| **Verification** | Successful DNS Propagation | ![DNS Verify](images/Site/DNS-img2.png) |
| **Edge Traffic** | Cloudflare Traffic Overview | ![CF Analytics](images/Site/DNS-img5.png) |
</details>

---

## 📊 Phase 5: Database & Live Application

### 5.1 MongoDB Atlas Connectivity
Configured the global database cluster and verified the connection from the backend EC2.

![MongoDB Cluster](images/MongoDB/MongoDB-img1.png)

### 5.2 Final Application Verification
The application is fully functional and accessible via the custom domain with a valid SSL certificate.

**Homepage:**
![Live Site](images/Site/Site-img1.png)

**Detailed Experience View:**
![Experience Page](images/Site/Site-img2.png)

---

## 📝 Key Learnings & Implementation Highlights

*   **Architecting Secure Networking**: Mastered the practical implementation of a custom AWS VPC, including subnet segmentation (Public/Private), Internet Gateway integration, and granular Route Table management to ensure a secure, multi-tier environment.
*   **Full-Lifecycle Load Balancing**: Gained hands-on experience in orchestrating Application Load Balancers (ALB), including Target Group management, advanced Listener rules, and the implementation of robust Health Check protocols for high-availability routing.
*   **SSL/TLS & Certificate Management**: Successfully navigated the end-to-end process of securing a web application by managing SSL termination at the ALB layer and utilizing AWS Certificate Manager (ACM) for centralized security.
*   **Network Security Maturity**: Demonstrated expertise in the "Least Privilege" security model by implementing tiered Security Groups (SGs) to strictly isolate traffic between the Edge (ALB), Web (Nginx), and Application (Node.js) layers.
*   **Managed DNS & Edge Integration**: Learned to bridge domain management with cloud infrastructure by configuring Cloudflare DNS, managing CNAME/A records, and verifying global propagation to connect a custom domain (`thiagarajanb.dpdns.org`).

---
*Developed and Deployed by Thiagarajan B.*
