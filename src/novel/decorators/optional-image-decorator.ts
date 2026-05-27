import {
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export function OptionalImageFile() {
  return UploadedFile(
    new ParseFilePipe({
      fileIsRequired: false,
      validators: [
        new FileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/i,
        }),
        new MaxFileSizeValidator({
          maxSize: 2 * 1024 * 1024,
        }),
      ],
    }),
  );
}