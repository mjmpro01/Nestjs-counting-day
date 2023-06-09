import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NodeModule } from './node/node.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, NodeModule, AuthModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
