import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { GraphQLError, GraphQLErrorCode } from '../errors/graphql-error';

/**
 * 统一的 GraphQL 异常过滤器
 * 捕获所有异常并转换为标准化的 GraphQL 错误响应
 */
@Catch()
export class GraphQLErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 处理自定义 GraphQL 错误
    if (exception instanceof GraphQLError) {
      return this.formatError(exception);
    }

    // 处理验证错误 (class-validator)
    if (this.isValidationError(exception)) {
      return new GraphQLError('输入验证失败', GraphQLErrorCode.VALIDATION_FAILED, {
        errors: this.extractValidationErrors(exception),
      });
    }

    // 处理其他未知错误
    return new GraphQLError(this.sanitizeErrorMessage(exception), GraphQLErrorCode.INTERNAL_ERROR, {
      statusCode: this.getStatusCode(exception),
    });
  }

  /**
   * 格式化自定义 GraphQL 错误
   */
  private formatError(error: GraphQLError): GraphQLError {
    return error;
  }

  /**
   * 判断是否为验证错误
   */
  private isValidationError(exception: any): boolean {
    return exception.response && Array.isArray(exception.response.message) && exception.response.message.some((msg: string) => msg.includes('validation failed'));
  }

  /**
   * 提取验证错误详情
   */
  private extractValidationErrors(exception: any): any[] {
    if (exception.response && Array.isArray(exception.response.message)) {
      return exception.response.message.map((msg: string) => {
        // 尝试解析 class-validator 的错误消息
        const match = msg.match(/property (\w+) has failed/);
        if (match) {
          return {
            property: match[1],
            message: msg,
          };
        }
        return { message: msg };
      });
    }
    return [];
  }

  /**
   * 获取 HTTP 状态码
   */
  private getStatusCode(exception: any): number {
    return exception.status || exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * 清理错误消息（避免敏感信息泄露）
   */
  private sanitizeErrorMessage(exception: any): string {
    const message = exception.message || 'An unexpected error occurred';

    // 生产环境应该隐藏详细错误信息
    if (process.env.NODE_ENV === 'production') {
      return 'An unexpected error occurred';
    }

    return message;
  }
}

/**
 * 验证错误异常类
 */
export class ValidationException extends Error {
  constructor(public errors: any[]) {
    super('Validation failed');
    this.name = 'ValidationException';
  }
}
