import { Injectable } from '@nestjs/common';
import { NovelService } from './novel/novel.service.js';
import { Lang } from './generated/enums.js';

@Injectable()
export class AppService {
  constructor(private readonly novelService: NovelService) {}
  
  async getHomePage(lang: Lang){
    const [
      popular,
      latest,
      recentlyUpdated,
    ] = await Promise.all([
      this.novelService.getPopular(5, lang),
      this.novelService.getLatest(5, lang),
      this.novelService.getRecentlyUpdated(5, lang),
    ]);

    return {
      popular,
      latest,
      recentlyUpdated,
    };
  }
}
