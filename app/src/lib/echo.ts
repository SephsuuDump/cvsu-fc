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
            key: "local",

            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: 443,
            wssPort: 433,

            forceTLS: false,
            enabledTransports: ["wss"],

            authEndpoint: `https://${process.env.NEXT_PUBLIC_REVERB_HOST}/broadcasting/auth`,

            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        });
    }

    return window.Echo;
}
