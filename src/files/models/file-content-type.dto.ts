import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumHelper } from 'src/common/utils/helpers/enum.helper';
import { FilesValidationRules } from 'src/common/resources/files';

const fileContentTypes: string[] = Object.keys(
  FilesValidationRules.filesContentTypes,
).reduce(
  (contentTypesArray, contentType) =>
    contentTypesArray.concat(
      ...FilesValidationRules.filesContentTypes[contentType].contentTypes,
    ),
  [],
);

export class FileContentTypeDto {
  @ApiProperty({
    type: () => String,
    required: true,
    enum: fileContentTypes,
    description: EnumHelper.enumToDescription(fileContentTypes),
  })
  @IsNotEmpty()
  @IsEnum(fileContentTypes)
  contentType: string;
}
