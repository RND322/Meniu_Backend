import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../common/entities/plan.entity';

@Injectable()
export class PlanesService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) { }

  //Obtener todos lo planes
  async obtenerTodosLosPlanes(): Promise<Plan[]> {
    return this.planRepository.find({
      order: { precio: 'ASC' }, // Ordenados por precio ascendente
    });
  }
}