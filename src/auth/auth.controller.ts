import { Body, Controller, Post } from '@nestjs/common';
import { request } from 'http';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
@Controller('auth')
export class AuthController {
 constructor(private authService: AuthService) {

 }

 @Post("register")
 register(@Body() request: AuthDTO ) {
  return this.authService.register(request);
 }

 @Post("login")
 login(@Body() request: AuthDTO ) {
  return this.authService.login(request)
 }
}
