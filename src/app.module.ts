import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { Request, Response } from 'express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { PrismaModule } from './database/prisma.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.test'],
      validationSchema: configValidationSchema,
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        autoSchemaFile: true,
        subscriptions: {
          'graphql-ws': true,
        },
        context: ({ req, res }: { req: Request; res: Response }) => {
          return {
            req,
            res,
          };
        },
        cors: {
          origin: [
            configService.get('CORS_ORIGIN'),
            'https://studio.apollographql.com',
          ],
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
    AuthModule,
    UserModule,
    PrismaModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
