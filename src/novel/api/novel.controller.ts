import { Controller, Post, Body, Patch, Param, Delete, UseInterceptors, Req, UseGuards, Put } from '@nestjs/common';
import { NovelService } from '../novel.service.js';
import { CreateNovelDto } from '../dto/create-novel.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFile } from '../decorators/image-file.decorator.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { OptionalImageFile } from '../decorators/optional-image-decorator.js';

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
  @Put(":id")
  async update(
    @Req() req,
    @Param("id") novelId,
    @OptionalImageFile() file: Express.Multer.File,
    @Body() createNovelDto: CreateNovelDto
  ) {
    return await this.novelService.update(req.user.id, novelId, file, createNovelDto);
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
