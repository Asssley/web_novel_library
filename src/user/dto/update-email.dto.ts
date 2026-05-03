import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

export class UpdateEmailDto extends PickType(CreateUserDto, ["email"] as const) {}
