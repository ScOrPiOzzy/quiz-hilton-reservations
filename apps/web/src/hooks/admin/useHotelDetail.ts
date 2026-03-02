import { useQuery } from '~/lib/graphql-hooks';
import type { Hotel } from "~/lib/types";

const GET_HOTEL_DETAIL = `
  query GetHotelDetail($id: String!) {
    hotel(id: $id) {
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
      restaurants {
        id
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
        areas {
          id
          name
          type
          capacity
          minimumCapacity
        }
      }
      createdAt
      updatedAt
    }
  }
`;

interface GetHotelDetailResponse {
  hotel: Hotel;
}

export function useHotelDetail(hotelId: string) {
  return useQuery<GetHotelDetailResponse>(GET_HOTEL_DETAIL, {
    variables: { id: hotelId },
  });
}
