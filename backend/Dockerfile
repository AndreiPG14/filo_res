FROM node:22-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-engines

COPY . .

RUN DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder" npx prisma generate --schema=prisma/schema.prisma

RUN npm run build

RUN ls -la dist/ && ls -la dist/src/ 2>/dev/null || ls -la dist/

EXPOSE 3001

CMD ["node", "dist/src/main"]
