import { Controller, Get } from '@nestjs/common';
import { TraineesService } from './trainees.service';

@Controller()
export class TraineeGetController {
  constructor(private readonly svc: TraineesService) {}

  @Get('trainee/get')
  getToday() {
    return this.svc.findToday();
  }
}
