import { Controller, Param, Get, Render, Query, Req, HttpException } from '@nestjs/common';
import { NovelService } from '../novel.service.js';
import { GetNovelsQueryDto } from '../dto/get-novels-query.dto.js';

@Controller('novels')
export class NovelController {
  constructor(
    private readonly novelService: NovelService,
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
    const novel = await this.novelService.getFullNovelInfo(req.user.id, novelId)

    return {
      novel,
      user: req.user,
      title: novel.title,
      styles: [
        "pages/novel.css"
      ],
      scripts: [
        "novel-page.js"
      ]
    };
  }
}
