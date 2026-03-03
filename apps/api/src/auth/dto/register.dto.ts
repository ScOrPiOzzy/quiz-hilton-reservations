import { IUser } from '@repo/schemas';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: '名不能为空' })
  firstName: string;

  @IsNotEmpty({ message: '姓不能为空' })
  lastName: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 32, { message: '密码长度必须为 8-32 个字符' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d|.*[@$!%*?&]))[a-zA-Z\d@$!%*?&]{8,32}$/, {
    message: '密码必须包含大小写字母和至少一个数字或特殊字符',
  })
  password: string;

  @IsNotEmpty({ message: '角色不能为空' })
  role: IUser['role'];
}
