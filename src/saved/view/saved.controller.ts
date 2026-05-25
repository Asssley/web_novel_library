import { Controller, Req, Get, Render, Query } from '@nestjs/common';
import { SavedService } from '../saved.service.js';
import { GetSavedNovelsQueryDto } from '../dto/get-saved-novels-query.dto.js';

@Controller('/saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) { }

  @Get()
  @Render("pages/saved")
  async getList(
    @Req() req,
    @Query() dto: GetSavedNovelsQueryDto,
  ) {
    const data = await this.savedService.getSavedList(req.user.id, dto);

    return {
      ...data,
      user: req.user,
      title: "Saved",
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
}
