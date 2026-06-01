import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
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
