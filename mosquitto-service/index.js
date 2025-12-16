import { connect } from "mqtt";
import { config } from "dotenv";
import { Pool } from "pg";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const dotenvResult = config();

// Check for dotenv errors
if (dotenvResult.error) {
  console.error(
    "[MQTT SERVICE] Error cargando el archivo .env:",
    dotenvResult.error.message,
  );
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
  "REDIS_PORT",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    " [MQTT SERVICE] Faltan las siguientes variables de entorno en el archivo .env:",
    missingEnv.join(", "),
  );
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

pool
  .connect()
  .then(() =>
    console.log("[MQTT SERVICE] Conectado a la base de datos PostgreSQL"),
  )
  .catch((err) =>
    console.error(
      "[MQTT SERVICE] Error al conectar a la base de datos PostgreSQL:",
      err,
    ),
  );

// Configuración de conexión MQTT
const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.PASSWORD_MQ,
};

if (!mqttOptions.username || !mqttOptions.password) {
  console.warn(
    "[MQTT SERVICE] MQTT_USERNAME o MQTT_PASSWORD no están definidos en el .env",
  );
}

const client = connect(process.env.MQTTSERVER, mqttOptions);

// Prueba de conexión
client.on("connect", () => {
  console.log(" [MQTT SERVICE] ¡CONEXIÓN MQTT OK!");
  console.log(" [MQTT SERVICE] Los datos son correctos");

  // Prueba de suscripción a un topic simple
  client.subscribe("empresas/#", (err) => {
    if (!err) {
      console.log("[MQTT SERVICE] Suscrito al topic empresas/#");
    }
  });
});

// Prueba de recepción
client.on("message", (topic, message) => {
  try {
    guardarMensajeBruto(topic, message);
  } catch (error) {
    console.error("[MQTT SERVICE] Error al parsear JSON:", error.message);
  }
});

// Gestión de errores
client.on("error", (error) => {
  console.error("[MQTT SERVICE] ¡ERROR DE CONEXIÓN MQTT!");
  console.error("[MQTT SERVICE] Detalles:", error.message);

  if (error.code === 4) {
    console.error(
      "[MQTT SERVICE] Credenciales rechazadas (usuario/contraseña incorrectos)",
    );
  } else if (error.code === 5) {
    console.error("[MQTT SERVICE] Conexión no autorizada");
  } else {
    console.error("[MQTT SERVICE] Error de red o servidor inaccesible");
  }
});

console.log(" [MQTT SERVICE] Intentando conectar...");

// Funciones auxiliares para interactuar con la base de datos
async function guardarMensajeBruto(topic, message) {
  const payload = message.toString();

  // Extraer empresaId del topic
  const empresaId = obtenerEmpresaDesdeTopic(topic);

  // Intentar parsear el mensaje como JSON
  let mensajeJson;
  try {
    mensajeJson = JSON.parse(payload);
  } catch (error) {
    // Si no es JSON válido, guardar como objeto con texto plano
    mensajeJson = { raw: payload };
  }

  // Extraer nodoId del topic
  const nodoId = obtenerNodoDesdeTopic(topic);

  // 1. Guardar en la base de datos
  const query = `
        INSERT INTO tb_datos_crudos(
          dc_id_empresa, 
          dc_id_nodo, 
          dc_mensaje, 
          dc_recibido_en, 
          dc_estado
        )
        VALUES ($1, $2, $3, $4, true) 
        RETURNING dc_id
    `;

  const values = [empresaId, nodoId, JSON.stringify(mensajeJson), new Date()];
  try {
    const result = await pool.query(query, values);
    console.log("result", result);
    const rawId = result.rows[0].dc_id;

    console.log(
      `Mensaje guardado en RAW con ID ${rawId} (Empresa: ${empresaId}, Nodo: ${nodoId})`,
    );

    // 2. Enviar trabajo a Redis/BullMQ
    await enviarJobProcesamiento(rawId, empresaId, nodoId);
  } catch (error) {
    console.error(
      "Error al guardar mensaje en la base de datos:",
      error.message,
    );
  }
}

async function enviarJobProcesamiento(rawId, empresaId, nodoId) {
  try {
    await colaProcesamiento.add(
      "procesar-dato-crudo",
      { rawId, empresaId, nodoId },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
      },
    );

    console.log(
      `Job enviado a Redis (RAW #${rawId}, Empresa ${empresaId}, Nodo ${nodoId})`,
    );
  } catch (error) {
    console.error("Error al enviar job a Redis:", error.message);
  }
}

function obtenerEmpresaDesdeTopic(topic) {
  const parts = topic.split("/");
  const idx = parts.indexOf("empresas");

  if (idx >= 0 && parts[idx + 1]) {
    const empresaId = Number(parts[idx + 1]);
    return empresaId;
  }

  return null;
}

function obtenerNodoDesdeTopic(topic) {
  const parts = topic.split("/");
  const idx = parts.indexOf("nodos");
  if (idx >= 0 && parts[idx + 1]) {
    const nodoId = Number(parts[idx + 1]);
    return nodoId;
  }
  return null;
}
