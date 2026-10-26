import { z }from "zod";
 
export const emailSchema = z.email();
 
const result = emailSchema.safeParse('not-an-email');
if (!result.success) {
  console.log("Invalid email");
}

export const emailBodySchema = z.object({
  email: emailSchema,
})
