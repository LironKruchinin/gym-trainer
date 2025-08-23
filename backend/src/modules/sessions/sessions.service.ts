import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly repo: Repository<Session>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async create(dto: CreateSessionDto) {
    const trainees = await this.users.findBy({ id: In(dto.trainee_ids) });
    const session = this.repo.create({
      start_time: new Date(dto.start_time),
      trainees,
    });
    return this.repo.save(session);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: number, dto: UpdateSessionDto) {
    const session = await this.repo.findOneOrFail({ where: { id } });
    if (dto.start_time) {
      session.start_time = new Date(dto.start_time);
    }
    if (dto.trainee_ids) {
      session.trainees = await this.users.findBy({ id: In(dto.trainee_ids) });
    }
    return this.repo.save(session);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}
