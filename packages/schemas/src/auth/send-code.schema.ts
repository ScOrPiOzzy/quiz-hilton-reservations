import { z } from "zod";

export const sendCodeSchema = z.object({
  phone: z.string().min(6, "手机号不能为空"),
});

export type SendCodeDto = z.infer<typeof sendCodeSchema>;

export const sendCodeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type SendCodeResponse = z.infer<typeof sendCodeResponseSchema>;
