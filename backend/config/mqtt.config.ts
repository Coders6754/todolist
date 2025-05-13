import mqtt, { IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { processMqttMessage } from '../services/todo.service';

dotenv.config();

const mqttConfig: IClientOptions = {
  host: process.env.MQTT_BROKER_URL || 'localhost',
  port: parseInt(process.env.MQTT_PORT || '8883'),
  protocol: 'mqtts' as const,
  rejectUnauthorized: false
};

const addTopic = process.env.MQTT_TOPIC_ADD || '/add';

export const connectMqtt = () => {
  const client = mqtt.connect({
    ...mqttConfig,
    clientId: `mqtt_${Math.random().toString(16).slice(2, 10)}`,
  });

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