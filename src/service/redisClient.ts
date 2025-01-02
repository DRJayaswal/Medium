import { createClient } from 'redis';

const client = createClient();
client.connect();

export async function pushToQueue(queueName: string, id: string) {
    return await client.lPush(queueName, id);
}

export async function setStatus(id: string, status: string) {
    return await client.hSet("status", id, status);
}

export async function disconnect() {
    await client.disconnect();
}