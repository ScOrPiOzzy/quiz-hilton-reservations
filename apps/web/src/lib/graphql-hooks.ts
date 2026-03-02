import { createSignal, onMount, type Accessor } from "solid-js";
import { APP_CONFIG } from "./config";

const API_URL = `${APP_CONFIG.apiBaseUrl}/graphql`;

interface QueryOptions {
  variables?: Record<string, unknown>;
}

interface QueryResult<T> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  graphqlErrors: Accessor<Array<{ message: string }>>;
  refetch: () => Promise<void>;
}

// 直接使用 fetch 来调用 GraphQL，绕过 @solid-primitives/graphql 的错误处理
async function graphqlRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  // 检查 GraphQL 错误
  if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
    return {
      data: result.data,
      errors: result.errors,
    };
  }

  return {
    data: result.data,
    errors: [],
  };
}

export function useQuery<T>(
  query: string,
  options: QueryOptions = {},
): QueryResult<T> {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [graphqlErrors, setGraphqlErrors] = createSignal<Array<{ message: string }>>([]);

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    setGraphqlErrors([]);

    try {
      const response = await graphqlRequest(query, options.variables || {});

      // 设置 GraphQL 错误
      if (response.errors && response.errors.length > 0) {
        setGraphqlErrors(response.errors);
      }

      // 设置数据（即使有错误也设置）
      if (response.data) {
        setData(response.data as T);
      } else {
        setData(null);
      }
    } catch (e) {
      setError(e as Error);
      setData(null);
      setGraphqlErrors([]);
    }
    setLoading(false);
  };

  onMount(() => executeQuery());

  return {
    data,
    loading,
    error,
    graphqlErrors,
    refetch: executeQuery,
  };
}

interface MutationOptions {
  variables?: Record<string, unknown>;
}

interface MutationResult<T> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  graphqlErrors: Accessor<Array<{ message: string }>>;
  execute: (variables?: Record<string, unknown>) => Promise<void>;
}

export function useMutation<T>(
  mutation: string,
): MutationResult<T> {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [graphqlErrors, setGraphqlErrors] = createSignal<Array<{ message: string }>>([]);

  const execute = async (variables?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    setGraphqlErrors([]);

    try {
      const response = await graphqlRequest(mutation, variables || {});

      // 设置 GraphQL 错误
      if (response.errors && response.errors.length > 0) {
        setGraphqlErrors(response.errors);
      }

      // 设置数据（即使有错误也设置）
      if (response.data) {
        setData(response.data as T);
      } else {
        setData(null);
      }
    } catch (e) {
      setError(e as Error);
      setData(null);
      setGraphqlErrors([]);
    }
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    graphqlErrors,
    execute,
  };
}
