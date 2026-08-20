import { z } from "zod";

const environmentSchema = z.object({
  COGNODB_URI: z
    .string()
    .regex(/^bolt\+s:\/\//, "COGNODB_URI must use bolt+s://"),
  COGNODB_USERNAME: z.string().min(1),
  COGNODB_PASSWORD: z.string().min(1),
});

export const env = environmentSchema.parse({
  COGNODB_URI: process.env.COGNODB_URI,
  COGNODB_USERNAME: process.env.COGNODB_USERNAME,
  COGNODB_PASSWORD: process.env.COGNODB_PASSWORD,
});