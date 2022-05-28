import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClassroomModule } from './classroom/classroom.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { parseCookieString } from './common/utils';
import { configValidationSchema } from './config.schema';
import { PrismaModule } from './database/prisma.module';
import { LessonModule } from './lesson/lesson.module';
import { LessonContentModule } from './lesson-content/lesson-content.module';
import { LessonImageModule } from './lesson-image/lesson-image.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
          'subscriptions-transport-ws': true, //dev
        },
        context: (context) => {
          if (context?.extra?.request) {
            const cookies = parseCookieString(
              context?.extra?.request.headers.cookie,
            );
            return {
              req: {
                ...context?.extra?.request,
                cookies,
                headers: {
                  ...context?.extra?.request?.headers,
                  ...context?.connectionParams,
                },
              },
            };
          }
          return { req: context?.req, res: context?.res };
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
            message: error?.extensions?.exception.code || error?.message,
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
    CloudinaryModule,
    LessonModule,
    ClassroomModule,
    LessonImageModule,
    LessonContentModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryProvider],
  exports: [],
})
export class AppModule {}
