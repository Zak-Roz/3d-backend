import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateWorkoutDto {
  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  readonly descriptions?: string;

  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  readonly level?: string;

  @ApiProperty({ type: () => String, required: false })
  @Type(() => String)
  @Transform(({ value }) => value.trim())
  @IsOptional()
  readonly muscleGroup?: string;

  @ApiProperty({ type: () => Number, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  readonly fileId?: number;
}
