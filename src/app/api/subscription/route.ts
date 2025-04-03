import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Plans } from "@prisma/client";

// Schema for subscription update
const SubscriptionUpdateSchema = z.object({
  plan: z.enum(["FREE", "BASIC", "PREMIUM"]),
});

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = auth();
    
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
    const userData = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        subscription: true,
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Determine credits based on plan
    const creditsMap = {
      [Plans.PREMIUM]: 10000,
      [Plans.BASIC]: 5000,
      [Plans.FREE]: 1000,
    };
    
    // Cast the string plan to the enum type
    const planEnum = plan as Plans;
    const credits = creditsMap[planEnum];
    
    // Update or create subscription
    if (userData.subscription) {
      await prisma.subscription.update({
        where: { id: userData.subscription.id },
        data: {
          plan: planEnum,
          credits,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          plan: planEnum,
          credits,
          userId: userData.id,
        },
      });
    }
    
    return NextResponse.json(
      { 
        message: "Subscription updated successfully",
        plan,
        credits
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { message: "Error updating subscription", error: (error as Error).message },
      { status: 500 }
    );
  }
}