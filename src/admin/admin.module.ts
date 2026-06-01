import { Module } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AdminController as AdminViewController} from './view/admin.controller.js';
import { AdminController as AdminApiController} from './api/admin.controller.js';

@Module({
  controllers: [
    AdminViewController,
    AdminApiController
  ],
  providers: [AdminService],
})
export class AdminModule {}
