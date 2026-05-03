import { User } from "../../generated/client.js";

export class UserProfile implements Pick<User, "nickname" | "email" | "createdAt">  {
  nickname!: string;
  email!: string;
  createdAt!: Date;
} 