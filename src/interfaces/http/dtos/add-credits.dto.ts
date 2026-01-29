import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddCreditsDto {
  @IsString()
  @IsNotEmpty()
  targetUserId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
