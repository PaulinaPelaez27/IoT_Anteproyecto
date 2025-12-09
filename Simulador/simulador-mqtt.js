import mqtt from "mqtt";
import dotenv from "dotenv";
dotenv.config();

const {
  MQTT_URL = "mqtt://localhost:1883",
  MQTT_TOPIC = "iot/ingest",
  INTERVAL_MS = "3000",
  MQTT_USERNAME = "",
  MQTT_PASSWORD = "",
  CLIENT_ID = `simulator-${Math.random().toString(16).slice(2)}`
} = process.env;

const opts = {
  clientId: CLIENT_ID,
  username: MQTT_USERNAME || undefined,
  password: MQTT_PASSWORD || undefined,
  clean: true,
  reconnectPeriod: 2000,
  connectTimeout: 10000
};

console.log("=== MQTT Simulator Adaptado ===");
console.log("URL   :", MQTT_URL);
console.log("Topic :", MQTT_TOPIC);
console.log("Client:", CLIENT_ID);

const client = mqtt.connect(MQTT_URL, opts);

client.on("connect", () => {
  console.log("✓ Conectado a MQTT");
  sendOnce();
  setInterval(sendOnce, Number(INTERVAL_MS));
});

client.on("reconnect", () => console.log("… Reintentando conexión MQTT"));
client.on("close", () => console.log("× Conexión cerrada"));
client.on("offline", () => console.log("⚠️  Cliente offline"));
client.on("error", (e) => console.error("MQTT error:", e?.message || e));

/* ------------------------------------------
   Helpers
---------------------------------------------*/
function rnd(min, max) { return Math.random() * (max - min) + min; }
function rndInt(min, max) { return Math.floor(rnd(min, max)); }

/* ------------------------------------------
   Definir parámetros disponibles por sensor
---------------------------------------------*/
const SENSOR_PARAM_CONFIG = {
  sensor1: ["calor", "humedad", "movimiento"],
  sensor2: ["calor"],
  sensor3: ["calor"]
};

/* ------------------------------------------
   Rango de valores simulados para parámetros
---------------------------------------------*/
const PARAMETER_RANGES = {
  calor: () => rndInt(18, 40),
  humedad: () => rndInt(20, 90),
  movimiento: () => rndInt(0, 1)
};

/* ------------------------------------------
   Generar parámetros de cada sensor
---------------------------------------------*/
function genParametros(sensorId) {
  const parametros = SENSOR_PARAM_CONFIG[sensorId] || [];

  return parametros.map((p) => ({
    id: p,
    valor: PARAMETER_RANGES[p] ? PARAMETER_RANGES[p]() : rndInt(0, 255),
    strDescripcion: `Lectura simulada de ${p}`
  }));
}

/* ------------------------------------------
   Estructura BASE para simular
---------------------------------------------*/
const SIM_STRUCTURE = {
  id_empresa: "empre01",
  proyectos: [
    {
      idProyecto: "proyec001",
      nodos: [
        {
          id: "nod01",
          strdescripcion: "Nodo de prueba 01",
          sensores: ["sensor1", "sensor2"]
        },
        {
          id: "nod02",
          strdescripcion: "Nodo de prueba 02",
          sensores: ["sensor2", "sensor3"]
        }
      ]
    }
  ]
};

/* ------------------------------------------
   Construir payload dinámico según estructura
---------------------------------------------*/
function buildPayload() {
  return {
    id_empresa: SIM_STRUCTURE.id_empresa,

    lstproyecto: SIM_STRUCTURE.proyectos.map((proy) => ({
      idProyecto: proy.idProyecto,

      lstNode: proy.nodos.map((n) => ({
        node: {
          id: n.id,
          strdescripcion: n.strdescripcion,

          lstsensores: n.sensores.map((sensorId) => ({
            id: sensorId,
            lstparametros: genParametros(sensorId)
          }))
        }
      }))
    }))
  };
}

/* ------------------------------------------
   Enviar mensaje MQTT
---------------------------------------------*/
function sendOnce() {
  const payload = JSON.stringify(buildPayload());

  client.publish(MQTT_TOPIC, payload, { qos: 0 }, (err) => {
    if (err) console.error("✗ Publish error:", err?.message || err);
    else console.log(`[${new Date().toISOString()}] → Mensaje enviado`);
  });
}