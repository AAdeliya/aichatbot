import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Plans } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = getAuth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
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
    
    // Return subscription details or default to FREE
    return NextResponse.json({
      plan: userData.subscription?.plan || Plans.FREE,
      credits: userData.subscription?.credits || 1000,
      userId: userData.id
    });
    
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { message: "Error fetching subscription", error: (error as Error).message },
      { status: 500 }
    );
  }
}