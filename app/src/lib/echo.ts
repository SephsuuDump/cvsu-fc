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







// ==============
// ITO BOY
// =============
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

  if (!window.Pusher) window.Pusher = Pusher;

  if (!window.Echo) {
    const host = process.env.NEXT_PUBLIC_REVERB_HOST!;
    const isTls = process.env.NEXT_PUBLIC_REVERB_SCHEME === "https";

    window.Echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,

      // IMPORTANT: host only (no :port here)
      wsHost: host,

      // IMPORTANT: external port is 443 when using https/wss behind Cloudflare
      wsPort: isTls ? 80 : Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080),
      wssPort: isTls ? 443 : Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080),

      forceTLS: isTls,
      encrypted: isTls,

      enabledTransports: ["ws", "wss"],

      // DO NOT set wsPath to /wss. Default "/app" is correct for Reverb/Pusher protocol.
      // wsPath: "/app",

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
