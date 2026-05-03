import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch(':id/email')
  updateEmail(@Param('id') id: string, @Body() dto: UpdateEmailDto) {
    return this.userService.updateEmail(id, dto);
  }

  @Patch(':id/password')
  updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    return this.userService.updatePassword(id, dto);
  }
}
