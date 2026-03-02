import { GET_HOTELS, GET_HOTEL_DETAIL } from "./api";
import type { ApolloClient } from "./apollo";
import { Restaurant } from "./restaurant";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  images: string[];
  amenities: string[];
  restaurants?: Restaurant[];
}

export const getHotels = async (
  client: ApolloClient<unknown>,
  city?: string,
) => {
  const { data } = await client.query({
    query: GET_HOTELS,
    variables: { city },
  });
  return data.hotels as Hotel[];
};

export const getHotelDetail = async (
  client: ApolloClient<unknown>,
  id: string,
) => {
  const { data } = await client.query({
    query: GET_HOTEL_DETAIL,
    variables: { id },
  });
  return data.hotel as Hotel;
};
