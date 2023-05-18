FROM node:18-alpine

WORKDIR /app
COPY . .

RUN apk add --update --no-cache openssl1.1-compat openssl git && \
    npm install -g pnpm && \
    pnpm i && \
    npx prisma generate && \
    pnpm run build && \
    apk del git

EXPOSE 8080

CMD pnpm run migrate && pnpm run start