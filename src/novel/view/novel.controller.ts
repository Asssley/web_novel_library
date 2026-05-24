import { Controller, Param, Get, Render, Query, Req } from '@nestjs/common';
import { NovelService } from '../novel.service.js';
import { GetNovelsQueryDto } from '../dto/get-novels-query.dto.js';
import { NovelRateService } from '../../novel-rate/novel-rate.service.js';
import { BookmarksService } from '../../bookmarks/bookmarks.service.js';

@Controller('novels')
export class NovelController {
  constructor(
    private readonly novelService: NovelService,
    private readonly rateService: NovelRateService,
    private readonly bookmarksService: BookmarksService,
    // TODO: private readonly commentService: CommentService,
  ) { }

  @Get()
  @Render("pages/library")
  async getList(
    @Req() req,
    @Query() dto: GetNovelsQueryDto,
  ) {
    const data = await this.novelService.getList(dto);

    return {
      ...data,
      user: req.user,
      title: "Library",
      styles: [
        "pages/novel-list.css",
        "parts/pagination.css",
        "parts/novel-filters.css"
      ],
      scripts: [
        "novel-filter.js"
      ]
    };
  }

  @Get(":id")
  @Render("pages/novel")
  async getById(
    @Req() req,
    @Param("id") novelId: string
  ) {
    const novel = await this.novelService.getById(novelId);
    const novelRate = await this.rateService.getRate(novel.novel.id);
    //const bookmark = this.bookmarksService.getBookmark()

    return {
      ...novel,
      novelRate,
      user: req.user,
      title: novel.novel.title,
      styles: [
        "pages/novel.css"
      ],
      scripts: []
    };
  }
}
