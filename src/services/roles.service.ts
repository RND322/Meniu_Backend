import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from 'src/common/entities/rol.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Rol)
        private readonly rolRepo: Repository<Rol>,
    ) { }

    //Devuelve todos los roles 
    findAll(): Promise<Rol[]> {
        return this.rolRepo.find();
    }
}
