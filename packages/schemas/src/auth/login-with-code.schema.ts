import { z } from "zod";

export const loginWithCodeSchema = z.object({
  phone: z.string().min(1, "手机号不能为空"),
  code: z.string().length(6, "验证码长度不正确"),
});

export type LoginWithCodeDto = z.infer<typeof loginWithCodeSchema>;
