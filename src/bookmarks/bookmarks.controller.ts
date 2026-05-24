import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async create(
    @Req() req,
    @Param("id") novelId: string,
  ) {
    return this.bookmarksService.getBookmark(req.user.id, novelId);
  }
}
