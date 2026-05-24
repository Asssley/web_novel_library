import { Controller, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SavedService } from './saved.service.js';
import { CreateSavedDto } from './dto/create-saved.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('saved-novels')
export class SavedController {
  constructor(private readonly savedService: SavedService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createSavedDto: CreateSavedDto
  ) {
    return this.savedService.create(req.user.id, createSavedDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Req() req,
    @Param('id') savedNovelId: string
  ) {
    return this.savedService.remove(req.user.id, savedNovelId);
  }
}
