import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NovelRateService } from './novel-rate.service.js';
import { RateDto } from './dto/rate.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('novel-rate/:novelId')
export class NovelRateController {
  constructor(private readonly novelRateService: NovelRateService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async setRate(
    @Req() req,
    @Param("novelId") novelId: string,
    @Body() dto: RateDto
  ) {
    this.novelRateService.setRate(req.user.id, novelId, dto);
  }
}
