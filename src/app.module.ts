import { Module } from '@nestjs/common';
import { ConfigModule } from './common/utils/config/config.module';
import { UsersModule } from './workouts/workout.module';
import { FileModule } from './files/file.module';

@Module({
  imports: [UsersModule, FileModule, ConfigModule],
  providers: [],
})
export class AppModule {}
