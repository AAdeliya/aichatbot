// src/app/api/domains/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema for domain creation
const DomainCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().nullable(),
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
    const validation = DomainCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validation.error.format() },
        { status: 400 }
      );
    }
    
    // Get the validated data
    const { name, url, icon } = validation.data;
    
    // Find the user in our database
    const userData = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        domains: true,
        // Check if the user has a subscription
        billing: true,
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if the domain already exists for this user
    const existingDomain = userData.domains.find(
      domain => domain.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingDomain) {
      return NextResponse.json(
        { message: "Domain already exists" },
        { status: 409 }
      );
    }
    
    // Check subscription limits (assuming a default limit of 1 for free users)
    const subscriptionPlan = userData.billing?.plan || "FREE";
    const domainLimit = subscriptionPlan === "PREMIUM" ? 10 : subscriptionPlan === "BASIC" ? 3 : 1;
    
    if (userData.domains.length >= domainLimit) {
      return NextResponse.json(
        { 
          message: `Your ${subscriptionPlan} plan allows a maximum of ${domainLimit} domains. Please upgrade your subscription.` 
        },
        { status: 403 }
      );
    }
    
    // Create the domain
    const domain = await prisma.domain.create({
      data: {
        name,
        icon: icon || '',
        userId: userData.id,
      },
    });
    
    // Initialize a ChatBot for the domain
    await prisma.chatBot.create({
      data: {
        welcomeMessage: `Welcome to ${name}! How can I help you today?`,
        icon: icon || '',
        background: "#FFFFFF",
        textColor: "#000000",
        helpdesk: false,
        domainId: domain.id,
      },
    });
    
    return NextResponse.json({
      message: "Domain created successfully",
      domain,
      remainingDomains: domainLimit - (userData.domains.length + 1),
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating domain:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const userData = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        domains: true,
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      domains: userData.domains,
    });
    
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}