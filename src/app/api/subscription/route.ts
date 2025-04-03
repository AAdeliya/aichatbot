// src/app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for subscription update
const SubscriptionUpdateSchema = z.object({
  plan: z.enum(["FREE", "BASIC", "PREMIUM"]),
});

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = getAuth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    
    // Validate the request body
    const validation = SubscriptionUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validation.error.format() },
        { status: 400 }
      );
    }
    
    // Get the validated data
    const { plan } = validation.data;
    
    // Find the user in our database
    const userData = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        billing: true,
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Determine credits based on plan
    const credits = plan === "PREMIUM" ? 10000 : plan === "BASIC" ? 5000 : 1000;
    
    // Update or create subscription
    if (userData.billing) {
      await prisma.subscription.update({
        where: { id: userData.billing.id },
        data: {
          plan,
          credits,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          plan,
          credits,
          userId: userData.id,