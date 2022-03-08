import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  COOKIE_OPTION_DOMAIN: Joi.string().required(),
});
