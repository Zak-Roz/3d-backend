import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpCode,
  Inject,
  Request,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CreateWorkoutDto } from './models/create-workout.dto';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { WorkoutDto } from './models/workout.dto';
import { WorkoutsService } from './workout.service';
import { Public } from 'src/common/resources/common/public.decorator';
import { Sequelize } from 'sequelize-typescript';
import { Provides } from 'src/common/resources/common/provides';
// import { Transaction } from 'sequelize/types';
import { Workout, WorkoutsDto } from './models';
import { SpeechClient } from '@google-cloud/speech';
import { ScopeOptions } from 'sequelize';

const keyWordLevelLight = ['easy', 'light'];
const keyWordLevelMid = ['mid', 'middle'];
const keyWordLevelHard = ['hard', 'heavy'];
const keyWordMuscleGroupBody = [
  'body',
  'chest',
  'delt',
  'delts',
  'deltoid',
  'deltoids',
  'tricep',
  'triceps',
  'bicep',
  'biceps',
  'obliques',
  'oblique',
  'serrates',
  'anterior',
  'trap',
  'traps',
  'forearm',
  'flexor',
  'flexors',
  'extensor',
  'extensors',
  'arm',
  'arms',
];
const keyWordMuscleGroupBack = ['back', 'latissimus', 'dorsi'];
const keyWordMuscleGroupLegs = [
  'deadlifts',
  'squats',
  'lunges',
  'leg',
  'legs',
  'jumps',
];

const keyWordLevel = [
  ...keyWordLevelLight,
  ...keyWordLevelMid,
  ...keyWordLevelHard,
];
const keyWordMuscleGroup = [
  ...keyWordMuscleGroupBody,
  ...keyWordMuscleGroupBack,
  ...keyWordMuscleGroupLegs,
];

const keyAllWords = [...keyWordLevel, ...keyWordMuscleGroup];

@ApiTags('workouts')
@Controller('workouts')
export class WorkoutController {
  client: SpeechClient;
  constructor(
    private readonly workoutsService: WorkoutsService,
    @Inject(Provides.sequelize) private readonly dbConnection: Sequelize,
  ) {
    this.client = new SpeechClient();
  }

  @Public()
  @ApiOperation({ summary: 'Get workouts' })
  @ApiOkResponse({ type: () => WorkoutDto })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getWorkouts(@Query() query: Omit<CreateWorkoutDto, 'fileId'>) {
    const scopes: (string | ScopeOptions)[] = ['withFile'];

    if (query.muscleGroup) {
      scopes.push({ method: ['byMuscleGroup', query.muscleGroup] });
    }

    if (query.descriptions) {
      scopes.push({ method: ['byDescriptions', query.descriptions] });
    }

    if (query.name) {
      scopes.push({ method: ['byName', query.name] });
    }

    if (query.level) {
      scopes.push({ method: ['byLevel', query.level] });
    }

    const workouts = await this.workoutsService.getList(scopes);

    return new WorkoutsDto(workouts);
  }

  @Public()
  @ApiOperation({ summary: 'speech-to-text' })
  @ApiOkResponse({ type: () => WorkoutsDto })
  @HttpCode(HttpStatus.OK)
  @Post('/speech-to-text')
  async speechToText(@Request() req) {
    let workouts: Workout[] = [];

    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      speechContext: {
        phrases: keyAllWords,
        boost: 20,
      },
    };

    if (!req?.files?.file) {
      throw new BadRequestException({
        message: 'CANNOT_GET_FILE',
        errorCode: 'CANNOT_GET_FILE',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const audio: { content: string } = {
      content: req.files.file.data.toString('base64'),
    };

    const request = {
      config,
      audio,
    };

    const [response] = await this.client.recognize(request as any);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n')
      .toLocaleLowerCase();
    console.log(
      '🚀 ~ file: workout.controller.ts:161 ~ WorkoutController ~ speechToText ~ transcription:',
      transcription,
    );
    const res_words = transcription.split(' ');
    const resArr = res_words.filter((value) => keyAllWords.includes(value));
    console.log(
      '🚀 ~ file: workout.controller.ts:167 ~ WorkoutController ~ speechToText ~ resArr:',
      resArr,
    );
    if (resArr.length) {
      const scopes: (string | ScopeOptions)[] = ['withFile'];

      if (resArr.some((word) => keyWordMuscleGroup.includes(word))) {
        const muscleGroups = [];
        if (resArr.some((word) => keyWordMuscleGroupBody.includes(word))) {
          muscleGroups.push('body');
        }
        if (resArr.some((word) => keyWordMuscleGroupBack.includes(word))) {
          muscleGroups.push('back');
        }
        if (resArr.some((word) => keyWordMuscleGroupLegs.includes(word))) {
          muscleGroups.push('legs');
        }
        scopes.push({ method: ['byMuscleGroups', muscleGroups] });
      }

      if (resArr.some((word) => keyWordLevel.includes(word))) {
        const levels = [];
        if (resArr.some((word) => keyWordLevelLight.includes(word))) {
          levels.push('light');
        }
        if (resArr.some((word) => keyWordLevelMid.includes(word))) {
          levels.push('middle');
        }
        if (resArr.some((word) => keyWordLevelHard.includes(word))) {
          levels.push('hard');
        }
        scopes.push({ method: ['byLevels', levels] });
      }

      workouts = await this.workoutsService.getList(scopes);
    }
    return new WorkoutsDto(workouts);
  }

  @Public()
  @ApiOperation({ summary: 'create workout' })
  @ApiCreatedResponse({ type: () => WorkoutDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async create(@Body() body: CreateWorkoutDto) {
    const workout = await this.workoutsService.create({ ...body });

    return new WorkoutDto(workout);
    // return this.dbConnection.transaction(async (transaction: Transaction) => {
    //   let user = await this.workoutsService.getUserByEmail(
    //     body.email,
    //     [],
    //     transaction,
    //   );
    //   if (user) {
    //     throw new BadRequestException({
    //       message: this.translator.translate('EMAIL_ALREADY_EXIST'),
    //       errorCode: 'EMAIL_ALREADY_EXIST',
    //       statusCode: HttpStatus.BAD_REQUEST,
    //     });
    //   }
    //   user = await this.workoutsService.create({ ...body });
    //   await this.verificationsService.createEmailVerification(
    //     user,
    //     transaction,
    //   );
    //   return new WorkoutDto(user);
    // });
  }
}
