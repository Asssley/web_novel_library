import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto.js';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
