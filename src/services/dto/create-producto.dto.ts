import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  nombre!: string;

  @IsString()
  descripcion!: string;

  @IsNumber()
  @Type(() => Number) // <- esto convierte el texto a número
  precio!: number;

  @IsNumber()
  @Type(() => Number)
  id_restaurante!: number;

  @IsNumber()
  @Type(() => Number)
  id_subcategoria!: number;
}
