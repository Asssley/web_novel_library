import { Controller, Post, Body, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ChapterService } from '../chapter.service.js';
import { CreateChapterDto } from '../dto/create-chapter.dto.js';
import { UpdateChapterDto } from '../dto/update-chapter.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('api/novels/:novelId/chapters')
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
  @Put(':id')
  async update(
    @Req() req,
    @Param("novelId") novelId: string,
    @Param('id') chapterId: string,
    @Body() dto: UpdateChapterDto
  ) {
    return this.chapterService.update(req.user.id, novelId, chapterId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-last')
  async deleteLast(
    @Req() req,
    @Param("novelId") novelId: string
  ) {
    return this.chapterService.deleteLast(req.user.id, novelId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Req() req,
    @Param("novelId") novelId: string,
    @Param('id') chapterId: string,
  ) {
    return this.chapterService.delete(req.user.id, novelId, chapterId);
  }
}
