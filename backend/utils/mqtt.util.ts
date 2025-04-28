import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

const mqttBroker = process.env.MQTT_BROKER || 'mqtt://broker.emqx.io:1883';

let mqttClient: MqttClient | null = null;

export const getMqttClient = (): MqttClient => {
  if (!mqttClient) {
    mqttClient = mqtt.connect(mqttBroker);
    
    mqttClient.on('connect', () => {
      console.log('MQTT publisher connected to broker');
    });
    
    mqttClient.on('error', (error: Error) => {
      console.error('MQTT publisher error:', error);
    });
  }
  
  return mqttClient;
};

export const publishMessage = (topic: string, message: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const client = getMqttClient();
    
    client.publish(topic, message, {}, (error) => {
      if (error) {
        console.error(`Error publishing to ${topic}:`, error);
        reject(error);
      } else {
        console.log(`Published to ${topic}: ${message}`);
        resolve();
      }
    });
  });
};