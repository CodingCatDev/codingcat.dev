
import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  companyName: z.string().optional(),
  sponsorshipTier: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  message: z.string().optional(),
  honeypot: z.string().optional(), // Honeypot field
  "cf-turnstile-response": z.string().min(1, { message: "Please complete the CAPTCHA." }),
});
