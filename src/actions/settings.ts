"use server";

import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { Plans } from "@prisma/client";
import { z } from "zod";
import { AddDomainSchema } from "@/schema/settings.schema";
import { pusherServer } from "@/lib/utils";

const MAX_DOMAINS = {
  [Plans.FREE]: 1,
  [Plans.BASIC]: 3,
  [Plans.PREMIUM]: 10
};

export const onIntegrateDomain = async (formData: string, icon: string) => {
  try {
    // Parse and validate the input
    const parsedData = JSON.parse(formData);
    const validatedData = AddDomainSchema.safeParse(parsedData);
    
    if (!validatedData.success) {
      return { 
        status: 400, 
        message: "Invalid domain data" 
      };
    }
    
    const { name, url } = validatedData.data;
    
    // Get the authenticated user's ID
    const { userId } = auth();
    
    if (!userId) {
      return { status: 401, message: "Unauthorized" };
    }

    // Find the user in our database (using their Clerk ID)
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        //subscription: true,
        domains: true,
      },
    });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Check if the domain already exists
    const existingDomain = await prisma.domain.findFirst({
      where: {
        name,
        userId: user.id,
      },
    });

    if (existingDomain) {
      return { status: 409, message: "Domain already integrated" };
    }

    // Check subscription limits
    // const plan = user.subscription?.plan || Plans.FREE;
    // const currentDomainCount = user.domains.length;
    // const maxDomainsAllowed = MAX_DOMAINS[plan];

    // if (currentDomainCount >= maxDomainsAllowed) {
    //   return {
    //     status: 403,
    //     message: `Your ${plan} plan allows a maximum of ${maxDomainsAllowed} domains. Please upgrade to add more.`,
    //   };
    // }

    // Create the domain
    const newDomain = await prisma.domain.create({
      data: {
        name,
        icon,
        userId: user.id,
      },
    });

    // Notify through Pusher that a domain was added
    await pusherServer.trigger(
      `user-${user.id}`,
      'domain-added',
      { domain: newDomain }
    );

    return { 
      status: 200, 
      message: "Domain successfully added",
      domain: newDomain,
      //remainingDomains: maxDomainsAllowed - (currentDomainCount + 1)
    };
  } catch (error) {
    console.error("Error integrating domain:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

// Get all domains for the current user
export const getUserDomains = async () => {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return { status: 401, message: "Unauthorized", domains: [] };
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
    });

    if (!user) {
      return { status: 404, message: "User not found", domains: [] };
    }

    const domains = await prisma.domain.findMany({
      where: { userId: user.id },
      //orderBy: { createdAt: "desc" },
    });

    return { 
      status: 200,
      domains
    };
  } catch (error) {
    console.error("Error fetching domains:", error);
    return { status: 500, message: "Internal Server Error", domains: [] };
  }
};