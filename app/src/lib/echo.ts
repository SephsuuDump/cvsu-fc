// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// declare global {
//   interface Window {
//     Echo?: Echo<"reverb">;
//     Pusher?: typeof Pusher;
//   }
// } 

// export function getEcho() {
//   if (typeof window === "undefined") return null;

//   if (!window.Pusher) {
//     window.Pusher = Pusher;
//   }

//   if (!window.Echo) {
//     window.Echo = new Echo({
//       broadcaster: "reverb",

//       key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,

//       wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
//       // wsPath: "/ws",
//       wsPort: 8080,
//       wssPort: 8080,

//       forceTLS: false, //true in deployment
//       encrypted: false, //true in deployment

//       // enabledTransports: ["ws", "wss"],
//       enabledTransports: ["ws"],

//       authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,

//       auth: {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       },
//     });
//   }

//   return window.Echo;
// }


import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Echo?: Echo<"reverb">;
    Pusher?: typeof Pusher;
  }
} 

export function getEcho() {
  if (typeof window === "undefined") return null;

  if (!window.Pusher) {
    window.Pusher = Pusher;
  }

  if (!window.Echo) {
    window.Echo = new Echo({
      broadcaster: "reverb",

      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,

      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPath: "/ws",
      wsPort: 80,
      wssPort: 443,

      forceTLS: true, //true in deployment
      encrypted: true, //true in deployment

      // enabledTransports: ["ws", "wss"],
      enabledTransports: ["ws", "wss"],

      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,

      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    });
  }

  return window.Echo;
}