import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { WorkoutTypesService } from './workout-types.service';
import { CreateWorkoutTypeDto } from './dto/create-workout-type.dto';
import { UpdateWorkoutTypeDto } from './dto/update-workout-type.dto';

@Controller('workout-types')
export class WorkoutTypesController {
  constructor(private readonly svc: WorkoutTypesService) { }

  @Post()
  create(@Body() dto: CreateWorkoutTypeDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkoutTypeDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
