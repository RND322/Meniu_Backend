import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCategoriaDto {
    @ApiProperty({ example: 'Bebidas', description: 'Nombre de la nueva categoría' })
    @IsString()
    @Length(1, 100)
    nombre!: string;
}
