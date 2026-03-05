import { createSignal, createMemo } from "solid-js";
import type { Reservation, PaginatedResult } from "~/lib/types";
import { useQuery } from "~/lib/graphql-hooks";

const GET_RESERVATIONS = `
  query GetReservations($input: ReservationListInput!) {
    reservations(input: $input) {
      items {
        id
        userId
        customer {
          name
          phone
          email
        }
        hotelId
        hotel {
          id
          name
        }
        restaurantId
        restaurant {
          id
          name
        }
        areaId
        area {
          id
          name
        }
        reservationDate
        timeSlot
        status
        specialRequests
        estimatedArrivalTime
        verified
        verifiedAt
        confirmedAt
        confirmedBy
        completedAt
        cancelledAt
        cancelReason
        cancelledBy
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

interface ReservationListInput {
  page: number;
  pageSize: number;
  status?: string;
  userId?: string;
  storeId?: string;
  phone?: string;
  name?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface GetReservationsResponse {
  reservations: PaginatedResult<Reservation>;
}

export const useReservationList = () => {
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(20);
  const [filters, setFilters] = createSignal<
    Partial<Omit<ReservationListInput, "page" | "pageSize">>
  >({});

  const queryVariables = createMemo(() => ({
    input: {
      page: page(),
      pageSize: pageSize(),
      ...filters(),
    },
  }));

  const { data, loading, error, refetch } = useQuery<GetReservationsResponse>(
    GET_RESERVATIONS,
    {
      variables: queryVariables,
    },
  );

  const reservations = createMemo(() => data()?.reservations?.items || []);
  const pagination = createMemo(() => ({
    page: data()?.reservations?.page || 1,
    pageSize: data()?.reservations?.pageSize || 20,
    total: data()?.reservations?.total || 0,
    totalPages: data()?.reservations?.totalPages || 0,
  }));

  const setPagination = (newPage: number) => {
    setPage(newPage);
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const updateFilters = (
    newFilters: Partial<Omit<ReservationListInput, "page" | "pageSize">>,
  ) => {
    setFilters(newFilters);
    setPage(1); // 过滤器更改时重置到第一页
  };

  const fetchReservations = async (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
    await refetch();
  };

  return {
    reservations,
    loading,
    error,
    pagination,
    setPagination,
    setPageSize: changePageSize,
    updateFilters,
    filters,
    refetch: () => fetchReservations(page(), pageSize()),
  };
};
