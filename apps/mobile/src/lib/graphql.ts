import { getToken } from './storage';

const isClient = typeof window !== 'undefined';

const GRAPHQL_ENDPOINT = isClient 
  ? (localStorage.getItem('graphql_endpoint') || 'http://localhost:3000/graphql')
  : 'http://localhost:3000/graphql';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!isClient) {
    return Promise.resolve([]) as Promise<T>;
  }
  
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('No data returned');
  }

  return result.data;
}

export function setGraphQLEndpoint(url: string): void {
  if (isClient) {
    localStorage.setItem('graphql_endpoint', url);
  }
}
