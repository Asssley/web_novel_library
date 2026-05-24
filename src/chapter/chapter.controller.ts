import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChapterService } from './chapter.service.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('novels/:novelId/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Param("novelId") novelId: string,
    @Body() dto: CreateChapterDto
  ) {
    return this.chapterService.create(req.user.id, novelId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param("novelId") novelId: string,
    @Param('id') chapterId: string,
    @Body() dto: UpdateChapterDto
  ) {
    return this.chapterService.update(req.user.id, novelId, chapterId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Req() req,
    @Param("novelId") novelId: string,
    @Param('id') chapterId: string,
  ) {
    return this.chapterService.remove(req.user.id, novelId, chapterId);
  }
}
