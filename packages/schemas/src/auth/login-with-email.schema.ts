import { z } from "zod";

export const loginWithEmailSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(1, "密码不能为空"),
});

export type LoginWithEmailDto = z.infer<typeof loginWithEmailSchema>;
