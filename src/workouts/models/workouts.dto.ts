import { ApiProperty } from '@nestjs/swagger';
import { WorkoutDto } from './workout.dto';
import { Workout } from './workout.entity';
import { PaginationDto } from 'src/common/models/pagination.dto';

export class WorkoutsDto {
  constructor(data: Workout[], pagination?: PaginationDto) {
    this.data = data.map((item: Workout) => new WorkoutDto(item));
    this.pagination = pagination || undefined;
  }

  @ApiProperty({ type: () => [WorkoutDto] })
  readonly data: WorkoutDto[];

  @ApiProperty({ type: () => PaginationDto, required: false })
  readonly pagination?: PaginationDto;
}
