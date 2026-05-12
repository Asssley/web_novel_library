import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NovelRateService } from './novel-rate.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RateDto } from './dto/rate.dto.js';

@Controller('novel-rate/:novelId')
export class NovelRateController {
  constructor(private readonly novelRateService: NovelRateService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async setRate(
    @Req() req,
    @Param("novelId") novelId: string,
    @Body() dto: RateDto
  ) {
    this.novelRateService.setRate(req.user.id, novelId, dto);
  }
}
