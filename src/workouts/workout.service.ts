import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Workout } from './models';
import { Transaction } from 'sequelize/types';
import { Repository } from 'sequelize-typescript';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';
import { ScopeOptions } from 'sequelize';

@Injectable()
export class WorkoutsService extends BaseService<Workout> {
  constructor(
    @Inject(Provides.workout) protected readonly model: Repository<Workout>,
  ) {
    super(model);
  }

  create(
    body: { [key: string]: number | string },
    transaction?: Transaction,
  ): Promise<Workout> {
    return this.model.create({ ...body }, { transaction });
  }

  async getById(
    id: number,
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<Workout> {
    const workout = await this.model
      .scope(scopes || [])
      .findByPk(id, { transaction });

    if (!workout) {
      throw new NotFoundException({
        message: 'WORKOUT_NOT_FOUND',
        errorCode: 'WORKOUT_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return workout;
  }
}
