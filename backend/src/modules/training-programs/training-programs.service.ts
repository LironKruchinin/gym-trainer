import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingProgram } from './entities/training-program.entity';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { UpdateTrainingProgramDto } from './dto/update-training-program.dto';

@Injectable()
export class TrainingProgramsService {
  constructor(
    @InjectRepository(TrainingProgram)
    private readonly repo: Repository<TrainingProgram>,
  ) { }

  create(dto: CreateTrainingProgramDto) {
    const tp = this.repo.create(dto);
    return this.repo.save(tp);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: number, dto: UpdateTrainingProgramDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
