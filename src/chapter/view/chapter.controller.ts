import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { ChapterService } from '../chapter.service.js';
import { GetChaptetrsQueryDto } from '../dto/get-chapters-query.dto.js';

@Controller('novels/:novelId/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) { }

  @Get("/add")
  @Render("pages/chapter-form")
  async getCreateNovelForm(
    @Req() req
  ) {

    return {
      chapter: null,
      user: req.user,
      title: "Add chapter",
      styles: [
        "pages/forms.css",
      ],
      scripts: [
        "chapter-form.js"
      ]
    };
  }

  @Get()
  @Render("pages/chapter-list")
  async getChaptersList(
    @Req() req,
    @Param("novelId") novelId: string,
    @Query() dto: GetChaptetrsQueryDto,
  ) {
    const data = await this.chapterService.getListPageData(novelId, dto);

    return {
      ...data,
      user: req.user,
      title: data.novel.title,
      styles: [
        "pages/chapter-list.css",
        "parts/chapter-list.css",
        "parts/pagination.css",
      ],
      scripts: []
    };
  }

  @Get("/:chapterId/edit")
  @Render("pages/chapter-form")
  async getEditNovelForm(
    @Req() req,
    @Param("chapterId") chapterId: string
  ) {
    const chapter = await this.chapterService.getById(chapterId);

    return {
      chapter: chapter,
      user: req.user,
      title: "Edit chapter: " + chapter.title,
      styles: [
        "pages/forms.css",
      ],
      scripts: [
        "chapter-form.js"
      ]
    };
  }

  @Get("/:chapterId")
  @Render("pages/read-chapter")
  async getChapter(
    @Req() req,
    @Param("novelId") novelId: string,
    @Param("chapterId") chapterId: string
  ) {
    const data = await this.chapterService.getChapterPageData(novelId, chapterId);

    return {
      ...data,
      user: req.user,
      title: data.chapter.title,
      styles: [
        "pages/read-chapter.css",
        "parts/pagination.css"
      ],
      scripts: []
    };
  }

}
