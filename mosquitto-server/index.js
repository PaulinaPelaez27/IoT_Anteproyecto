import { connect } from "mqtt";
import { config } from "dotenv";
import { Pool } from 'pg';

config();

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
    const query = 'INSERT INTO tb_datos_crudos(dc_mensaje) VALUES($1)';
    const values = [message.toString()];
    try {
        await pool.query(query, values);
        console.log("✅ Mensaje guardado en la base de datos");
    } catch (error) {
        console.error("❌ Error al guardar mensaje en la base de datos:", error.message);
    }
}
