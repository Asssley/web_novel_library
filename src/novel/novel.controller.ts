import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { NovelService } from './novel.service.js';
import { CreateNovelDto } from './dto/create-novel.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ImageFile } from './decorators/image-file.decorator.js';

@Controller('novel')
export class NovelController {
  constructor(private readonly novelService: NovelService) { }

  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Req() req,
    @ImageFile() file: Express.Multer.File,
    @Body() createNovelDto: CreateNovelDto
  ) {
    return await this.novelService.create(req.user.id, file, createNovelDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor('image'))
  @Patch("update-image/:id")
  async updateImage(
    @Req() req,
    @ImageFile() file: Express.Multer.File,
    @Param("id") novelId: string
  ) {
    return this.novelService.updateImage(req.user.id, novelId, file);
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.novelService.getById(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteById(
    @Req() req,
    @Param("id") novelId: string
  ) {
    return this.novelService.deleteById(req.user.id, novelId);
  }
}
