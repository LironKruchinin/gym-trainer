import { Controller, Post, Body, Get } from '@nestjs/common';
import { TrainingLogsService } from './training-logs.service';
import { CreateTrainingLogDto } from './dto/create-training-log.dto';

@Controller('training-logs')
export class TrainingLogsController {
  constructor(private readonly svc: TrainingLogsService) {}

  @Post()
  create(@Body() dto: CreateTrainingLogDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }
}
