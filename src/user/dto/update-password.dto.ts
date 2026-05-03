import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

export class UpdatePasswordDto extends PickType(CreateUserDto, ["password"] as const) {}
