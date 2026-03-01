import { createSignal, createMemo } from "solid-js";
import type { Reservation, PaginatedResult } from "../../lib/types";
import { useQuery } from "../../lib/graphql-hooks";

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
        timeSlotName
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
}

interface GetReservationsResponse {
  reservations: PaginatedResult<Reservation>;
}

export const useReservationList = () => {
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(20);

  const { data, loading, error, refetch } = useQuery<GetReservationsResponse>(
    GET_RESERVATIONS,
    {
      variables: { input: { page: page(), pageSize: pageSize() } },
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
    refetch: () => fetchReservations(page(), pageSize()),
  };
};
