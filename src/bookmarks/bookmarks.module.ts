import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service.js';

@Module({
  providers: [BookmarksService],
  exports: [BookmarksService]
})
export class BookmarksModule {}
