import { GraphQLError as GraphQLBaseError } from 'graphql';

/**
 * GraphQL 错误码枚举
 */
export enum GraphQLErrorCode {
  // 验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // 资源相关
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // 认证授权
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 业务逻辑
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  OPERATION_FAILED = 'OPERATION_FAILED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * 统一的 GraphQL 错误类
 * 扩展 GraphQL 错误以包含错误码和详细信息
 */
export class GraphQLError extends GraphQLBaseError {
  extensions: Record<string, any>;

  constructor(
    message: string,
    code: GraphQLErrorCode,
    details?: Record<string, any>,
  ) {
    super(message, {
      extensions: {
        code,
        details,
        timestamp: new Date().toISOString(),
      },
    });
    this.extensions = {
      code,
      details,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 验证错误
 */
export class ValidationError extends GraphQLError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, GraphQLErrorCode.VALIDATION_ERROR, details);
  }
}

/**
 * 资源未找到错误
 */
export class NotFoundError extends GraphQLError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`;
    super(message, GraphQLErrorCode.NOT_FOUND, { resource, id });
  }
}

/**
 * 未授权错误
 */
export class UnauthorizedError extends GraphQLError {
  constructor(message: string = 'Unauthorized') {
    super(message, GraphQLErrorCode.UNAUTHORIZED);
  }
}

/**
 * 禁止访问错误
 */
export class ForbiddenError extends GraphQLError {
  constructor(message: string = 'Forbidden') {
    super(message, GraphQLErrorCode.FORBIDDEN);
  }
}

/**
 * 业务操作失败错误
 */
export class OperationFailedError extends GraphQLError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, GraphQLErrorCode.OPERATION_FAILED, details);
  }
}

