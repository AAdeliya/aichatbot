// src/actions/settings.ts
"use server";

import { auth} from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Plans } from "@prisma/client";
import { DomainSchema } from "../schema/domains/domains.schema";
import { pusherServer } from "@/lib/utils";

const MAX_DOMAINS = {
  [Plans.FREE]: 1,
  [Plans.BASIC]: 3,
  [Plans.PREMIUM]: 10
};

export const onIntegrateDomain = async (data: any) => {
  try {
    // Get the authenticated user's ID
    const { userId } = auth();
    
    if (!userId) {
      return { status: 401, message: "Unauthorized" };
    }
    //

    // Validate the input data
    // const validatedData = DomainSchema.safeParse(data);
    
    // if (!validatedData.success) {
    //   return { 
    //     status: 400, 
    //     message: "Invalid domain data" 
    //   };
    // }
    
    const { name, icon } = data;
    
    // Find the user in our database (using their Clerk ID)
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        subscription: true,
        domains: true,
      },
    });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Check if the domain already exists
    const existingDomain = await prisma.domain.findFirst({
      where: {
        name: data.name,
        userId: user.id,
      },
    });

    if (existingDomain) {
      return { status: 409, message: "Domain already integrated" };
    }

    // Check subscription limits
    const plan = user.subscription?.plan || Plans.FREE;
    const currentDomainCount = user.domains.length;
    const maxDomainsAllowed = MAX_DOMAINS[plan];

    if (currentDomainCount >= maxDomainsAllowed) {
      return {
        status: 403,
        message: `Your ${plan} plan allows a maximum of ${maxDomainsAllowed} domains. Please upgrade to add more.`,
      };
    }

    // Create the domain
    const newDomain = await prisma.domain.create({
      data: {
        name: data.name,
        icon: icon || "",
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
      remainingDomains: maxDomainsAllowed - (currentDomainCount + 1)
    };
  } catch (error) {
    console.error("Error integrating domain:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};