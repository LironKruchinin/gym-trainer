import { Controller, Get, Post, Body } from '@nestjs/common';
import { TrainingTimesService } from './training-times.service';
import { CreateTrainingTimeDto } from './dto/create-training-time.dto';

@Controller('training-times')
export class TrainingTimesController {
  constructor(private readonly service: TrainingTimesService) {}

  @Post()
  create(@Body() dto: CreateTrainingTimeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
