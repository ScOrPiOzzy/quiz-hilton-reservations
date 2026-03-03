export const GET_HOTELS = `
  query GetHotels {
    hotels(input: { pageSize: 20 }) {
      items {
        id
        name
        city
        address
        phone
        description
        images {
          id
          url
          alt
          order
        }
      }
    }
  }
`;

export const GET_HOTEL_DETAIL = `
  query GetHotelDetail($id: String!) {
    hotel(id: $id) {
      id
      name
      city
      address
      phone
      description
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
        hotelId
        hotel {
          id
          name
        }
        images {
          id
          url
          alt
          order
        }
      }
    }
  }
`;

export const GET_RESTAURANT_DETAIL = `
  query GetRestaurantDetail($id: String!) {
    findOne(id: $id) {
      id
      name
      type
      description
      capacity
      hotelId
      hotel {
        id
        name
      }
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
      }
    }
  }
`;

export const GET_RESERVATIONS = `
  query GetReservations($userId: String) {
    myReservations(userId: $userId) {
      id
      customer {
        name
        phone
      }
      restaurantId
      restaurant {
        id
        name
      }
      hotelId
      hotel {
        id
        name
      }
      reservationDate
      timeSlot
      partySize
      tableType
      specialRequests
      status
      createdAt
    }
  }
`;

export const CREATE_RESERVATION = `
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      customer {
        name
        phone
      }
      restaurantId
      hotelId
      reservationDate
      timeSlot
      partySize
      tableType
      specialRequests
      status
      createdAt
    }
  }
`;
