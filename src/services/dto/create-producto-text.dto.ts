import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoTextDto {
  @ApiProperty({ example: 'Pollo a la brasa' })
  @IsString() nombre!: string;

  @ApiProperty({ example: 'Delicioso pollo al carbón' })
  @IsString() descripcion!: string;

  @ApiProperty({ example: 120.5 })
  @Type(() => Number)
  @IsNumber() @Min(0.01) precio!: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber() id_subcategoria!: number;

  @ApiProperty({ example: 'https://cdn.miapp.com/images/pollo.jpg' })
  @IsString() imagen!: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional() @Type(() => Number) @IsNumber() activo?: number;
}
