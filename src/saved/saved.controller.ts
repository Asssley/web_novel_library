import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SavedService } from './saved.service.js';
import { CreateSavedDto } from './dto/create-saved.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { GetSavedNovelsQueryDto } from './dto/get-saved-novels-query.dto.js';

@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(
    @Req() req,
    @Body() createSavedDto: CreateSavedDto
  ) {
    return this.savedService.create(req.user.id, createSavedDto);
  }

  @Get()
  findAll(
    @Req() req,
    @Body() dto: GetSavedNovelsQueryDto
  ) {
    return this.savedService.getSavedList(req.user.id, dto);
  }

  @Delete(':id')
  remove(
    @Req() req,
    @Param('id') savedNovelId: string
  ) {
    return this.savedService.remove(req.user.id, savedNovelId);
  }
}
