import mqtt from "mqtt";
import dotenv from "dotenv";
dotenv.config();

// Variables
const MQTT_BROKER_URL = process.env.MQTTSERVER || "mqtt://localhost:1883";
const TOPICS = process.env.TOPICS ? process.env.TOPICS.split(",") : [];
const SENSORES = process.env.SENSORES ? process.env.SENSORES.split(",") : [];
const VARIABLES = process.env.VARIABLES ? process.env.VARIABLES.split(",") : [];

// Conexión al broker MQTT
const client = mqtt.connect(MQTT_BROKER_URL);

client.on("connect", () => {
  console.log("Conectado al broker MQTT");
  setInterval(publishSensorData, 5000); // Publicar datos cada 5 segundos
});

client.on("error", (error) => {
  console.error("Error de conexión:", error);
});

// Función para generar datos aleatorios y publicarlos
function publishSensorData() {
  TOPICS.forEach((topic, index) => {
    SENSORES.forEach((sensor) => {
      if ((index === 0 || index === 2) && (sensor === "3" || sensor === "4")) {
        return; // Verificar si el topic corresponde al sensor
      }
      if ((index === 1 || index === 3) && (sensor === "1" || sensor === "2")) {
        return;
      }
      const data = { sensor: sensor, timestamp: new Date().toISOString() };
      VARIABLES.forEach((variable) => {
        data[variable] = generateRandomValue(variable);
      });
      const message = JSON.stringify(data);
      client.publish(topic, message, () => {
        console.log(`Publicado en ${topic}: ${message}`);
      });
    });
  });
}

// Función para generar un valor aleatorio basado en la variable
function generateRandomValue(variable) {
  switch (variable) {
    case "temperatura":
      return (Math.random() * 40).toFixed(2);
    case "humedad":
      return (Math.random() * 100).toFixed(2);
    case "luminosidad":
      return (Math.random() * 1000).toFixed(2);
    case "voltaje":
      return (Math.random() * 240).toFixed(2);
    case "corriente":
      return (Math.random() * 10).toFixed(2);
    case "potencia":
      return (Math.random() * 2000).toFixed(2);
    case "energia":
      return (Math.random() * 5000).toFixed(2);
    case "frecuencia":
      return (Math.random() * 60).toFixed(2);
    case "angulo_desfase":
      return (Math.random() * 360).toFixed(2);
    case "factor_potencia":
      return Math.random().toFixed(2);
    default:
      return 0;
  }
}

process.on("SIGINT", () => {
  client.end(() => {
    console.log("Desconectado del broker MQTT");
    process.exit(0);
  });
});
