# TravelMemory - Dockerized Version

This repository contains the backend and database configuration for the TravelMemory application using Docker.

## Prerequisites
- Docker installed on your machine.
- A terminal or PowerShell window.

## Setup Instructions

### 1. Create a Docker Network
Create a shared bridge network so the backend and database can communicate by name.
```bash
docker network create b16atm
```

### 2. Start the MongoDB Database
Run the MongoDB container with root credentials and a persistent volume.
```bash
docker run -d \
  --name mongodb_b16atm \
  --network b16atm \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest
```

### 3. Build the Backend Image
Navigate to the `backend` folder and build the image:
```bash
cd backend
docker build -t travelmemory-backend .
```

### 4. Run the Backend Container
Start the backend container attached to the same network:
```bash
docker run -d \
  --name travel-backend \
  --network b16atm \
  -p 3001:3001 \
  travelmemory-backend
```

## Environment Variables
The application uses the following environment variables (defined in the Dockerfile):
- `PORT`: 3001
- `MONGO_URI`: `mongodb://admin:password123@mongodb_b16atm:27017/travelmemory?authSource=admin`

## Troubleshooting
If the backend fails to connect to the database (Authentication Error):
1. Stop the containers: `docker rm -f travel-backend mongodb_b16atm`
2. Remove the old volume: `docker volume rm mongo-data`
3. Restart from **Step 2** to re-initialize the credentials.

---
Your application should now be accessible at **http://localhost:3001**.
