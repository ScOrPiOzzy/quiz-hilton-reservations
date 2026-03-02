import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const GRAPHQL_ENDPOINT = typeof window !== 'undefined' 
  ? (localStorage.getItem('graphql_endpoint') || 'http://localhost:3000/graphql')
  : 'http://localhost:3000/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("hilton_token") : null;
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

export const createApolloClient = (): ApolloClient<unknown> => {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
};

let apolloClient: ApolloClient<unknown> | null = null;

export const getApolloClient = (): ApolloClient<unknown> => {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};

export { ApolloClient };
