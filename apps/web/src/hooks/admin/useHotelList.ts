import { createSignal, createMemo } from "solid-js";
import type { Hotel, PaginatedResult } from "../../lib/types";
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

interface HotelListInput {
  page: number;
  pageSize: number;
  city?: string;
  search?: string;
  status?: string;
}

interface GetHotelsResponse {
  hotels: PaginatedResult<Hotel>;
}

export const useHotelList = () => {
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(20);
  const [filters, setFilters] = createSignal<Partial<Omit<HotelListInput, 'page' | 'pageSize'>>>({});

  const queryVariables = createMemo(() => ({
    input: {
      page: page(),
      pageSize: pageSize(),
      ...filters(),
    },
  }));

  const { data, loading, error, refetch, graphqlErrors } = useQuery<GetHotelsResponse>(
    GET_HOTELS,
    { variables: queryVariables() }
  );

  const hotels = createMemo(() => data()?.hotels?.items || []);
  const pagination = createMemo(() => ({
    page: data()?.hotels?.page || 1,
    pageSize: data()?.hotels?.pageSize || 20,
    total: data()?.hotels?.total || 0,
    totalPages: data()?.hotels?.totalPages || 0,
  }));

  const setPagination = (newPage: number) => {
    setPage(newPage);
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const updateFilters = (newFilters: Partial<Omit<HotelListInput, 'page' | 'pageSize'>>) => {
    setFilters(newFilters);
    setPage(1); // 过滤器更改时重置到第一页
  };

  const fetchHotels = async (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
    await refetch();
  };

  return {
    hotels,
    loading,
    error,
    graphqlErrors,
    pagination,
    setPagination,
    setPageSize: changePageSize,
    updateFilters,
    filters,
    refetch: () => fetchHotels(page(), pageSize()),
  };
};
