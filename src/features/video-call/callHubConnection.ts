import * as signalR from '@microsoft/signalr';

let callHubConnection: signalR.HubConnection | null = null;

export function setCallHubConnection(connection: signalR.HubConnection | null) {
  callHubConnection = connection;
}

export async function invokeCallHub(methodName: string, ...args: unknown[]) {
  await waitForCallHubConnection();

  await callHubConnection!.invoke(methodName, ...args);
}

async function waitForCallHubConnection(timeoutMs = 5000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (callHubConnection?.state === signalR.HubConnectionState.Connected) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('Call hub is not connected.');
}
