import { BadRequestException, NotFoundException } from "@nestjs/common";

/**
 *
 * @param data object from json body
 * @param objectName name of object
 * @param method non required param, defined if method = POST
 * @returns
 */
export const validateFields = (data: Object, objectName: string): boolean => {
  const errors: string[] = [];
  for (const field in data) {
    if (field === "_id") errors.push(`${field} could not be set or modified`);
    if (data.hasOwnProperty(field) && data[field] === null)
      errors.push(`${objectName} with specified field ${field} could not be null`);
  }

  if (errors.length > 0) {
    throw errors.includes(`${objectName} with specified field`)
      ? new NotFoundException(errors.join(", "))
      : new BadRequestException(errors.join(", "));
  }

  return errors.length === 0;
};
