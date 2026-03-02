import { gql } from '@apollo/client'

export const GET_HOTELS = gql`
  query GetHotels($city: String, $limit: Int) {
    hotels(city: $city, limit: $limit) {
      id
      name
      city
      address
      phone
      description
      images
    }
  }
`

export const GET_HOTEL_DETAIL = gql`
  query GetHotelDetail($id: ID!) {
    hotel(id: $id) {
      id
      name
      city
      address
      phone
      description
      images
      amenities
      restaurants {
        id
        name
        cuisine
        openingHours
        description
      }
    }
  }
`

export const GET_RESTAURANT_DETAIL = gql`
  query GetRestaurantDetail($id: ID!) {
    restaurant(id: $id) {
      id
      name
      hotelId
      hotelName
      cuisine
      openingHours
      description
      images
      timeSlots
    }
  }
`

export const GET_RESERVATIONS = gql`
  query GetReservations {
    reservations {
      id
      restaurantId
      restaurantName
      hotelId
      hotelName
      date
      timeSlot
      name
      phone
      specialRequests
      status
      createdAt
    }
  }
`

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationInput!) {
    createReservation(input: $input) {
      id
      restaurantId
      restaurantName
      hotelId
      hotelName
      date
      timeSlot
      name
      phone
      specialRequests
      status
      createdAt
    }
  }
`
