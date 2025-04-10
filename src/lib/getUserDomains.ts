import { prisma } from "@/lib/db";

export async function getUserDomains(userId: string) {
  return prisma.domain.findMany({
    where: { userId },
  });
}