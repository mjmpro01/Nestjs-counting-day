import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { AuthDTO } from './dto';
import { JwtService} from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
 constructor(private prismaService: PrismaService,
             private jwtService: JwtService,
             private configService: ConfigService) {
 }
 async register(authDTO: AuthDTO) {
  try {
   const hashedPassword = await argon.hash(authDTO.password);
   console.log(hashedPassword);
   const user = await this.prismaService.user.create({
    data: {
     email: authDTO.email,
     hashedPassword: hashedPassword
    },
    select: {
     id: true,
     email: true,
     createdAt: true
    }
   })
   return this.signJwtToken(user.id,user.email);
  } catch (e) {
   if (e.code == 'P2002') {
    throw new ForbiddenException(e.message)
   }
  }
 }


 async login(authDTO: AuthDTO) {
  const user = await this.prismaService.user.findFirst({
   where: {
    email: authDTO.email
   }
  });
  if (!user) {
   throw new Error('email or password are incorrect');
  }

  const passwordMatch = argon.verify(user.hashedPassword,authDTO.password);
  if (!passwordMatch) {
   throw new Error('email or password are incorrect');
  }
  delete user.hashedPassword;


  return await this.signJwtToken(user.id, user.email);
 }

 async signJwtToken(userId: number, email: string): Promise<{accessToken: string}> {
   const payload = {
     sub: userId,
     email
   }
   const jwt =  await this.jwtService.signAsync(payload, {
    expiresIn: '10m',
    secret: this.configService.get('JWT_SECRET')
   })
   return { accessToken: jwt }
 }
}
