import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Configs>) => ({
        type: 'postgres',
        host: configService.getOrThrow('typeorm.host', { infer: true }),
        port: configService.getOrThrow('typeorm.port', { infer: true }),
        username: configService.getOrThrow('typeorm.username', { infer: true }),
        password: configService.getOrThrow('typeorm.password', { infer: true }),
        database: configService.getOrThrow('typeorm.database', { infer: true }),
        synchronize: true
      }),
      inject: [ConfigService]
    })
  ],
  exports: [TypeOrmModule]
})
export class TypeormModule {}
