import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service.js";
import { JwtPayload } from "../interfaces/jwt-payload.interface.js";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "secretKey",
      algorithms: ["HS256"]
    });
  }

  async validate(payload: JwtPayload) {
    return await this.authService.validate(payload.id);
  }
}