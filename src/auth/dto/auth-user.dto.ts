import { User } from "../../generated/client.js";
import { Role } from "../../generated/enums.js";

export class AuthUserDto implements Pick<User, "id" | "role"> {
  id!: string;
  role!: Role;
} 
