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
        
      )
      .pipe(
        catchError(err => {
          const statusCode = err.response?.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const errorType = err.response?.error || "Internal Server Error";
          const respMessage = Array.isArray(err.response?.message) ? err.response?.message[0] : err.response?.message;
          const details = err.response?.details || err.response?.data?.message || {};
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
