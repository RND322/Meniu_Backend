import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateSubcategoriaDto {
    @ApiProperty({ example: 'Refrescos', description: 'Nombre de la nueva subcategoría' })
    @IsString()
    @Length(1, 100)
    nombre!: string;
}
