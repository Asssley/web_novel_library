import { User } from "../../generated/prisma/client";

export class UserProfile implements Pick<User, "nickname" | "email" | "createdAt">  {
  nickname!: string;
  email!: string;
  createdAt!: Date;
} 