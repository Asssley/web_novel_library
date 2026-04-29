import { User } from "../../generated/prisma/client";
import { Role } from "../../generated/prisma/enums";

export class AuthUserDto implements Pick<User, "email" | "password" | "role"> {
  email!: string;
  password!: string;
  role!: Role;
} 
