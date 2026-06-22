import { z } from "zod";

export const IMAGE_TYPES = [
  "COVER",
  "GALLERY",
  "SCREENSHOT",
  "LOGO",
  "MOCKUP",
  "PROFILE",
  "OG_IMAGE",
] as const;

/** Metadata fields shared by create + update. */
const metaFields = {
  altText: z.string().trim().max(300).optional(),
  caption: z.string().trim().max(500).optional(),
  type: z.enum(IMAGE_TYPES, {
    errorMap: () => ({ message: "Select a valid image type." }),
  }),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),
};

export const projectImageCreateSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required.").max(500),
  ...metaFields,
});

export const projectImageUpdateSchema = z.object(metaFields);

export type ProjectImageCreateInput = z.infer<typeof projectImageCreateSchema>;
export type ProjectImageUpdateInput = z.infer<typeof projectImageUpdateSchema>;
