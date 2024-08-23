import { Type, plainToInstance } from "class-transformer";
import { IsNumber, validateSync, IsUrl, IsString, IsEmail } from "class-validator";

const parseBoolean = ({ value }) => value && /^(true|yes)$/i.test(value);

class EnvironmentVariables {
  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  RABBITMQ_URL: string;

  @IsString()
  RABBITMQ_QUEUE: string;

  @IsString()
  LOG_LEVEL: string;

  @IsString()
  jwt_secret: string;

  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @Type(() => Number)
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DATABASE: string;

  @IsString()
  @IsEmail()
  GMAIL_USER: string;

  @IsString()
  GMAIL_PASS: string;

  @IsNumber()
  @Type(() => Number)
  limits_ttl = 5000
  
  @IsNumber()
  @Type(() => Number)
  cache_ttl = 5000
  
  @IsNumber()
  @Type(() => Number)
  requests_limit=100
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
