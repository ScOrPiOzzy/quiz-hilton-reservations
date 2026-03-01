import { createSignal, onMount, type Accessor } from "solid-js";
import { createGraphQLClient } from "@solid-primitives/graphql";
import { APP_CONFIG } from "./config";

const client = createGraphQLClient(`${APP_CONFIG.apiBaseUrl}/graphql`);

interface QueryOptions {
  variables?: Record<string, unknown>;
}

interface QueryResult<T> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  refetch: () => Promise<void>;
}

export function useQuery<T>(
  query: string,
  options: QueryOptions = {},
): QueryResult<T> {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await client(query, options.variables || {});
      setData(result as T);
    } catch (e) {
      setError(e as Error);
      setData(null);
    }
    setLoading(false);
  };

  onMount(() => executeQuery());

  return {
    data,
    loading,
    error,
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
  execute: (variables?: Record<string, unknown>) => Promise<void>;
}

export function useMutation<T>(
  mutation: string,
): MutationResult<T> {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);

  const execute = async (variables?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await client(mutation, variables || {});
      setData(result as T);
    } catch (e) {
      setError(e as Error);
      setData(null);
    }
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    execute,
  };
}
