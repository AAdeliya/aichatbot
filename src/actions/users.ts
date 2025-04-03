'use server'

import { prisma } from "@/lib/db";
import { Plans } from "@prisma/client";

type CreateUserParams = {
  clerkId: string;
  fullname: string;
  type: string;
  stripeId?: string;
};

export const createUserInDB = async ({
  clerkId,
  fullname,
  type,
  stripeId = ""
}: CreateUserParams) => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        fullname,
        type,
        stripeId,
        // Create a FREE subscription for the user
        subscription: {
          create: {
            plan: Plans.FREE,
            credits: 100, // Default credits for FREE plan
          }
        }
      },
      include: {
        subscription: true
      }
    });

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};