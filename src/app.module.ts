import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { PrismaModule } from './database/prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: true,
        context: ({ req, res }: { req: Request; res: Response }) => {
          return {
            req,
            res,
          };
        },
        cors: {
          origin: configService.get('CORS_ORIGIN'),
          credentials: true,
        },
        formatError: (error: GraphQLError) => {
          const graphQLFormattedError: GraphQLFormattedError = {
            message:
              error?.extensions?.exception?.response?.message || error?.message,
          };
          return graphQLFormattedError;
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PrismaModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
