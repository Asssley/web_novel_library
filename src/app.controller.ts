import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  @Render("pages/home")
  async getHomePage() {
    const data = await this.appService.getHomePage()

    return {
      ...data,
      title: "NovelsHere",
      styles: [
        "pages/home.css"
      ],
      scripts: []
    };
  }
}