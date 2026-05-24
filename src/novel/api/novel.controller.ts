import { Controller, Post, Body, Patch, Param, Delete, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { NovelService } from '../novel.service.js';
import { CreateNovelDto } from '../dto/create-novel.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFile } from '../decorators/image-file.decorator.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('novels')
export class NovelController {
  constructor(private readonly novelService: NovelService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Req() req,
    @ImageFile() file: Express.Multer.File,
    @Body() createNovelDto: CreateNovelDto
  ) {
    return await this.novelService.create(req.user.id, file, createNovelDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch("update-image/:id")
  async updateImage(
    @Req() req,
    @ImageFile() file: Express.Multer.File,
    @Param("id") novelId: string
  ) {
    return this.novelService.updateImage(req.user.id, novelId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteById(
    @Req() req,
    @Param("id") novelId: string
  ) {
    return this.novelService.deleteById(req.user.id, novelId);
  }
}
