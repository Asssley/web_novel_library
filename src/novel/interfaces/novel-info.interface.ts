import { Comment, Genre, Novel } from "../../generated/client.js";

export interface NovelInfo extends Pick<Novel,
  "id" |
  "title" |
  "description" |
  "language" |
  "imagePath"
> {
  genres: Genre[];
}