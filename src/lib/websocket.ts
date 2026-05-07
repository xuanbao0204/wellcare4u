import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client: Client | null = null;

export const connectWS = (onMessage: (data: unknown) => void): void => {
  if (client?.active) {
    client.deactivate();
    client = null;
  }

  const socket = new SockJS(`${process.env.NEXT_PUBLIC_HOST}/ws`);

  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    connectHeaders: {},

    onConnect: () => {
      client!.subscribe("/user/queue/notifications", (msg) => {
        try {
          onMessage(JSON.parse(msg.body));
        } catch {
          console.error("[WS] Failed to parse notification payload", msg.body);
        }
      });
    },

    onStompError: (frame) => {
      console.error("[WS] STOMP error", frame.headers["message"]);
    },

    onDisconnect: () => {
      console.debug("[WS] Disconnected");
    },
  });

  client.activate();
};

export const disconnectWS = (): void => {
  if (client?.active) {
    client.deactivate();
  }
  client = null;
};


// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// let client: Client;

// export const connectWS = (onMessage: (data: any) => void) => {
//   if (client?.active) return;
//   const socket = new SockJS("http://localhost:8600/ws");

//   client = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000,

//     onConnect: () => {
//       client.subscribe("/user/queue/notifications", (msg) => {
//         onMessage(JSON.parse(msg.body));
//       });
//     },
//   });

//   client.activate();
// };