import { Module } from '@nestjs/common';
import { BookmarksService as BookmarkService } from './bookmark.service.js';

@Module({
  providers: [BookmarkService],
  exports: [BookmarkService]
})
export class BookmarkModule {}
