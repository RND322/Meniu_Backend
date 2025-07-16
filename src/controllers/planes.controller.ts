import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Plan } from '../common/entities/plan.entity';
import { PlanesService } from '../services/planes.service';

@ApiTags('planes')
@Controller('planes')
export class PlanesController {
    constructor(private readonly planesService: PlanesService) { }

    // Endpoint GET: Obtener todos los planes
    @Get('todos')
    @ApiOperation({ summary: 'Obtener todos los planes disponibles' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Listado de todos los planes',
        type: [Plan],
    })
    async obtenerTodosLosPlanes(): Promise<Plan[]> {
        return this.planesService.obtenerTodosLosPlanes();
    }
}