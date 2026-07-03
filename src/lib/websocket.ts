import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client: Client | null = null;
let isConnected = false;

const subscribers = new Map<string, Set<(data: unknown) => void>>();
const stompSubscriptions = new Map<string, any>();

const dispatch = (topic: string, data: unknown) => {
  console.log(`[WS] dispatch topic=${topic}, subscribers=${subscribers.get(topic)?.size ?? 0}`);
  subscribers.get(topic)?.forEach((cb) => cb(data));
};

const subscribeSTOMP = (topic: string) => {
  if (!client?.active) return;
  if (stompSubscriptions.has(topic)) return;

  const sub = client.subscribe(topic, (msg) => {
    try {
      dispatch(topic, JSON.parse(msg.body));
    } catch {
      console.error("[WS] Parse error on", topic, msg.body);
    }
  });

  stompSubscriptions.set(topic, sub);
  console.log(`[WS] STOMP subscribed: ${topic}`);
};

const ensureConnected = () => {
  if (client?.active) return;

  const socket = new SockJS(`${process.env.NEXT_PUBLIC_HOST}/ws`);

  client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("[WS] Connected");
      isConnected = true;

      // Subscribe tất cả topic đang có subscriber
      subscribers.forEach((_, topic) => subscribeSTOMP(topic));
    },

    onStompError: (frame) => {
      console.error("[WS] STOMP error", frame.headers["message"]);
    },

    onDisconnect: () => {
      console.debug("[WS] Disconnected");
      isConnected = false;
      stompSubscriptions.clear();
    },
  });

  client.activate();
};

export const subscribeWS = (
  topic: string,
  callback: (data: unknown) => void
): (() => void) => {

  const isNewTopic = !subscribers.has(topic);

  if (isNewTopic) {
    subscribers.set(topic, new Set());
  }

  subscribers.get(topic)!.add(callback);

  if (isNewTopic && isConnected) {
    // Topic mới, đã connected → subscribe STOMP ngay
    subscribeSTOMP(topic);
  } else {
    // Chưa connected → onConnect sẽ lo
    ensureConnected();
  }

  return () => {
    subscribers.get(topic)?.delete(callback);
    if (subscribers.get(topic)?.size === 0) {
      subscribers.delete(topic);
    }
  };
};

export const disconnectWS = (): void => {
  client?.deactivate();
  client = null;
  isConnected = false;
  subscribers.clear();
  stompSubscriptions.clear();
};

export const connectWS = (onMessage: (data: unknown) => void): void => {
  subscribeWS("/user/queue/notifications", onMessage);
  subscribeWS("/topic/notifications", onMessage);
};

// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// let client: Client | null = null;

// export const connectWS = (onMessage: (data: unknown) => void): void => {
//   if (client?.active) {
//     return;
//   }

//   const socket = new SockJS(`${process.env.NEXT_PUBLIC_HOST}/ws`);

//   client = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000,
//     connectHeaders: {},

//     onConnect: () => {
//       console.log("[WS] Connected");
//       client!.subscribe("/user/queue/notifications", (msg) => {
//         console.log(
//             "[WS] BROADCAST",
//             msg.body
//           );
//         try {
//           onMessage(JSON.parse(msg.body));
//         } catch {
//           console.error("[WS] Failed to parse notification payload", msg.body);
//         }
//       });

//       client!.subscribe(
//         "/topic/notifications",
//         (msg) => {
//           console.log(
//             "[WS] TOPIC",
//             msg.body
//           );

//           onMessage(
//             JSON.parse(msg.body)
//           );
//         }
//       );
//     },

//     onStompError: (frame) => {
//       console.error("[WS] STOMP error", frame.headers["message"]);
//     },

//     onDisconnect: () => {
//       console.debug("[WS] Disconnected");
//     },
//   });

//   client.activate();
// };

// export const disconnectWS = (): void => {
//   if (client?.active) {
//     client.deactivate();
//   }
//   client = null;
// };
