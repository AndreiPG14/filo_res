FROM node:22-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-engines

COPY . .

RUN DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder" npx prisma generate --schema=prisma/schema.prisma
RUN npx tsc -p tsconfig.json && echo "Build OK" && ls dist/

EXPOSE 3001

CMD ["node", "dist/main"]
