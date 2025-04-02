// src/schemas/settings.schema.ts
import { z } from "zod";

export const AddDomainSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  url: z.string().url("Must be a valid URL"),
  // add more fields as needed
});
