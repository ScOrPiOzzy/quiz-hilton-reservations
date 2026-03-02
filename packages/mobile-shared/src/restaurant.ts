import { GET_RESTAURANT_DETAIL } from './api'
import type { ApolloClient } from './apollo'

export interface Restaurant {
  id: string
  name: string
  hotelId: string
  hotelName: string
  cuisine: string
  openingHours: string
  description: string
  images: string[]
  timeSlots: string[]
}

export const getRestaurantDetail = async (
  client: ApolloClient<unknown>,
  id: string
) => {
  const { data } = await client.query({
    query: GET_RESTAURANT_DETAIL,
    variables: { id },
  })
  return data.restaurant as Restaurant
}
