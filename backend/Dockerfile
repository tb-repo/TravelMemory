FROM node:25-alpine3.22 as builder
WORKDIR /app
COPY . .
RUN npm install
COPY . .

FROM node:20-alpine
WORKDIR /app
# Copy only required files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Remove dev dependencies (optional but recommended)
RUN npm prune --omit=dev
ENV PORT=3001
ENV MONGO_URI="mongodb://admin:password123@mongodb_tbtm:27017/travelmemory?authsource=admin"
EXPOSE 3001
CMD ["node", "index.js"]

#ENV PORT=3001
#ENV MONGO_URI="mongodb://admin:password123@mongodb_b16atm:27017/travelmemory?authsource=admin"
#EXPOSE 3001
#CMD ["node", "index.js"]

# docker run -d -p 27017:27017 --name mongodb_tbtm --network b16atm -v mongodb-data:/data/db -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 mongo:latest
# docker run -d -p 3001:3001 --name tbtm_be --network b16atm travelmemory-backend:latest