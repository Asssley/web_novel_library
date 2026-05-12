import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChapterService } from './chapter.service.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('novels/:novelId/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(
    @Req() req,
    @Param("novelId") novelId: string,
    @Body() dto: CreateChapterDto
  ) {
    return this.chapterService.create(req.user.id, novelId, dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  async update(
    @Req() req,
    @Param("novelId") novelId: string,
    @Param('id') chapterId: string,
    @Body() dto: UpdateChapterDto
  ) {
    return this.chapterService.update(req.user.id, novelId, chapterId, dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(
    @Req() req,
    @Param("novelId") novelId: string,
    @Param('id') chapterId: string,
  ) {
    return this.chapterService.remove(req.user.id, novelId, chapterId);
  }
}
