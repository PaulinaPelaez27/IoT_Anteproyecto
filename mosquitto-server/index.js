import { connect } from "mqtt";
import { config } from "dotenv";
import { Pool } from 'pg';
import { Queue } from "bullmq";
import IORedis from "ioredis";

const dotenvResult = config();

// Check for dotenv errors
if (dotenvResult.error) {
  console.error("❌ Error cargando el archivo .env:", dotenvResult.error.message);
  process.exit(1);
}

// Validar variables de entorno requeridas
const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASS",
  "DB_NAME",
  "DB_PORT",
  "MQTT_USERNAME",
  "PASSWORD_MQ",
  "MQTTSERVER",
  "REDIS_HOST",
  "REDIS_PORT"
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error("❌ Faltan las siguientes variables de entorno en el archivo .env:", missingEnv.join(", "));
  process.exit(1);
}

// Crear conexión a Redis
const redis = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

// Crear la cola donde se enviarán los jobs
const colaProcesamiento = new Queue("iot-processing", {
  connection: redis,
});

// Conexion a la base de datos PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("✅ Conectado a la base de datos PostgreSQL"))
  .catch(err => console.error("❌ Error al conectar a la base de datos PostgreSQL:", err));

// Leer credenciales desde .env y pasarlas como opciones de conexión
const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.PASSWORD_MQ,
  // opcional: definir clientId si lo necesitas
  clientId: process.env.CLIENTID || `client_${Math.random().toString(16).slice(2, 10)}`
};

if (!mqttOptions.username || !mqttOptions.password) {
  console.warn("⚠️ MQTT_USERNAME o MQTT_PASSWORD no están definidos en el .env");
}

const client = connect(process.env.MQTTSERVER, mqttOptions);

// Prueba de conexión
client.on("connect", () => {
  console.log("✅ ¡CONEXIÓN OK!");
  console.log("🎯 Los datos son correctos");

  // Prueba de suscripción a un topic simple
  client.subscribe("Extensometer/get", (err) => {
    if (!err) {
      console.log("📡 Suscrito al topic Extensometer/get");
    }
  });
});

//TODO: AUTOMATIZAR PARA QUE SE SUBSCRIBA A TODOS LOS TOPICS DE FORMA DINÁMICA

// Prueba de recepción
client.on("message", (topic, message) => {

  console.log(`📨 Mensaje recibido en ${topic}: ${message.toString()}`);
  try {
    guardarMensajeBruto(topic, message);
  } catch (error) {
    console.error("❌ Error al parsear JSON:", error.message);
  }
});

// Gestión de errores
client.on("error", (error) => {
  console.error("❌ ¡ERROR DE CONEXIÓN!");
  console.error("Detalles:", error.message);

  if (error.code === 4) {
    console.error(
      "🚫 Credenciales rechazadas (usuario/contraseña incorrectos)",
    );
  } else if (error.code === 5) {
    console.error("🚫 Conexión no autorizada");
  } else {
    console.error("🚫 Error de red o servidor inaccesible");
  }
});

/*client.on("offline", () => {
  console.warn("⚠️ Cliente fuera de línea");
});*/

console.log("⏳ Intentando conectar...");

// Funciones auxiliares para interactuar con la base de datos
//TODO: Mejorar manejo de errores y validaciones
async function guardarMensajeBruto(topic, message) {
  const payload = message.toString();

  // 1. Guardar en la base de datos
  const query = `
        INSERT INTO tb_datos_crudos(dc_topic, dc_mensaje, dc_procesado)
        VALUES ($1, $2, false) 
        RETURNING dc_id
    `;

  const values = [topic, payload];

  try {
    const result = await pool.query(query, values);
    const rawId = result.rows[0].dc_id;

    console.log(`Mensaje guardado en RAW con ID ${rawId}`);
    const empresaId = obtenerEmpresaDesdeTopic(topic);

    // 2. Enviar trabajo a Redis/BullMQ
    await enviarJobProcesamiento(rawId, empresaId);

  } catch (error) {
    console.error("Error al guardar mensaje en la base de datos:", error.message);
  }
}

async function enviarJobProcesamiento(rawId, empresaId) {
  try {
    await colaProcesamiento.add(
      "procesar-dato-crudo",
      { rawId, empresaId },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
      }
    );

    console.log(`Job enviado a Redis (RAW #${rawId}, Empresa ${empresaId})`);
  } catch (error) {
    console.error("Error al enviar job a Redis:", error.message);
  }
}

function obtenerEmpresaDesdeTopic(topic) {
  const parts = topic.split("/");
  const idx = parts.indexOf("empresa");

  if (idx >= 0 && parts[idx + 1]) {
    return Number(parts[idx + 1]);
  }

  return null;
}

