import { IsNotEmpty } from 'class-validator';

export class SendCodeDto {
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;
}
