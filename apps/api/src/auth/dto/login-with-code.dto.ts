import { IsNotEmpty, Length } from 'class-validator';

export class LoginWithCodeDto {
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @Length(4, 6, { message: '验证码长度不正确' })
  code: string;
}
