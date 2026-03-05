import { createSignal, createMemo } from "solid-js";
import type { Restaurant, Hotel, PaginatedResult } from "../../lib/types";
import { useQuery } from "../../lib/graphql-hooks";

const GET_HOTELS = `
  query GetHotels($input: HotelListInput!) {
    hotels(input: $input) {
      items {
        id
        name
        description
        address
        city
        country
        phone
        email
        status
        images {
          id
          url
          alt
          order
        }
        createdAt
        updatedAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

const GET_RESTAURANTS = `
  query GetRestaurants($input: RestaurantListInput!) {
    restaurants(input: $input) {
      items {
        id
        hotelId
        hotel {
          id
          name
        }
        name
        type
        description
        capacity
        status
        images {
          id
          url
          alt
          order
        }
        createdAt
        updatedAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

interface HotelListInput {
  page: number;
  pageSize: number;
}

interface RestaurantListInput {
  page: number;
  pageSize: number;
  hotelId?: string;
  search?: string;
  status?: string;
  type?: string;
}

interface GetHotelsResponse {
  hotels: PaginatedResult<Hotel>;
}

interface GetRestaurantsResponse {
  restaurants: PaginatedResult<Restaurant>;
}

export const useGetHotels = () => {
  const { data, loading, error, refetch } = useQuery<GetHotelsResponse>(
    GET_HOTELS,
    {
      variables: { input: { page: 1, pageSize: 100 } },
    },
  );

  return {
    hotels: () => data()?.hotels?.items || [],
    hotelsLoading: loading,
    error,
    pagination: () => ({
      page: data()?.hotels?.page || 1,
      pageSize: data()?.hotels?.pageSize || 20,
      total: data()?.hotels?.total || 0,
      totalPages: data()?.hotels?.totalPages || 0,
    }),
    refetch,
  };
};

export const useRestaurantList = () => {
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(20);
  const [filters, setFilters] = createSignal<Partial<Omit<RestaurantListInput, 'page' | 'pageSize'>>>({});

  const queryVariables = createMemo(() => ({
    input: {
      page: page(),
      pageSize: pageSize(),
      ...filters(),
    },
  }));

  const { data, loading, error, refetch } = useQuery<GetRestaurantsResponse>(
    GET_RESTAURANTS,
    {
      variables: queryVariables(),
    },
  );

  const restaurants = createMemo(() => data()?.restaurants?.items || []);
  const pagination = createMemo(() => ({
    page: data()?.restaurants?.page || 1,
    pageSize: data()?.restaurants?.pageSize || 20,
    total: data()?.restaurants?.total || 0,
    totalPages: data()?.restaurants?.totalPages || 0,
  }));

  const setPagination = (newPage: number) => {
    setPage(newPage);
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const updateFilters = (newFilters: Partial<Omit<RestaurantListInput, 'page' | 'pageSize'>>) => {
    setFilters(newFilters);
    setPage(1); // 过滤器更改时重置到第一页
  };

  const fetchRestaurants = async (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
    await refetch();
  };

  return {
    restaurants,
    hotels: useGetHotels().hotels,
    loading: loading,
    error,
    pagination,
    setPagination,
    setPageSize: changePageSize,
    updateFilters,
    filters,
    refetch: () => fetchRestaurants(page(), pageSize()),
  };
};
