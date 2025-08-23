// src/modules/roles/roles.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { successResponse } from '../../utils/success-response';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.rolesService.create(dto);
    return successResponse('Role created', role);
  }

  @Get()
  async findAll() {
    const roles = await this.rolesService.findAll();
    return successResponse('Roles fetched', roles);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.rolesService.findOne(id);
    return successResponse('Role fetched', role);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    const role = await this.rolesService.update(id, dto);
    return successResponse('Role updated', role);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.remove(id);
    return successResponse(`Role ${id} deleted`);
  }
}
