# TravelMemory: Infrastructure as Code (IaC) & Continuous Deployment

This repository contains the complete automation setup for deploying the **TravelMemory** application—a MERN-stack travel logging app—onto a highly secure, isolated, and scalable 3-tier environment on AWS. 

We leverage **Terraform** for Infrastructure Provisioning, **Ansible** for Configuration Management, and **GitHub Actions** for CI/CD.

---

## Table of Contents
1. [Architectural Diagram](#architectural-diagram)
2. [Phase 1: Infrastructure Provisioning (Terraform)](#phase-1-infrastructure-provisioning-terraform)
3. [Phase 2: Configuration Management (Ansible)](#phase-2-configuration-management-ansible)
4. [Phase 3: Troubleshooting & Issue Resolution](#phase-3-troubleshooting--issue-resolution)
5. [Phase 4: CI/CD Pipeline (GitHub Actions)](#phase-4-cicd-pipeline-github-actions)
6. [Phase 5: Final Application Verification](#phase-5-final-application-verification)

---

## Architectural Diagram

![Architecture Diagram](images/Site/Architecture_diagram.png)

The environment is structured in a custom VPC with a public-private network topology for high security and isolation:
- **Public Subnet**: Houses the **Web Server (Frontend + Express Backend)** and Nginx Reverse Proxy.
- **Private Subnet**: Houses the **MongoDB Database Server**, secured from direct public traffic.
- **NAT Gateway**: Enables the database server in the private subnet to securely pull packages from the internet without exposing itself to incoming connections.

---

## Phase 1: Infrastructure Provisioning (Terraform)

Terraform coordinates and provisions the virtual hardware in AWS before deployment. 

Since we are storing the S3 state file in a remote state bucket, we need to create an S3 bucket and a key pair for the EC2 instances.

| S3 State File Storage | Key Pair Deployment |
| :---: | :---: |
| ![S3 State File Bucket](images/Terraform/StateFile_S3_bucket.png) | ![Key Pair Creation](images/Terraform/Terraform_Ec2_KeyPair.png) |

The workflow starts by initializing, validating, formatting, planning, and applying the resources.

### 1. Initializing and Validating Code
- `terraform init` loads the required AWS and HashiCorp providers.
- `terraform validate` ensures code syntax is correct.
- `terraform fmt` keeps the code structure clean and standardized.

| Terraform Initialization | Code Validation & Formatting |
| :---: | :---: |
| ![Terraform Init](images/Terraform/Terraform_init.png) | ![Terraform Validate](images/Terraform/Terraform_validate.png) |

*Formatting check passing successfully:*
![Terraform Format](images/Terraform/Terraform_format.png)

### 2. Execution Plan (`terraform plan`)
Terraform generates an execution plan before making actual modifications to your cloud resources, outlining all the network configurations, security groups, and instances to be created:

![Terraform Plan Step 1](images/Terraform/Terraform_Plan1.png)
![Terraform Plan Step 2](images/Terraform/Terraform_Plan2.png)
![Terraform Plan Step 3](images/Terraform/Terraform_Plan3.png)

### 3. Resource Creation (`terraform apply`)
Upon approval, Terraform creates the resources. Our state is securely configured and saved to an S3 remote state bucket:

*Applying the configuration:*
![Terraform Apply Step 1](images/Terraform/Terraform_apply1.png)
![Terraform Apply Step 2](images/Terraform/Terraform_apply2.png)
![Terraform Apply Step 3](images/Terraform/Terraform_apply3.png)

### 4. Output Variables & AWS Resources Verification
Once provisioning finishes, outputs are generated, and resources are verify-ready in the AWS Management Console:

*Terraform Outputs:*
![Terraform Outputs](images/Terraform/Terraform_output.png)

*AWS Console Verification (VPC, EC2, IAM, Security Groups):*
- **VPC Configuration**: ![VPC Status](images/Terraform/VPC1.png)
- **EC2 Instances Active**: ![EC2 Instances](images/Terraform/Ec2.png)
- **Security Groups Setup**: ![Security Groups](images/Terraform/SecurityGroups.png)
- **IAM Policies**: ![IAM Roles](images/Terraform/IAM_Role_Policy.png)
- **IAM Trust Relationship**: ![IAM Trust](images/Terraform/IAM_TrustPolicy.png)

---

## Phase 2: Configuration Management (Ansible)

Once the instances are running, Ansible connects securely using a **Jump Host (SSH Bastion)** configuration to set up MongoDB, Node.js, and Nginx.

### 1. SSH SSH-Agent Setup & Secrets Encryption
Before running playbooks, we load our SSH key pair into the local ssh-agent and encrypt our credentials using Ansible Vault:

| SSH Agent Status | Encrypted Credentials (Ansible Vault) |
| :---: | :---: |
| ![SSH Key loaded](images/Ansible/Ansible_SSHKey.png) | ![Ansible Secrets Encrypted](images/Ansible/Ansible_Playbook_secrets.png) |

### 2. Running the Playbook
The playbook installs node dependencies, builds the React frontend, sets up systemd services, and secures MongoDB:

![Playbook Success Screen 1](images/Ansible/Ansible_Playbook_config_success1.png)
![Playbook Success Screen 2](images/Ansible/Ansible_Playbook_config_success2.png)

---

## Phase 3: Troubleshooting & Issue Resolution

During our automated deployment, several challenges were identified and successfully resolved:

| Issue Encountered | Description & Logs | Resolution & Fix |
| :--- | :--- | :--- |
| **1. Stopped Instance** | Connection timed out because the destination instance was stopped. | Started the EC2 instance and updated the inventory. <br><br> ![EC2 Stopped](images/Ansible/Ansible_Playbook_issue1_ec2_stopped_state.png) |
| **2. Host Key Verification** | Ansible playbooks blocked waiting for user host key authorization. | Configured `host_key_checking = False` in `ansible.cfg`. <br><br> ![Key Checking Fix](images/Ansible/Ansible_Playbook_issue2_fix1.png) |
| **3. Node / NPM Conflict** | Incorrect task main.yaml file moved to DB Server | Standardized node installation via NodeSource Node.js 24 repository. <br><br> ![Package Conflict](images/Ansible/Ansible_Playbook_issue3.png) |
| **4. Database Auth Error** | The first-run setup failed when trying to verify database users before auth configuration. | Added connection credentials and customized check conditions. <br><br> ![Database Authentication](images/Ansible/Ansible_Playbook_issue4_fix.png) |
| **5. Front/Back Mismatch** | Nginx failed to forward requests resulting in frontend crashes. | Fixed Nginx `proxy_pass` location rewriting rules. <br><br> ![Webpage Error](images/Ansible/Ansible_Playbook_issue6_webpage.png) |

---

## Phase 4: CI/CD Pipeline (GitHub Actions)

We automate deployment tasks through a GitHub Actions workflow. On every push to the `main` branch, the pipeline triggers, installs dependencies, sets up SSH keys, prepares variables, and deploys.

### 1. GitHub Secrets Configuration
Sensitive keys and parameters are securely stored inside GitHub Actions environment secrets:

![Action Secrets](images/GitHub/Workflow_Secrets.png)

### 2. Deployment Workflows In Action
*Workflow successfully triggered by a code commit:*
![Commit trigger](images/GitHub/GitHub_Worklow_codepushed.png)

*Deployment pipeline steps running in real-time:*
![Actions Deploy Step 1](images/GitHub/GitHub_Worklow_deploy_running.png)
![Actions Deploy Step 2](images/GitHub/GitHub_Worklow_deploy_running2.png)

### 3. Build & Deployment Pipeline Status
During the implementation of the CI/CD pipeline, we addressed and fixed SSH connection issues involving host key verification and runner username context:
- **Failed Pipeline Attempts**: ![Failed Workflows](images/GitHub/GitHub_Worklow_deploy_failediterations.png)
- **Detailed Connection Error Log**: ![Connection Error Log](images/GitHub/GitHub_Worklow_deploy_failediterations_error.png)

After configuring the global SSH config file (`StrictHostKeyChecking no`) and explicitly passing the `ubuntu` username inside the inventory and playbook runner command, the pipeline built and deployed successfully:
- **Successful Pipeline Run**: ![Pipeline Success](images/GitHub/GitHub_Worklow_deploy_successful.png)

---

## Phase 5: Final Application Verification

Once deployment finishes, the web application runs successfully through the Application Load Balancer:

### 1. TravelMemory Homepage
The React UI loads successfully and fetches stored trips from the database:

![React UI Landing Page](images/Ansible/Travelmem_webpage_homepage_working.png)

### 2. Adding a Travel Experience
Adding new travel logs via the UI functions correctly, sending data to MongoDB through our secure Nginx API proxy:

![Adding Experience UI](images/Ansible/Travelmem_webpage_addexperience_working.png)

![Reviewing the Experience UI](images/Ansible/Travelmem_webpage_experience_page_working.png)
