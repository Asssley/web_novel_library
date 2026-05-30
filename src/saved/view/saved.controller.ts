import { Controller, Req, Get, Render, Query, UseGuards } from '@nestjs/common';
import { SavedService } from '../saved.service.js';
import { GetSavedNovelsQueryDto } from '../dto/get-saved-novels-query.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('/saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Render("pages/saved")
  async getList(
    @Req() req,
    @Query() dto: GetSavedNovelsQueryDto,
  ) {
    const data = await this.savedService.getSavedList(req.user.id, dto, req.lang);

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
