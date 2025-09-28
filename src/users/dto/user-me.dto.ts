import { IsString } from 'class-validator';

export class UserMeResponse {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}
