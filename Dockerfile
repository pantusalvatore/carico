# Immagine per il deploy (Railway o qualsiasi host Docker).
# Il database SQLite vive in un volume montato su /data, così sopravvive ai redeploy.
FROM node:22-slim

# OpenSSL serve al motore di Prisma.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="file:/data/carico.db"

# Dipendenze (lo schema serve al postinstall "prisma generate").
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
# Build senza toccare il database: tutte le pagine sono dinamiche.
RUN npx next build

ENV NODE_ENV=production
EXPOSE 3000
# All'avvio: crea il DB se manca, aggiorna gli esercizi (idempotente, conserva i tuoi dati) e avvia.
CMD ["sh", "-c", "node scripts/ensure-db.mjs && npx prisma db seed && npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
