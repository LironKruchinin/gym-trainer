import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainee } from './entities/trainee.entity';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { UpdateTraineeDto } from './dto/update-trainee.dto';
import { AssignProgramDto } from './dto/assign-program.dto';
import { TrainingProgram } from '../training-programs/entities/training-program.entity';
import { ConfigService } from '@nestjs/config';
import { Between } from 'typeorm';

@Injectable()
export class TraineesService {
  constructor(
    @InjectRepository(Trainee) private readonly repo: Repository<Trainee>,
    @InjectRepository(TrainingProgram)
    private readonly programRepo: Repository<TrainingProgram>,
    private readonly config: ConfigService,
  ) {}

  create(dto: CreateTraineeDto) {
    return this.repo.save({
      name: dto.name,
      reservedTime: new Date(dto.reservedTime),
    });
  }

  findAll() {
    return this.repo.find();
  }

  findToday() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return this.repo.find({
      where: { reservedTime: Between(start, end) },
      order: { reservedTime: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateTraineeDto) {
    return this.repo.save({
      id,
      ...dto,
      reservedTime: dto.reservedTime ? new Date(dto.reservedTime) : undefined,
    });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }

  async assignProgram(id: number, dto: AssignProgramDto) {
    const trainee = await this.repo.findOne({ where: { id } });
    if (!trainee) return null;
    trainee.program = await this.programRepo.findOne({
      where: { id: dto.programId },
    });
    return this.repo.save(trainee);
  }

  async syncFromBoostapp() {
    const apiUrl = this.config.get<string>('BOOSTAPP_API_URL');
    const apiKey = this.config.get<string>('BOOSTAPP_API_KEY');

    let data: { name: string; reservedTime: string }[] = [];

    if (apiUrl && apiKey) {
      try {
        const resp = await fetch(`${apiUrl}/trainees`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (resp.ok) {
          data = await resp.json();
        }
      } catch {
        // fall back to scraping
      }
    }

    if (!data.length) {
      data = await this.scrapeFromBoostapp();
    }

    for (const item of data) {
      const existing = await this.repo.findOne({
        where: { name: item.name, reservedTime: new Date(item.reservedTime) },
      });
      if (!existing) {
        const trainee = this.repo.create({
          name: item.name,
          reservedTime: new Date(item.reservedTime),
        });
        await this.repo.save(trainee);
      }
    }
    return this.findAll();
  }

  private async scrapeFromBoostapp() {
    const pageUrl = this.config.get<string>('BOOSTAPP_SCRAPE_URL');
    if (!pageUrl) return [];
    try {
      const resp = await fetch(pageUrl);
      if (!resp.ok) return [];
      const html = await resp.text();
      const trainees: { name: string; reservedTime: string }[] = [];
      const regex = /data-trainee-name="([^"]+)"\s+data-reserved-time="([^"]+)"/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(html)) !== null) {
        trainees.push({ name: match[1], reservedTime: match[2] });
      }
      return trainees;
    } catch {
      return [];
    }
  }
}
