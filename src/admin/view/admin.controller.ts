import { Controller, Get, Query, Render, Req, UseGuards } from '@nestjs/common';
import { AdminService } from '../admin.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { GetUsersQueryDto } from '../dto/get-users-for-admin-query.dto.js';
import { GetNovelsQueryDto } from '../dto/get-novels-for-admin-query.dto.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Get("users")
  @Render("pages/admin/users")
  async getUsersPage(
    @Req() req,
    @Query() dto: GetUsersQueryDto
  ) {
    const data = await this.adminService.getUsers(dto);

    return {
      ...data,
      user: req.user,
      title: "Admin pannel: users",
      styles: [
        "pages/admin.css",
        "parts/pagination.css"
      ],
      scripts: [
        "admin-users.js"
      ]
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Get("novels")
  @Render("pages/admin/novels")
  async getNovelsPage(
    @Req() req,
    @Query() dto: GetNovelsQueryDto
  ) {
    const data = await this.adminService.getNovels(dto);

    return {
      ...data,
      user: req.user,
      title: "Admin pannel: novels",
      styles: [
        "pages/admin.css",
        "parts/pagination.css"
      ],
      scripts: [
        "admin-novels.js"
      ]
    }
  }
}
