import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import { FilesService } from './file.service';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { FileHelper } from 'src/common/utils/helpers/file.helper';
import { sequelizeProvider } from 'src/common/utils/database/database.module';
import { entities } from 'src/common/utils/database/database-entity.provider';
import { modelProviders } from './models.provider';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    S3Service,
    FileHelper,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
})
export class FileModule {}
