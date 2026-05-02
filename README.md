# TravelMemory - Dockerized Version

This repository contains the backend and database configuration for the TravelMemory application using Docker.

## Prerequisites
- Docker installed on your machine.
- A terminal or PowerShell window.

## Setup Instructions

### 1. Create a new Dockerfile:
Create this file named Dockerfile inside backend folder:

```bash
FROM node:25-alpine3.22
WORKDIR /app
COPY . .
RUN npm install
ENV PORT=3001
ENV MONGO_URI="mongodb://admin:xxxx@mongodb_b16atm:27017/travelmemory?authsource=admin" -- use the same password set in the database
EXPOSE 3001
CMD ["node", "index.js"]
```

### 2. Create a new docker-compose.yml file:
Create a new docker-compose file in the root folder of this project with the below content:

```bash
services:
  backend:
    build: ./backend
    #dockerfile: Dockerfile-xyzname -- If using a different name
    container_name: tm_b16a_backend
    ports:
      - "3001:3001"
    environment:
      PORT: 3001
      MONGO_URI: "mongodb://admin:xxxx@tm_b16a_database:27017/travelmemory?authsource=admin" -- use the same password set in the database
    networks:
      - tmb16a_network
    depends_on:
      - database

  database:
    image: mongo
    container_name: tm_b16a_database
    # ports:
    #   - "27019:27017"
    volumes:
      - mongo_data_tm:/data/db
    networks:
      - tmb16a_network
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: xxxxx (Any Preferred password)
      MONGO_INITDB_DATABASE: travelmemory

volumes:
  mongo_data_tm:

networks:
  tmb16a_network:
```

### 3. Run docker compose Build and Start it:

```bash
     docker compose build
     docker compose up -d
---

Your application should now be accessible at **http://localhost:3001**.


## Screenshots:

![Docker Compose Image 1](images/Backend/Docker-compose-img1.png)

![Docker Compose Image 2](images/Backend/Docker-compose-img2.png)

![Docker Compose Image 3](images/Backend/Docker-compose-img3.png)
