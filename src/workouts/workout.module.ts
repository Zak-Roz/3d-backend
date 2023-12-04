import { Module } from '@nestjs/common';
import { WorkoutController } from './workout.controller';
import { WorkoutsService } from './workout.service';
import { ConfigModule } from 'src/common/utils/config/config.module';
import { sequelizeProvider } from 'src/common/utils/database/database.module';
import { modelProviders } from './models.provider';
import { entities } from 'src/common/utils/database/database-entity.provider';
import { FilesService } from 'src/files/file.service';
import { S3Service } from 'src/files/s3.service';
import { FileHelper } from 'src/common/utils/helpers/file.helper';

@Module({
  imports: [ConfigModule],
  providers: [
    WorkoutsService,
    FilesService,
    S3Service,
    FileHelper,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
  controllers: [WorkoutController],
})
export class UsersModule {}
