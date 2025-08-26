import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { TraineesService } from './trainees.service';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { UpdateTraineeDto } from './dto/update-trainee.dto';
import { AssignProgramDto } from './dto/assign-program.dto';

@Controller('trainees')
export class TraineesController {
  constructor(private readonly svc: TraineesService) {}

  @Post()
  create(@Body() dto: CreateTraineeDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get('get')
  getToday() {
    return this.svc.findToday();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTraineeDto) {
    return this.svc.update(id, dto);
  }

  @Post('sync')
  sync() {
    return this.svc.syncFromBoostapp();
  }

  @Patch(':id/program')
  assignProgram(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignProgramDto,
  ) {
    return this.svc.assignProgram(id, dto);
  }
}
