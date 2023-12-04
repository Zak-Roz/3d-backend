import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/base/base.dto';
import { FileDto } from 'src/files/models';
import { Workout } from '.';

export class WorkoutDto extends BaseDto {
  constructor(data: Workout) {
    super(data);
    this.name = data.name;
    this.descriptions = data.descriptions;
    this.level = data.level;
    this.muscleGroup = data.muscleGroup;
    this.fileId = data.fileId || undefined;
    this.file = data.file ? new FileDto(data.file) : undefined;
  }

  @ApiProperty({ type: () => String, required: false })
  readonly name: string;

  @ApiProperty({ type: () => String, required: false })
  readonly descriptions: string;

  @ApiProperty({ type: () => String, required: false })
  readonly level: string;

  @ApiProperty({ type: () => String, required: false })
  readonly muscleGroup: string;

  @ApiProperty({ type: () => Number, required: false })
  readonly fileId?: number;

  @ApiProperty({ type: () => FileDto || undefined, required: false })
  readonly file?: FileDto;
}
