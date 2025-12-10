# -------------------------------
# 1) Etapa de construcción
# -------------------------------
FROM node:25-alpine3.22 AS builder

WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el código fuente
COPY . .

# -------------------------------
# 2) Etapa final (runtime)
# -------------------------------
FROM node:25-alpine3.22

WORKDIR /app

# Copiar las dependencias instaladas y el código de la etapa builder
COPY --from=builder /app /app

# Variables de entorno por defecto
ENV NODE_ENV=production

# Exponer puertos si usas Express (si no, puedes quitar esto)
EXPOSE 3000

# Comando de arranque
CMD ["node", "simulador-mqtt.js"]