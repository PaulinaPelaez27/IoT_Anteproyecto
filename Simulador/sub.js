// sub.js
import mqtt from "mqtt";

const URL = "mqtt://localhost:1883";   // tu broker local
const TOPIC = "iot/ingest";

const client = mqtt.connect(URL, { reconnectPeriod: 2000, connectTimeout: 10000 });

client.on("connect", () => {
  console.log("✓ Conectado (suscriptor) →", URL);
  client.subscribe(TOPIC, (err) => {
    if (err) console.error("✗ Error al suscribirse:", err.message);
    else console.log("→ Subscrito al topic:", TOPIC);
  });
});

client.on("message", (topic, payload) => {
  try {
    const msg = JSON.parse(payload.toString());
    console.log(`[${new Date().toISOString()}] ${topic}`);
    console.dir(msg, { depth: null });
  } catch {
    console.log(`[${new Date().toISOString()}] ${topic} →`, payload.toString());
  }
});

client.on("error", (e) => console.error("MQTT sub error:", e?.message || e));
