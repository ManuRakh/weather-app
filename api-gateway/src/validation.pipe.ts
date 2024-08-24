import {
  PipeTransform,
  Logger,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

const processErrorMessage = (errorMessage, constraints, childrens) => {
  try {
    if (constraints) return { errors: errorMessage };

    const errors = [];
    let propertyNumber = 0;

    if (errorMessage?.constraints) {
      errors.push(errorMessage.constraints);
      return { errors, propertyNumber };
    }

    if (childrens?.length) {
      const modifiedErrorMessage = JSON.parse(JSON.stringify(errorMessage));

      if (modifiedErrorMessage.property) propertyNumber = Number.parseInt(modifiedErrorMessage.property);

      for (const children of modifiedErrorMessage.children) {
        const { property, constraints } = children;
        const errMsg = { [property]: constraints };
        errors.push(errMsg);
      }
      // modifiedErrorMessage = modifiedErrorMessage.children;
    }

    return { errors, propertyNumber };
  } catch {
    return { errors: errorMessage };
  }
};

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  private logger = new Logger(CustomValidationPipe.name);

  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorObj: { id?: string } = {};
      errors.forEach(error => {
        const { property, constraints, children } = error;
        const errorDetails = Object.values(constraints || children)[0];
        this.logger.debug({ errorDetails, constraints, children });

        const { errors, propertyNumber } = processErrorMessage(errorDetails, constraints, children);

        errorObj[`${property}${propertyNumber >= 0 ? `[${propertyNumber}]` : ""}`] = errors;
      });
      if (errorObj?.id && errorObj.id.includes("with specified id not found"))
        throw new NotFoundException({
          error: "Not Found",
          message: "Not Found",
          details: errorObj,
        });

      throw new BadRequestException({
        error: "Bad Request",
        message: "Validation failure",
        details: errorObj,
      });
    }

    Object.keys(object).forEach(key => (object[key] === undefined ? delete object[key] : {}));

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
