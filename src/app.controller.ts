import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  @Render("pages/home")
  async getHomePage(@Req() req) {
    const data = await this.appService.getHomePage()

    return {
      ...data,
      user: req.user,
      title: "NovelsHere",
      styles: [
        "pages/home.css"
      ],
      scripts: []
    };
  }
}