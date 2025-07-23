import { IsInt } from 'class-validator';

export class CreateComplementoDto {
  @IsInt()
  id_producto_principal!: number;

  @IsInt()
  id_producto_complemento!: number;
}