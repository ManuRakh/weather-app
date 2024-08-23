import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus } from "@nestjs/common";
import { map, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface ResponseError {
  error: string;
  message: string;
}

export interface ResponseResult<T> {
  result: T;
}

export type Response<T> = ResponseError | ResponseResult<T>;

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map(result => {
          const req = context.switchToHttp().getRequest();

          const method = req?.method;
          if (result) {
            const { result: resultArray, count } = result;
            if (resultArray && typeof count === "number") {
              return {
                result: resultArray,
                count,
              }
            }
            if (method.toLowerCase() === "delete") return { result: { deleted_at: result!.deleted_at }};

            return { result };
          }
          return { result };
        }),
      )
      .pipe(
        catchError(err => {
          const statusCode = err.response?.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const errorType = err.response?.error || "Internal Server Error";
          const respMessage = Array.isArray(err.response?.message) ? err.response?.message[0] : err.response?.message;
          const details = err.response?.details || {};
          const message = respMessage || err.message;
          return throwError(
            () =>
              new HttpException(
                {
                  error: errorType,
                  message,
                  details,
                },
                statusCode,
              ),
          );
        }),
      );
  }
}
