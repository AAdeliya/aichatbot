import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import PusherServer from "pusher";
import Pusher from "pusher-js";

// ✅ Utility function for Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Server-side Pusher instance (used in server actions, API routes, etc.)
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

// ✅ Client-side Pusher instance (used in components for real-time updates)
export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);
