import {
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export function ImageFile() {
  return UploadedFile(
    new ParseFilePipe({
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