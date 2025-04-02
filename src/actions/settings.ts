"use server";

import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/db";

type SubscriptionPlan = {
  id: string;
  name: string;
  maxDomains: number;
};

export const onIntegrateDomain = async (domain: string, icon: string) => {
  // Get the authenticated user's ID
  const { userId } = auth();
  
  if (!userId) {
    return { status: 401, message: "Unauthorized" };
  }

  try {
    // Fetch the user's subscription and count their current domains
    const userData = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        subscription: true,
        domains: true,
      },
    });

    if (!userData) {
      return { status: 404, message: "User not found" };
    }

    // Check if the domain already exists
    const existingDomain = await prisma.domain.findFirst({
      where: {
        name: domain,
        userId: userData.id,
      },
    });

    if (existingDomain) {
      return { status: 409, message: "Domain already integrated" };
    }

    // Check the subscription plan and enforce limits
    const currentPlan = userData.subscription as SubscriptionPlan | null;
    const domainsCount = userData.domains.length;

    if (!currentPlan) {
      return { status: 402, message: "No active subscription found" };
    }

    if (domainsCount >= currentPlan.maxDomains) {
      return {
        status: 403,
        message: `Your ${currentPlan.name} plan allows a maximum of ${currentPlan.maxDomains} domains`,
      };
    }

    // Create a new domain entry and link it to the user
    await prisma.domain.create({
      data: {
        name: domain,
        icon: icon,
        userId: userData.id,
      },
    });

    return { 
      status: 200, 
      message: "Domain successfully added",
      remainingDomains: currentPlan.maxDomains - (domainsCount + 1)
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  }
};

// Additional helper function to get user domains
export const getUserDomains = async () => {
  const { userId } = auth();
  
  if (!userId) {
    return { status: 401, message: "Unauthorized", domains: [] };
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        domains: true,
      },
    });

    if (!userData) {
      return { status: 404, message: "User not found", domains: [] };
    }

    return { 
      status: 200,
      domains: userData.domains
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error", domains: [] };
  }
};