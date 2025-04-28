import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { processMqttMessage } from '../services/todo.service';

dotenv.config();

const mqttBroker = process.env.MQTT_BROKER || 'mqtt://broker.emqx.io:1883';
const addTopic = process.env.MQTT_TOPIC_ADD || '/add';

export const connectMqtt = () => {
  const client = mqtt.connect(mqttBroker);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(addTopic, (err) => {
      if (err) {
        console.error('Error subscribing to topic:', err);
      } else {
        console.log(`Subscribed to ${addTopic}`);
      }
    });
  });

  client.on('message', async (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
    if (topic === addTopic) {
      try {
        await processMqttMessage(message.toString());
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    }
  });

  client.on('error', (error) => {
    console.error('MQTT error:', error);
  });

  return client;
};