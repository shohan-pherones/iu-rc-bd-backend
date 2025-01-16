import { z } from "zod";

const membershipSchema = z.object({
  volunteerPass: z.string(),
});

export const MembershipValidations = {
  membershipSchema,
};
