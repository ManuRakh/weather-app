import { HttpException, HttpStatus } from "@nestjs/common";

export const throwHttpException = (message: string, statusCode: number = HttpStatus.BAD_REQUEST) => {
  throw new HttpException(
    {
      error: message,
      details: {},
    },
    statusCode,
  );
};
