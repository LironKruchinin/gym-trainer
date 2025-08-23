// src/modules/roles/roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) { }

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ name });
    if (!role) throw new NotFoundException(`Role "${name}" not found`);
    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    await this.findOne(id); // will 404 if missing
    await this.roleRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roleRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role ${id} not found`);
    }
  }
}
