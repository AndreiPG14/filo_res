FROM node:22-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-engines

COPY . .

RUN DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder" npx prisma generate --schema=prisma/schema.prisma && echo "PRISMA OK"

RUN npm run build; echo "BUILD EXIT CODE: $?"

RUN ls -la dist/ || echo "DIST MISSING"

RUN test -f dist/main.js && echo "MAIN OK" || (echo "MAIN MISSING" && exit 1)

EXPOSE 3001

CMD ["node", "dist/main"]
