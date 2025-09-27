import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePageDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
