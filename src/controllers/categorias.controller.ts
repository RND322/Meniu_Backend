import { Controller, Get, HttpStatus, UseGuards, Req, Body, Post, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { CategoriasService } from 'src/services/categorias.service';
import { CategoriaProducto } from 'src/common/entities/categoria-producto.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateCategoriaDto } from 'src/services/dto/create-categoria.dto';
import { SubcategoriaProducto } from 'src/common/entities/subcategoria-producto.entity';
import { CreateSubcategoriaDto } from 'src/services/dto/create-subcategoria.dto';
import { UpdateCategoriaDto } from 'src/services/dto/update-categoria.dto';
import { UpdateSubcategoriaDto } from 'src/services/dto/update-subcategoria.dto';

@ApiTags('categorias')
@Controller('categorias')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    // Endpoint GET: Obtener todas las categorias y subcategorias
    @Get('todas')
    @ApiOperation({ summary: 'Listar categorías activas y sus subcategorias activas' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Listado de categorías activas',
        type: [CategoriaProducto],
    })
    async findAllActive(): Promise<CategoriaProducto[]> {
        return this.categoriasService.findAllActive();
    }

    // Endpoint GET: Obtener todas las categorias y subcategorias uso para Gerentes/Administradores
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Get('gestion-todas')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Listar todas las categorías y sus subcategorias (Gestion) - Uso para Gerente, Administrador' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Listado completo de categorías',
        type: [CategoriaProducto],
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Sin permiso o token inválido',
    })
    async findAllAdmin(): Promise<CategoriaProducto[]> {
        return this.categoriasService.findAllAdmin();
    }

    //Endpoint POST: Crear una nueva categoria uso para Gerentes/Administradores
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Post('crear')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Crear nueva categoría (Gestion) - Uso para Gerente, Administrador' })
    @ApiBody({ type: CreateCategoriaDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Categoría creada',
        type: CategoriaProducto,
    })
    async createCategoria(
        @Body() dto: CreateCategoriaDto,
    ): Promise<CategoriaProducto> {
        return this.categoriasService.createCategoria(dto);
    }

    // Endpoint POST: Crear una nueva subcategoria uso para Gerentes/Administradores
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Post(':id/subcategorias')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Crear nueva subcategoría en una categoría existente (Gestion) - Uso para Gerente, Administrador' })
    @ApiParam({ name: 'id', description: 'ID de la categoría padre', type: Number, example: 1 })
    @ApiBody({ type: CreateSubcategoriaDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Subcategoría creada',
        type: SubcategoriaProducto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Categoría padre no encontrada',
    })
    async createSubcategoria(
        @Param('id') id_categoria: number,
        @Body() dto: CreateSubcategoriaDto,
    ): Promise<SubcategoriaProducto> {
        return this.categoriasService.createSubcategoria(id_categoria, dto);
    }

    //Endpoint PUT: Actualizar una categoria uso para Gerentes/Administradores
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Actualizar categoría existente (Gestion) - Uso para Gerente, Administrador' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID de la categoría' })
    @ApiBody({ type: UpdateCategoriaDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Categoría actualizada',
        type: CategoriaProducto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Categoría no encontrada',
    })
    async updateCategoria(
        @Param('id') id: number,
        @Body() dto: UpdateCategoriaDto,
    ): Promise<CategoriaProducto> {
        return this.categoriasService.updateCategoria(id, dto);
    }

    //Endpoint PUT: Actualizar una subcategoria uso para Gerentes/Administradores
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Put('subcategorias/:id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Actualizar subcategoría existente por ID (Gestion) - Uso para Gerente, Administrador' })
    @ApiParam({
        name: 'id',
        description: 'ID de la subcategoría a actualizar',
        type: Number,
        example: 5,
    })
    @ApiBody({ type: UpdateSubcategoriaDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Subcategoría actualizada',
        type: SubcategoriaProducto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Subcategoría no encontrada',
    })
    async updateSubcategoria(
        @Param('id') id: number,
        @Body() dto: UpdateSubcategoriaDto,
    ): Promise<SubcategoriaProducto> {
        return this.categoriasService.updateSubcategoria(id, dto);
    }
}
