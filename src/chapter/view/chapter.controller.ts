import { Controller } from '@nestjs/common';
import { ChapterService } from '../chapter.service.js';

@Controller('novels/:novelId/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) { }


}
