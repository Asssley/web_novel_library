import { Controller, Param, Get, Render, Query, Req, HttpException } from '@nestjs/common';
import { NovelService } from '../novel.service.js';
import { GetNovelsQueryDto } from '../dto/get-novels-query.dto.js';
import { GetUserNovelsDto } from '../dto/get-user-novels.dto.js';

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

  @Get("my")
  @Render("pages/user-novels")
  async getUserNovels(
    @Req() req,
    @Query() dto: GetUserNovelsDto,
  ) {
    const data = await this.novelService.getUserNovels(req.user.id, dto);

    return {
      ...data,
      user: req.user,
      title: "My novels",
      styles: [
        "pages/user-novels.css",
        "parts/pagination.css",
        "parts/novel-filters.css"
      ],
      scripts: [
        "novel-filter.js"
      ]
    };
  }

  @Get("my/:id")
  @Render("pages/manage-novel")
  async manageNovel(
    @Req() req,
    @Param("id") novelId: string,
    @Query() dto: GetUserNovelsDto,
  ) {
    const data = await this.novelService.getNovelForManage(novelId, dto);

    return {
      ...data,
      user: req.user,
      title: "Manage - " + data.novel.title,
      styles: [
        "pages/manage-novel.css",
        "parts/pagination.css",
      ],
      scripts: []
    };
  }

  @Get("/add")
  @Render("pages/novel-form")
  async getCreateNovelForm(
    @Req() req
  ) {

    return {
      novel: null,
      user: req.user,
      title: "Add novel",
      styles: [
        "pages/forms.css",
      ],
      scripts: [
        "novel-form.js"
      ]
    };
  }
  

  @Get(":id")
  @Render("pages/novel")
  async getById(
    @Req() req,
    @Param("id") novelId: string
  ) {
    const novel = await this.novelService.getFullNovelInfo(req.user?.id, novelId)

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
