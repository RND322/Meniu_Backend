import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from 'src/services/roles.service';
import { Rol } from 'src/common/entities/rol.entity';
import { RoleResponseDto } from 'src/services/dto/role-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    //Endpoint GET: Listar roles - Uso Gerente/Administrador
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Get()
    @ApiOperation({ summary: 'Listar todos los roles (Gestion) - Uso para Gerente, Administrador' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Listado de roles',
        type: [RoleResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Token inválido o sin permisos',
    })
    async findAll(): Promise<RoleResponseDto[]> {
        const roles: Rol[] = await this.rolesService.findAll();
        return roles.map(r => ({
            id_rol: r.id_rol,
            nombreRol: r.nombreRol,
        }));
    }
}
