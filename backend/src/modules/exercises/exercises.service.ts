import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExerciseTranslation } from './entities/exercise-translation.entity';
import { ExerciseInfo } from './entities/exercise-info.entity';
import { ExerciseVideo } from './entities/exercise-video.entity';
import { Muscle } from './entities/muscle.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService implements OnModuleInit {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(ExerciseTranslation)
    private readonly translationRepo: Repository<ExerciseTranslation>,
    @InjectRepository(ExerciseInfo)
    private readonly infoRepo: Repository<ExerciseInfo>,
    @InjectRepository(ExerciseVideo)
    private readonly videoRepo: Repository<ExerciseVideo>,
    @InjectRepository(Muscle)
    private readonly muscleRepo: Repository<Muscle>,
  ) { }

  create(dto: CreateExerciseDto) {
    const e = this.exerciseRepo.create(dto);
    return this.exerciseRepo.save(e);
  }

  async onModuleInit() {
    const count = await this.exerciseRepo.count();
    if (count === 0) {
      await this.syncFromWger();
    }
  }

  async findAll() {
    const exercises = await this.exerciseRepo.find({ relations: ['translations', 'videos'] });
    if (exercises.length === 0) {
      return this.syncFromWger();
    }
    return exercises;
  }

  findOne(id: number) {
    return this.exerciseRepo.findOneOrFail({ where: { id }, relations: ['translations', 'videos'] });
  }

  async update(id: number, dto: UpdateExerciseDto) {
    await this.exerciseRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.exerciseRepo.delete(id);
  }

  async syncFromWger() {
    const [exRes, trRes, infoRes, vidRes, muscleRes] = await Promise.all([
      fetch('https://wger.de/api/v2/exercise/?language=21&limit=2000'),
      fetch('https://wger.de/api/v2/exercise-translation/?limit=2000'),
      fetch('https://wger.de/api/v2/exerciseinfo/?limit=2000'),
      fetch('https://wger.de/api/v2/video/?limit=2000'),
      fetch('https://wger.de/api/v2/muscle/?limit=2000'),
    ]);

    const [exData, trData, infoData, vidData, muscleData] = await Promise.all([
      exRes.json(),
      trRes.json(),
      infoRes.json(),
      vidRes.json(),
      muscleRes.json(),
    ]);

    for (const item of exData.results ?? []) {
      let name = item.name as string | undefined;
      if (!name) {
        const fallback = trData.results?.find((t) => t.exercise === item.id);
        name = fallback?.name;
        if (!name) {
          continue; // skip exercises without any name
        }
        item.description = item.description ?? fallback.description;
      }
      let exercise = await this.exerciseRepo.findOne({ where: { wgerId: item.id } });
      if (!exercise) {
        exercise = this.exerciseRepo.create({
          wgerId: item.id,
          name: item.name,
          category: 'accessory',
          description: item.description,
        });
      } else {
        exercise.name = item.name;
        exercise.description = item.description;
      }
      await this.exerciseRepo.save(exercise);
    }

    for (const t of trData.results ?? []) {
      const exercise = await this.exerciseRepo.findOne({ where: { wgerId: t.exercise } });
      if (!exercise) continue;
      let translation = await this.translationRepo.findOne({ where: { exercise: { id: exercise.id }, language: t.language } });
      if (!translation) {
        translation = this.translationRepo.create({
          exercise,
          language: t.language,
          name: t.name,
          description: t.description,
        });
      } else {
        translation.name = t.name;
        translation.description = t.description;
      }
      await this.translationRepo.save(translation);
    }

    for (const m of muscleData.results ?? []) {
      let muscle = await this.muscleRepo.findOne({ where: { wgerId: m.id } });
      if (!muscle) {
        muscle = this.muscleRepo.create({ wgerId: m.id, name: m.name, isFront: m.is_front });
      } else {
        muscle.name = m.name;
        muscle.isFront = m.is_front;
      }
      await this.muscleRepo.save(muscle);
    }

    for (const info of infoData.results ?? []) {
      let rec = await this.infoRepo.findOne({ where: { wgerId: info.id } });
      if (!rec) {
        rec = this.infoRepo.create({ wgerId: info.id, info });
      } else {
        rec.info = info;
      }
      await this.infoRepo.save(rec);
    }

    for (const v of vidData.results ?? []) {
      const exercise = await this.exerciseRepo.findOne({ where: { wgerId: v.exercise } });
      if (!exercise) continue;
      let video = await this.videoRepo.findOne({ where: { wgerId: v.id } });
      if (!video) {
        video = this.videoRepo.create({ wgerId: v.id, url: v.video, exercise });
      } else {
        video.url = v.video;
        video.exercise = exercise;
      }
      await this.videoRepo.save(video);
    }

    return this.exerciseRepo.find({ relations: ['translations', 'videos'] });
  }
}
