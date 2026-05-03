import { JwtModuleOptions } from "@nestjs/jwt";

export async function getJwtConfig(): Promise<JwtModuleOptions> {
  return {
    secret: process.env.JWT_SECRET,
    signOptions: {
      algorithm: "HS256"
    },
    verifyOptions: {
      algorithms: ["HS256"],
      ignoreExpiration: false
    }
  };
}