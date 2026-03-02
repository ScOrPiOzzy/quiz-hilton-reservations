import { GET_RESERVATIONS, CREATE_RESERVATION } from './api'
import type { ApolloClient } from './apollo'

export interface Reservation {
  id: string
  restaurantId: string
  restaurantName: string
  hotelId: string
  hotelName: string
  date: string
  timeSlot: string
  name: string
  phone: string
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface CreateReservationInput {
  restaurantId: string
  date: string
  timeSlot: string
  name: string
  phone: string
  specialRequests?: string
}

export const getReservations = async (client: ApolloClient<unknown>) => {
  const { data } = await client.query({
    query: GET_RESERVATIONS,
  })
  return data.reservations as Reservation[]
}

export const createReservation = async (
  client: ApolloClient<unknown>,
  input: CreateReservationInput
) => {
  const { data } = await client.mutate({
    mutation: CREATE_RESERVATION,
    variables: { input },
  })
  return data.createReservation as Reservation
}
