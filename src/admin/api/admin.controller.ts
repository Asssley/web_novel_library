import { Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from '../admin.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // Users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Post('users/:id/toggle-comment')
  toggleComment(
    @Req() req,
    @Param('id') id: string
  ) {
    return this.adminService.toggleComment(req.user.role, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Post('users/:id/toggle-novel')
  toggleNovel(
    @Req() req,
    @Param('id') id: string
  ) {
    return this.adminService.toggleNovelPermission(req.user.role, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Post('users/:id/toggle-role')
  toggleRole(
    @Req() req,
    @Param('id') id: string
  ) {
    return this.adminService.toggleRole(req.user.role, id);
  }


  // Novels
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Delete('novels/:id')
  deleteNovel(
    @Req() req,
    @Param('id') id: string
  ) {
    return this.adminService.deleteNovel(req.user.role, id);
  }

  //Comments

}