import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCreditsDto {
  @ApiProperty({
    description: 'ID do usuário que receberá os créditos',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  targetUserId: string;

  @ApiProperty({
    description: 'Quantidade de créditos a adicionar (mínimo 1)',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
