import { Transform, plainToInstance } from "class-transformer";
import { IsNumber, validateSync, IsUrl, IsString, IsBoolean, IsOptional } from "class-validator";

const parseBoolean = ({ value }) => value && /^(true|yes)$/i.test(value);

class EnvironmentVariables {
  @IsNumber()
  port: number;

  @IsString()
  AUTH_SERVICE_URL: string;

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
