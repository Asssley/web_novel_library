import { Module } from '@nestjs/common';
import { SavedService } from './saved.service.js';
import { SavedController as SavedApiController} from './api/saved.controller.js';
import { SavedController as SavedViewController} from './view/saved.controller.js';

@Module({
  controllers: [  
    SavedApiController,
    SavedViewController
  ],
  providers: [SavedService],
  exports: [SavedService]
})
export class SavedModule {}
