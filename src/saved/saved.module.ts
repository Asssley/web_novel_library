import { Module } from '@nestjs/common';
import { SavedService } from './saved.service.js';
import { SavedController } from './saved.controller.js';

@Module({
  controllers: [SavedController],
  providers: [SavedService],
})
export class SavedModule {}
