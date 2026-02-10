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

    const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http";
    const isSecure = scheme === "https";

    const token = localStorage.getItem("token") ?? "";

    if (!window.Echo) {
        window.Echo = new Echo({
            broadcaster: "reverb",
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
            wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
            forceTLS: isSecure,
            enabledTransports: ["ws", "wss"],
            authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        });
    }

    return window.Echo;
}
