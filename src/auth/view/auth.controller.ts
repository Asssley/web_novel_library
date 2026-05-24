import { Controller, Get, Render } from "@nestjs/common";
import { AuthService } from "../auth.service.js";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get("login")
  @Render("pages/login")
  getLoginPage() {
    return {
      user: null,
      title: "Log in",
      styles: [
        "pages/login.css"
      ],
      scripts: [
        "login.js"
      ]
    }
  }

  @Get("register")
  @Render("pages/register")
  getRegisterPage() {
    return {
      user: null,
      title: "Register",
      styles: [
        "pages/login.css"
      ],
      scripts: [
        "register.js"
      ]
    }
  }
}