import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingProgram } from './entities/training-program.entity';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { UpdateTrainingProgramDto } from './dto/update-training-program.dto';
import { sanitizeInput } from '../../utils/sanitize.util';

@Injectable()
export class TrainingProgramsService {
  constructor(
    @InjectRepository(TrainingProgram)
    private readonly repo: Repository<TrainingProgram>,
  ) { }

  create(dto: CreateTrainingProgramDto) {
    const sanitized: CreateTrainingProgramDto = {
      ...dto,
      name: sanitizeInput(dto.name),
      description: dto.description ? sanitizeInput(dto.description) : undefined,
      workoutType: sanitizeInput(dto.workoutType),
      timeCap: dto.timeCap ? sanitizeInput(dto.timeCap) : undefined,
      exercises: dto.exercises?.map((e) => ({
        ...e,
        name: sanitizeInput(e.name),
        reps: sanitizeInput(e.reps),
        weight: sanitizeInput(e.weight),
        rest: e.rest ? sanitizeInput(e.rest) : undefined,
      })),
    };
    const tp = this.repo.create(sanitized);
    return this.repo.save(tp);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: number, dto: UpdateTrainingProgramDto) {
    const sanitized: UpdateTrainingProgramDto = {
      ...dto,
      name: dto.name ? sanitizeInput(dto.name) : undefined,
      description: dto.description ? sanitizeInput(dto.description) : undefined,
      workoutType: dto.workoutType ? sanitizeInput(dto.workoutType) : undefined,
      timeCap: dto.timeCap ? sanitizeInput(dto.timeCap) : undefined,
      exercises: dto.exercises?.map((e) => ({
        ...e,
        name: sanitizeInput(e.name),
        reps: sanitizeInput(e.reps),
        weight: sanitizeInput(e.weight),
        rest: e.rest ? sanitizeInput(e.rest) : undefined,
      })),
    };
    await this.repo.update(id, sanitized);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
