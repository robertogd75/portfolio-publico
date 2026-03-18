FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY index.js .
EXPOSE 3001
# Run as non-root user for security
USER node
CMD ["node", "index.js"]
