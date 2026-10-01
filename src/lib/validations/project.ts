import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title is too long."),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200, "Slug is too long.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),

  description: z
    .string()
    .trim()
    .max(5000, "Description is too long.")
    .optional()
    .or(z.literal("")),

  coverImage: z.string().trim().optional().or(z.literal("")),

  featured: z.boolean(),

  published: z.boolean(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
