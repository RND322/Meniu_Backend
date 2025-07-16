import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
    @ApiProperty({ example: 1, description: 'ID del rol' })
    id_rol!: number;

    @ApiProperty({ example: 'Gerente', description: 'Nombre del rol' })
    nombreRol!: string;
}
