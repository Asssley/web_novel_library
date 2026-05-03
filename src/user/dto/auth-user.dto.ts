import { User } from "../../generated/client.js";
import { Role } from "../../generated/enums.js";

export class AuthUserDto implements Pick<User, "email" | "password" | "role"> {
  email!: string;
  password!: string;
  role!: Role;
} 
