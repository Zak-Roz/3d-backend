import { ApiProperty } from '@nestjs/swagger';
import { File } from './file.entity';
import { FileHelper } from 'src/common/utils/helpers/file.helper';
import { EnumHelper } from 'src/common/utils/helpers/enum.helper';
import { FileStatuses } from 'src/common/resources/files';

export class FileDto {
  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.fileKey = file.fileKey;
    this.status = file.status;
    this.link = FileHelper.getInstance().buildBaseLink(this.fileKey);
  }

  @ApiProperty({ type: () => Number, required: true })
  readonly id: number;

  @ApiProperty({ type: () => String, required: false })
  readonly name: string;

  @ApiProperty({ type: () => String, required: false })
  readonly fileKey: string;

  @ApiProperty({
    type: () => Number,
    required: false,
    enum: FileStatuses,
    description: EnumHelper.enumToDescription(FileStatuses),
  })
  readonly status: FileStatuses;

  @ApiProperty({ type: () => String, required: false })
  readonly link: string;
}
