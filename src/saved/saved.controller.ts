import { Controller, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SavedService } from './saved.service.js';
import { AuthGuard } from '@nestjs/passport';
import { CreateSavedDto } from './dto/create-saved.dto.js';

@Controller('saved-novels')
export class SavedController {
  constructor(private readonly savedService: SavedService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(
    @Req() req,
    @Body() createSavedDto: CreateSavedDto
  ) {
    return this.savedService.create(req.user.id, createSavedDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(
    @Req() req,
    @Param('id') savedNovelId: string
  ) {
    return this.savedService.remove(req.user.id, savedNovelId);
  }
}
