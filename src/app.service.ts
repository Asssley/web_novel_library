import { Injectable } from '@nestjs/common';
import { NovelService } from './novel/novel.service.js';

@Injectable()
export class AppService {
  constructor(private readonly novelService: NovelService) {}
  
  async getHomePage(){
    const [
      popular,
      latest,
      recentlyUpdated,
    ] = await Promise.all([
      this.novelService.getPopular(5),
      this.novelService.getLatest(5),
      this.novelService.getRecentlyUpdated(5),
    ]);

    return {
      popular,
      latest,
      recentlyUpdated,
    };
  }
}
