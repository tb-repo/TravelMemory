FROM node:25-alpine3.22
WORKDIR /app
COPY . .
RUN npm install
ENV PORT=3001
ENV MONGO_URI="mongodb://admin:password123@mongodb_b16atm:27017/travelmemory?authsource=admin"
EXPOSE 3001
CMD ["node", "index.js"]