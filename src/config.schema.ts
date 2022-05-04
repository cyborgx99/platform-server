import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  SMTP_TRANSPORT: Joi.string().required(),
  JWT_RESET_SECRET: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});
