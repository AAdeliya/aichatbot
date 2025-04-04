// src/schema/domains.schema.ts
import { z } from "zod";

export const DomainSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Domain name is required"),
  url: z.string().url("Please enter a valid URL"),
  icon: z.string().optional(),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  stripeId: z.string().optional(),
});

export type Domain = z.infer<typeof DomainSchema>;