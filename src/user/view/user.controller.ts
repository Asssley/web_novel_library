import { Controller, Get, Render, Req } from '@nestjs/common';
import { UserService } from '../user.service.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get("profile")
  @Render("pages/profile")
  async getProfile(
    @Req() req
  ) {
    const data = await this.userService.getUserStats(req.user.id);

    return {
      ...data,
      title: "Profile",
      styles: [
        "pages/profile.css"
      ],
      scripts: [
        "log-out.js"
      ]
    };
  }
}
