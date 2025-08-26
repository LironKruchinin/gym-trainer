import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingTime } from './entities/training-time.entity';
import { CreateTrainingTimeDto } from './dto/create-training-time.dto';
import { User } from '../users/entities/user.entity';
import { TrainingProgram } from '../training-programs/entities/training-program.entity';

@Injectable()
export class TrainingTimesService {
  constructor(
    @InjectRepository(TrainingTime) private readonly repo: Repository<TrainingTime>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(TrainingProgram) private readonly programRepo: Repository<TrainingProgram>,
  ) {}

  async create(dto: CreateTrainingTimeDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
      let program: TrainingProgram | null = null;
      if (dto.programId) {
        program = await this.programRepo.findOne({ where: { id: dto.programId } });
        if (!program) throw new NotFoundException('Program not found');
      }
      const entity = this.repo.create({
        user,
        training_time: new Date(dto.trainingTime),
        program: program ?? undefined,
        details: dto.details,
      });
      return await this.repo.save(entity);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to create training time');
    }
  }

  async findAll() {
    try {
      return await this.repo.find();
    } catch {
      throw new InternalServerErrorException('Failed to fetch training times');
    }
  }
}
