import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("请输入正确的电子邮箱地址"),
  phone: z.string(),
  password: z.string().min(6, "密码不能为空"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
