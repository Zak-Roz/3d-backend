import { Module } from '@nestjs/common';
import { FileModule } from 'src/files/file.module';
import { UsersModule } from 'src/workouts/workout.module';

@Module({
  imports: [UsersModule, FileModule],
})
export class SwaggerAppModule {}
