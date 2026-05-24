import {
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export function ImageFile() {
  return UploadedFile(
    new ParseFilePipe({
      fileIsRequired: true,
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