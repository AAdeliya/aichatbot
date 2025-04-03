import { Webhook } from 'svix';
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUserInDB } from '@/actions/users';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    // Verify the payload with the headers
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // Process the event based on the type
  if (eventType === "user.created") {
    // Extract user data from the webhook
    const { id, first_name, last_name, email_addresses } = evt.data;
    
    // Create a user in the database
    try {
      await createUserInDB({
        clerkId: id as string, 
        fullname: `${first_name || ""} ${last_name || ""}`.trim(),
        type: "default",
        stripeId: "",
      });
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
    }
  }

  // Return a success response for other events
  return NextResponse.json({ success: true });
}