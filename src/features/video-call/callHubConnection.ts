import * as signalR from '@microsoft/signalr';

let callHubConnection: signalR.HubConnection | null = null;

export function setCallHubConnection(connection: signalR.HubConnection | null) {
  callHubConnection = connection;
}

export async function invokeCallHub(methodName: string, ...args: unknown[]) {
  if (!callHubConnection || callHubConnection.state !== signalR.HubConnectionState.Connected) {
    throw new Error('Call hub is not connected.');
  }

  await callHubConnection.invoke(methodName, ...args);
}
