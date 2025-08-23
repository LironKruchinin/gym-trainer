import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutType } from './entities/workout-type.entity';
import { CreateWorkoutTypeDto } from './dto/create-workout-type.dto';
import { UpdateWorkoutTypeDto } from './dto/update-workout-type.dto';

@Injectable()
export class WorkoutTypesService {
  constructor(
    @InjectRepository(WorkoutType)
    private readonly repo: Repository<WorkoutType>,
  ) { }

  create(dto: CreateWorkoutTypeDto) {
    const wt = this.repo.create(dto);
    return this.repo.save(wt);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: number, dto: UpdateWorkoutTypeDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
