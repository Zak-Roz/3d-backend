import { Post, Controller, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesContentTypesDto, FilesAwsMetaDto } from './models';
import { S3Service } from './s3.service';
import { FilesService } from './file.service';
import { Public } from 'src/common/resources/common/public.decorator';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly s3Service: S3Service,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: () => FilesAwsMetaDto })
  @ApiOperation({
    summary: 'Request for save files.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async prepareLoadUrls(
    @Body() body: FilesContentTypesDto,
  ): Promise<FilesAwsMetaDto> {
    const filesRequests = this.filesService.prepareFiles(body);

    const awsResponses = await Promise.all(
      filesRequests.map(async (file) => {
        const awsResponse = await this.s3Service.createPresignedPost(
          file.key,
          file.contentType,
        );
        return Object.assign(awsResponse, file);
      }),
    );

    const files = await this.filesService.createFilesInDb(filesRequests);

    return new FilesAwsMetaDto(files, awsResponses);
  }
}
