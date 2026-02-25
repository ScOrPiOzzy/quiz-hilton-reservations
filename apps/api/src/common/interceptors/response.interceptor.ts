import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({ code: 200, message: '操作成功', data })),
      catchError((error) => {
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const errorResponse = error.getResponse() as any;
          const message = errorResponse.message || error.message;
          return throwError(() => new HttpException({ code: status, message: Array.isArray(message) ? message[0] : message, data: null }, status));
        }
        return throwError(() => new HttpException({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: '服务器内部错误', data: null }, HttpStatus.INTERNAL_SERVER_ERROR));
      }),
    );
  }
}
