
import { z } from "zod";

export const AddDomainSchema = z.object({
  name: z.string().min(2, "Name is too short").max(64, "Name is too long"),
  url: z.string().url("Must be a valid URL"),
});

export const UpgradeSubscriptionSchema = z.object({
  plan: z.enum(["FREE", "BASIC", "PREMIUM"]),
});