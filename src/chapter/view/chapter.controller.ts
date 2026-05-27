import { Controller, Get, Param, Render, Req } from '@nestjs/common';
import { ChapterService } from '../chapter.service.js';

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
      title: "Add novel",
      styles: [
        "pages/forms.css",
      ],
      scripts: [
        "chapter-form.js"
      ]
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


}
