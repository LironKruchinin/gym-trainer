import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingLog } from './entities/training-log.entity';
import { CreateTrainingLogDto } from './dto/create-training-log.dto';
import { Trainee } from '../trainees/entities/trainee.entity';
import { TrainingProgram } from '../training-programs/entities/training-program.entity';

@Injectable()
export class TrainingLogsService {
  constructor(
    @InjectRepository(TrainingLog)
    private readonly repo: Repository<TrainingLog>,
    @InjectRepository(Trainee)
    private readonly traineeRepo: Repository<Trainee>,
    @InjectRepository(TrainingProgram)
    private readonly programRepo: Repository<TrainingProgram>,
  ) {}

  async create(dto: CreateTrainingLogDto) {
    const trainee = await this.traineeRepo.findOne({
      where: { id: dto.traineeId },
    });
    const program = await this.programRepo.findOne({
      where: { id: dto.programId },
    });
    if (!trainee || !program) return null;
    const log = this.repo.create({ trainee, program, details: dto.details });
    return this.repo.save(log);
  }

  findAll() {
    return this.repo.find();
  }
}
